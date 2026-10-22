import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { pool } from "../../../utils/pg";
import { embeddings } from "./ai.embeddings";
import pgvector from "pgvector";

export const searchServices = tool(
  async ({ query, limit }) => {
    const searchTerm = query.trim();

    const result = await pool.query(
      `
      SELECT
        s.id,
        s.name,
        s.slug,
        s."shortDescription",
        s.description,
        s.eligibility,
        s."processingTime",
        s."officialUrl",
        s."lastVerifiedAt",
        c.name AS "categoryName",
        c.slug AS "categorySlug"
      FROM services AS s
      INNER JOIN category AS c
        ON c.id = s."categoryId"
      WHERE
        COALESCE(s."isPublished", FALSE) = TRUE
        AND COALESCE(s."isDeleted", FALSE) = FALSE
        AND s."verificationStatus" = 'VERIFIED'::verify_status
        AND COALESCE(c."isDeleted", FALSE) = FALSE
        AND (
          s.name ILIKE '%' || $1 || '%'
          OR s.slug ILIKE '%' || $1 || '%'
          OR s."shortDescription" ILIKE '%' || $1 || '%'
          OR s.description ILIKE '%' || $1 || '%'
          OR COALESCE(s.eligibility, '') ILIKE '%' || $1 || '%'
          OR c.name ILIKE '%' || $1 || '%'
          OR c.slug ILIKE '%' || $1 || '%'
        )
      ORDER BY s."lastVerifiedAt" DESC
      LIMIT $2
      `,
      [searchTerm, limit],
    );

    if (result.rows.length === 0) {
      return JSON.stringify({
        success: true,
        results: [],
        message: "No published, verified services matched this query.",
      });
    }

    return JSON.stringify({
      success: true,
      total: result.rows.length,
      results: result.rows,
    });
  },
  {
    name: "search_services",
    description:
      "Search the NagorikSheba PostgreSQL database for published and verified government services. Use this tool when users ask about a government service, its description, eligibility, processing time, or official website. For Bangla questions, use the corresponding service name in English if the database stores English names. Use only returned data and never invent missing information.",
    schema: z.object({
      query: z
        .string()
        .trim()
        .min(2)
        .max(120)
        .describe("The government service name or search keywords."),
      limit: z
        .number()
        .int()
        .min(1)
        .max(5)
        .default(5)
        .describe("Maximum number of matching services to return."),
    }),
  },
);

export const getServiceDetails = tool(
  async ({ serviceSlug }) => {
    const result = await pool.query(
      `
      SELECT
        s.id,
        s.name,
        s.slug,
        s."shortDescription",
        s.description,
        s.eligibility,
        s."processingTime",
        s."officialUrl",
        s."lastVerifiedAt",
        c.name AS "categoryName",

        COALESCE((
          SELECT json_agg(
            json_build_object(
              'name', r.name,
              'description', r.description,
              'isMandatory', r."isMandatory",
              'conditionDescription', r."conditionDescription"
            )
            ORDER BY r."sortOrder"
          )
          FROM servicerequirement r
          WHERE r."serviceId" = s.id
            AND COALESCE(r."isDeleted", FALSE) = FALSE
        ), '[]'::json) AS requirements,

        COALESCE((
          SELECT json_agg(
            json_build_object(
              'stepNumber', st."stepNumber",
              'title', st.title,
              'description', st.description,
              'actionType', st."actionType",
              'officialUrl', st."officialUrl"
            )
            ORDER BY st."stepNumber"
          )
          FROM servicestep st
          WHERE st."serviceId" = s.id
            AND COALESCE(st."isDeleted", FALSE) = FALSE
        ), '[]'::json) AS steps,

        COALESCE((
          SELECT json_agg(
            json_build_object(
              'name', f.name,
              'amount', f.amount,
              'currency', f.currency,
              'description', f.description,
              'effectiveFrom', f."effectiveFrom",
              'effectiveUntil', f."effectiveUntil"
            )
            ORDER BY f.name
          )
          FROM servicefee f
          WHERE f."serviceId" = s.id
            AND COALESCE(f."isDeleted", FALSE) = FALSE
            AND (
              f."effectiveFrom" IS NULL
              OR f."effectiveFrom" <= CURRENT_DATE
            )
            AND (
              f."effectiveUntil" IS NULL
              OR f."effectiveUntil" >= CURRENT_DATE
            )
        ), '[]'::json) AS fees,

        COALESCE((
          SELECT json_agg(
            json_build_object(
              'title', src.title,
              'url', src.url,
              'sourceType', src."sourceType",
              'lastCheckedAt', src."lastCheckedAt"
            )
            ORDER BY src."lastCheckedAt" DESC
          )
          FROM servicesource src
          WHERE src."serviceId" = s.id
            AND COALESCE(src."isDeleted", FALSE) = FALSE
        ), '[]'::json) AS sources

      FROM services s
      INNER JOIN category c
        ON c.id = s."categoryId"

      WHERE s.slug = $1
        AND s."isPublished" = TRUE
        AND COALESCE(s."isDeleted", FALSE) = FALSE
        AND s."verificationStatus" = 'VERIFIED'::verify_status
        AND COALESCE(c."isDeleted", FALSE) = FALSE

      LIMIT 1
      `,
      [serviceSlug],
    );

    if (result.rows.length === 0) {
      return JSON.stringify({
        success: false,
        message: "No published, verified service was found for this slug.",
      });
    }

    const service = result.rows[0];

    return JSON.stringify({
      success: true,

      availability: {
        overview: Boolean(service.description),
        eligibility: Boolean(service.eligibility?.trim()),
        requirements: service.requirements.length > 0,
        steps: service.steps.length > 0,
        fees: service.fees.length > 0,
        sources: service.sources.length > 0,
      },

      service,
    });
  },
  {
    name: "get_service_details",
    description:
      "Get complete details for a published, verified NagorikSheba government service, including eligibility, required documents, ordered application steps, currently effective fees, and official source links. First call search_services to find the service and obtain its exact slug. Then use that slug here. Never invent missing information.",
    schema: z.object({
      serviceSlug: z
        .string()
        .trim()
        .min(1)
        .max(255)
        .describe("The exact slug returned by search_services."),
    }),
  },
);

const MIN_RAG_SIMILARITY = Number(process.env.RAG_MIN_SIMILARITY ?? "0.45");

export const searchKnowledgeBase = tool(
  async ({ query, limit }) => {
    // Step 1: Convert the user's question into an embedding.
    const queryVector = await embeddings.embedQuery(query);

    if (queryVector.length !== 768) {
      throw new Error(
        `Expected 768 dimensions, received ${queryVector.length}`,
      );
    }

    // Step 2: Find the most relevant verified content.
    const result = await pool.query(
      `
      SELECT
        e.service_id AS "serviceId",
        e.chunk_key AS "chunkKey",
        e.chunk_type AS "chunkType",
        e.content,
        e.metadata,
        s.name AS "serviceName",
        s.slug AS "serviceSlug",
        1 - (e.embedding <=> $1::vector) AS similarity

      FROM service_embeddings e

      INNER JOIN services s
        ON s.id = e.service_id

      INNER JOIN category c
        ON c.id = s."categoryId"

      WHERE
        s."isPublished" = TRUE
        AND COALESCE(s."isDeleted", FALSE) = FALSE
        AND s."verificationStatus" = 'VERIFIED'::verify_status
        AND COALESCE(c."isDeleted", FALSE) = FALSE

      ORDER BY e.embedding <=> $1::vector ASC

      LIMIT $2
      `,
      [pgvector.toSql(queryVector), limit],
    );

    const scoredResults = result.rows.map((row) => ({
      ...row,
      similarity: Number(row.similarity),
    }));

    const relevantResults = scoredResults.filter(
      (row) => row.similarity >= MIN_RAG_SIMILARITY,
    );

    if (relevantResults.length === 0) {
      return JSON.stringify({
        success: true,
        found: false,
        results: [],
        message:
          "No sufficiently relevant verified information was found in the database.",
      });
    }

    return JSON.stringify({
      success: true,
      found: true,
      query,
      results: relevantResults,
    });
  },
  {
    name: "search_knowledge_base",
    description:
      "Search NagorikSheba's indexed government-service knowledge " +
      "using semantic similarity. Use for natural-language questions " +
      "about service procedures, eligibility, documents, fees, and " +
      "official sources. This tool returns retrieved evidence, not " +
      "a final answer. Use only the returned content as evidence.",
    schema: z.object({
      query: z.string().trim().min(2).max(1000),
      limit: z.number().int().min(1).max(8).default(3),
    }),
  },
);

export const aiTools = [searchServices, getServiceDetails, searchKnowledgeBase];
