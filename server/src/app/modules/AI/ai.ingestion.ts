import { createHash } from "node:crypto";
import pgvector from "pgvector";

import { embeddings } from "./ai.embeddings";
import { pool } from "../../../utils/pg";

type ChunkType =
  | "overview"
  | "eligibility"
  | "requirement"
  | "step"
  | "fee"
  | "source";

interface ServiceRow {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  eligibility: string | null;
  processingTime: string | null;
  officialUrl: string | null;
  lastVerifiedAt: string;
  categoryName: string;
  requirements: {
    id: string;
    name: string;
    description: string | null;
    isMandatory: boolean;
    conditionDescription: string | null;
  }[];
  steps: {
    id: string;
    stepNumber: number;
    title: string;
    description: string;
    actionType: string;
    officialUrl: string | null;
  }[];
  fees: {
    id: string;
    name: string;
    amount: string | null;
    currency: string;
    description: string | null;
  }[];
  sources: {
    id: string;
    title: string;
    url: string;
    sourceType: string;
    lastCheckedAt: string;
  }[];
}

interface ServiceChunk {
  serviceId: string;
  chunkKey: string;
  chunkType: ChunkType;
  content: string;
  metadata: Record<string, unknown>;
  contentHash: string;
}

function createChunk(
  service: ServiceRow,
  chunkKey: string,
  chunkType: ChunkType,
  content: string,
): ServiceChunk {
  const metadata = {
    serviceName: service.name,
    serviceSlug: service.slug,
    categoryName: service.categoryName,
    officialUrl: service.officialUrl,
    serviceLastVerifiedAt: service.lastVerifiedAt,
    sources: service.sources,
  };

  return {
    serviceId: service.id,
    chunkKey,
    chunkType,
    content,
    metadata,
    contentHash: createHash("sha256").update(content).digest("hex"),
  };
}

function buildChunks(service: ServiceRow): ServiceChunk[] {
  const chunks: ServiceChunk[] = [];

  chunks.push(
    createChunk(
      service,
      "overview",
      "overview",
      [
        `Government service: ${service.name}`,
        `Category: ${service.categoryName}`,
        `Short description: ${service.shortDescription}`,
        `Description: ${service.description}`,
        `Processing time: ${service.processingTime ?? "Not available in database"}`,
        `Official URL: ${service.officialUrl ?? "Not available in database"}`,
      ].join("\n"),
    ),
  );

  if (service.eligibility?.trim()) {
    chunks.push(
      createChunk(
        service,
        "eligibility",
        "eligibility",
        `Service: ${service.name}\nEligibility: ${service.eligibility}`,
      ),
    );
  }

  for (const requirement of service.requirements) {
    chunks.push(
      createChunk(
        service,
        `requirement:${requirement.id}`,
        "requirement",
        [
          `Service: ${service.name}`,
          `Document or requirement: ${requirement.name}`,
          `Description: ${requirement.description ?? "Not specified"}`,
          `Mandatory: ${requirement.isMandatory ? "Yes" : "No"}`,
          `Condition: ${requirement.conditionDescription ?? "Not specified"}`,
        ].join("\n"),
      ),
    );
  }

  for (const step of service.steps) {
    chunks.push(
      createChunk(
        service,
        `step:${step.stepNumber}`,
        "step",
        [
          `Service: ${service.name}`,
          `Step ${step.stepNumber}: ${step.title}`,
          `Instructions: ${step.description}`,
          `Action type: ${step.actionType}`,
          `Official URL: ${step.officialUrl ?? "Not specified"}`,
        ].join("\n"),
      ),
    );
  }

  for (const fee of service.fees) {
    chunks.push(
      createChunk(
        service,
        `fee:${fee.id}`,
        "fee",
        [
          `Service: ${service.name}`,
          `Fee name: ${fee.name}`,
          `Amount: ${fee.amount ?? "Not specified in database"}`,
          `Currency: ${fee.currency}`,
          `Description: ${fee.description ?? "Not specified"}`,
        ].join("\n"),
      ),
    );
  }

  for (const source of service.sources) {
    chunks.push(
      createChunk(
        service,
        `source:${source.id}`,
        "source",
        [
          `Service: ${service.name}`,
          `Source title: ${source.title}`,
          `Source type: ${source.sourceType}`,
          `URL: ${source.url}`,
          `Last checked: ${source.lastCheckedAt}`,
        ].join("\n"),
      ),
    );
  }

  return chunks;
}

export async function ingestVerifiedServices() {
  const result = await pool.query<ServiceRow>(`
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
            'id', r.id,
            'name', r.name,
            'description', r.description,
            'isMandatory', r."isMandatory",
            'conditionDescription', r."conditionDescription"
          ) ORDER BY r."sortOrder"
        )
        FROM servicerequirement r
        WHERE r."serviceId" = s.id
          AND COALESCE(r."isDeleted", FALSE) = FALSE
      ), '[]'::json) AS requirements,

      COALESCE((
        SELECT json_agg(
          json_build_object(
            'id', st.id,
            'stepNumber', st."stepNumber",
            'title', st.title,
            'description', st.description,
            'actionType', st."actionType",
            'officialUrl', st."officialUrl"
          ) ORDER BY st."stepNumber"
        )
        FROM servicestep st
        WHERE st."serviceId" = s.id
          AND COALESCE(st."isDeleted", FALSE) = FALSE
      ), '[]'::json) AS steps,

      COALESCE((
        SELECT json_agg(
          json_build_object(
            'id', f.id,
            'name', f.name,
            'amount', f.amount,
            'currency', f.currency,
            'description', f.description
          ) ORDER BY f.name
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
            'id', src.id,
            'title', src.title,
            'url', src.url,
            'sourceType', src."sourceType",
            'lastCheckedAt', src."lastCheckedAt"
          ) ORDER BY src."lastCheckedAt" DESC
        )
        FROM servicesource src
        WHERE src."serviceId" = s.id
          AND COALESCE(src."isDeleted", FALSE) = FALSE
      ), '[]'::json) AS sources

    FROM services s
    INNER JOIN category c
      ON c.id = s."categoryId"

    WHERE s."isPublished" = TRUE
      AND COALESCE(s."isDeleted", FALSE) = FALSE
      AND s."verificationStatus" = 'VERIFIED'::verify_status
      AND COALESCE(c."isDeleted", FALSE) = FALSE
  `);

  let servicesProcessed = 0;
  let chunksProcessed = 0;

  for (const service of result.rows) {
    const chunks = buildChunks(service);

    if (chunks.length === 0) continue;

    // Convert chunks into embeddings.
    const vectors = await embeddings.embedDocuments(
      chunks.map((chunk) => chunk.content),
    );

    // 1. Check whether every chunk received an embedding.
    if (vectors.length !== chunks.length) {
      console.error("Embedding count mismatch:", {
        service: service.slug,
        expectedChunks: chunks.length,
        receivedVectors: vectors.length,
      });

      throw new Error(`Embedding count mismatch for service: ${service.slug}`);
    }

    // 2. Check the dimension of every embedding.
    const invalidVectors = vectors
      .map((vector, index) => ({
        chunkKey: chunks[index].chunkKey,
        dimensions: vector.length,
      }))
      .filter((item) => item.dimensions !== 768);

    if (invalidVectors.length > 0) {
      console.error("Embedding dimension mismatch:", {
        service: service.slug,
        expectedDimensions: 768,
        invalidVectors,
      });

      throw new Error(
        `Invalid embedding dimensions for service: ${service.slug}`,
      );
    }
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const vector = vectors[i];

        await client.query(
          `
          INSERT INTO service_embeddings (
            service_id,
            chunk_key,
            chunk_type,
            content,
            embedding,
            metadata,
            content_hash
          )
          VALUES ($1, $2, $3, $4, $5::vector, $6::jsonb, $7)
          ON CONFLICT (service_id, chunk_key)
          DO UPDATE SET
            chunk_type = EXCLUDED.chunk_type,
            content = EXCLUDED.content,
            embedding = EXCLUDED.embedding,
            metadata = EXCLUDED.metadata,
            content_hash = EXCLUDED.content_hash,
            updated_at = CURRENT_TIMESTAMP
          `,
          [
            chunk.serviceId,
            chunk.chunkKey,
            chunk.chunkType,
            chunk.content,
            pgvector.toSql(vector),
            JSON.stringify(chunk.metadata),
            chunk.contentHash,
          ],
        );
      }

      // Remove obsolete chunks for this service.
      await client.query(
        `
        DELETE FROM service_embeddings
        WHERE service_id = $1
          AND NOT (chunk_key = ANY($2::text[]))
        `,
        [service.id, chunks.map((chunk) => chunk.chunkKey)],
      );

      await client.query("COMMIT");

      servicesProcessed++;
      chunksProcessed += chunks.length;

      console.log(`Indexed ${service.slug}: ${chunks.length} chunks`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Remove embeddings for services that are no longer eligible
  // for indexing. This runs only after all eligible services succeed.
  const cleanup = await pool.query(`
    DELETE FROM service_embeddings e
    WHERE NOT EXISTS (
      SELECT 1
      FROM services s
      INNER JOIN category c ON c.id = s."categoryId"
      WHERE s.id = e.service_id
        AND s."isPublished" = TRUE
        AND COALESCE(s."isDeleted", FALSE) = FALSE
        AND s."verificationStatus" = 'VERIFIED'::verify_status
        AND COALESCE(c."isDeleted", FALSE) = FALSE
    )
  `);

  return {
    servicesProcessed,
    chunksProcessed,
    staleChunksRemoved: cleanup.rowCount ?? 0,
  };
}
