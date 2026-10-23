import { Request } from "express";
import { pool } from "../../../utils/pg";
import AppError from "../../../app/errors/AppError";
import httpStatus from "http-status";

const createServiceIntoDB = async (req: Request) => {
  const {
    categoryId,
    name,
    slug,
    shortDescription,
    description,
    eligibility,
    processingTime,
    officialUrl,
    isPublished,
    requirements,
    steps,
    fees,
    sources,
  } = req.body;

  const isCategoryExist = await pool.query(
    `SELECT id FROM category WHERE id = $1 AND "isDeleted" = FALSE`,
    [categoryId],
  );
  if (!isCategoryExist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found.");
  }

  const existingService = await pool.query(
    `SELECT id FROM services WHERE slug = $1`,
    [slug],
  );
  if (existingService.rows.length) {
    throw new AppError(httpStatus.CONFLICT, "Service with this slug already exists.");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const serviceResult = await client.query(
      `INSERT INTO services ("categoryId", name, slug, "shortDescription", description, eligibility, "processingTime", "officialUrl", "isPublished") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        categoryId,
        name,
        slug,
        shortDescription,
        description,
        eligibility || null,
        processingTime || null,
        officialUrl || null,
        isPublished !== undefined ? isPublished : false,
      ],
    );

    const service = serviceResult.rows[0];
    const serviceId = service.id;

    // 1. Requirements
    const insertedRequirements: any[] = [];
    if (Array.isArray(requirements) && requirements.length > 0) {
      for (let i = 0; i < requirements.length; i++) {
        const reqItem = requirements[i];
        const res = await client.query(
          `INSERT INTO serviceRequirement ("serviceId", name, description, "isMandatory", "conditionDescription", "sortOrder")
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          [
            serviceId,
            reqItem.name,
            reqItem.description || null,
            reqItem.isMandatory !== undefined ? reqItem.isMandatory : true,
            reqItem.conditionDescription || null,
            reqItem.sortOrder !== undefined ? reqItem.sortOrder : i + 1,
          ],
        );
        insertedRequirements.push(res.rows[0]);
      }
    }

    // 2. Steps
    const insertedSteps: any[] = [];
    if (Array.isArray(steps) && steps.length > 0) {
      for (let i = 0; i < steps.length; i++) {
        const stepItem = steps[i];
        const res = await client.query(
          `INSERT INTO serviceStep ("serviceId", "stepNumber", title, description, "actionType", "officialUrl")
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          [
            serviceId,
            stepItem.stepNumber !== undefined ? stepItem.stepNumber : i + 1,
            stepItem.title,
            stepItem.description,
            stepItem.actionType || "READ_GUIDE",
            stepItem.officialUrl || null,
          ],
        );
        insertedSteps.push(res.rows[0]);
      }
    }

    // 3. Fees
    const insertedFees: any[] = [];
    if (Array.isArray(fees) && fees.length > 0) {
      for (let i = 0; i < fees.length; i++) {
        const feeItem = fees[i];
        const res = await client.query(
          `INSERT INTO serviceFee ("serviceId", name, amount, currency, description, "effectiveFrom", "effectiveUntil")
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [
            serviceId,
            feeItem.name,
            feeItem.amount !== undefined && feeItem.amount !== "" ? feeItem.amount : null,
            feeItem.currency || "BDT",
            feeItem.description || null,
            feeItem.effectiveFrom || null,
            feeItem.effectiveUntil || null,
          ],
        );
        insertedFees.push(res.rows[0]);
      }
    }

    // 4. Sources
    const insertedSources: any[] = [];
    if (Array.isArray(sources) && sources.length > 0) {
      for (let i = 0; i < sources.length; i++) {
        const srcItem = sources[i];
        const res = await client.query(
          `INSERT INTO serviceSource ("serviceId", title, url, "sourceType")
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [
            serviceId,
            srcItem.title,
            srcItem.url,
            srcItem.sourceType || "OFFICIAL_PORTAL",
          ],
        );
        insertedSources.push(res.rows[0]);
      }
    }

    await client.query("COMMIT");

    return {
      ...service,
      requirements: insertedRequirements,
      steps: insertedSteps,
      fees: insertedFees,
      sources: insertedSources,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getAllServicesFromDB = async (query: any) => {
  const { categoryId, isPublished, search, page = 1, limit = 10 } = query;
  const offset = (Number(page) - 1) * Number(limit);

  let conditions = [`s."isDeleted" = FALSE`];
  const params: any[] = [];
  let paramIdx = 1;

  if (categoryId) {
    conditions.push(`s."categoryId" = $${paramIdx++}`);
    params.push(categoryId);
  }
  if (isPublished !== undefined && isPublished !== "" && isPublished !== "all") {
    conditions.push(`s."isPublished" = $${paramIdx++}`);
    params.push(isPublished === "true" || isPublished === true);
  }
  if (search) {
    conditions.push(`(s.name ILIKE $${paramIdx++} OR s."shortDescription" ILIKE $${paramIdx++})`);
    params.push(`%${search}%`, `%${search}%`);
  }

  const whereClause = conditions.join(" AND ");

  const result = await pool.query(
    `SELECT s.*, c.name as category_name, c.slug as category_slug,
            (SELECT COUNT(*)::int FROM serviceRequirement sr WHERE sr."serviceId" = s.id AND sr."isDeleted" = FALSE) AS "requirementCount",
            (SELECT COUNT(*)::int FROM serviceStep st WHERE st."serviceId" = s.id AND st."isDeleted" = FALSE) AS "stepCount",
            (SELECT COUNT(*)::int FROM serviceFee sf WHERE sf."serviceId" = s.id AND sf."isDeleted" = FALSE) AS "feeCount",
            (SELECT COUNT(*)::int FROM serviceSource ss WHERE ss."serviceId" = s.id AND ss."isDeleted" = FALSE) AS "sourceCount"
     FROM services s 
     LEFT JOIN category c ON s."categoryId" = c.id 
     WHERE ${whereClause} 
     ORDER BY s."createdAt" DESC 
     LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
    [...params, Number(limit), offset],
  );

  const countResult = await pool.query(
    `SELECT COUNT(s.id) FROM services s WHERE ${whereClause}`,
    params,
  );
  const total = parseInt(countResult.rows[0].count, 10);

  return {
    data: result.rows,
    meta: { page: Number(page), limit: Number(limit), total },
  };
};

const getSingleServiceFromDB = async (serviceId: string) => {
  const result = await pool.query(
    `SELECT s.*, c.name as category_name, c.slug as category_slug 
     FROM services s 
     LEFT JOIN category c ON s."categoryId" = c.id 
     WHERE s.id = $1 AND s."isDeleted" = FALSE`,
    [serviceId],
  );
  if (!result.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found.");
  }

  const [reqResult, stepResult, feeResult, sourceResult] = await Promise.all([
    pool.query(
      `SELECT * FROM serviceRequirement WHERE "serviceId" = $1 AND "isDeleted" = FALSE ORDER BY "sortOrder" ASC`,
      [serviceId],
    ),
    pool.query(
      `SELECT * FROM serviceStep WHERE "serviceId" = $1 AND "isDeleted" = FALSE ORDER BY "stepNumber" ASC`,
      [serviceId],
    ),
    pool.query(
      `SELECT * FROM serviceFee WHERE "serviceId" = $1 AND "isDeleted" = FALSE ORDER BY "createdAt" ASC`,
      [serviceId],
    ),
    pool.query(
      `SELECT * FROM serviceSource WHERE "serviceId" = $1 AND "isDeleted" = FALSE ORDER BY "createdAt" ASC`,
      [serviceId],
    ),
  ]);

  return {
    ...result.rows[0],
    requirements: reqResult.rows,
    steps: stepResult.rows,
    fees: feeResult.rows,
    sources: sourceResult.rows,
  };
};

const updateServiceIntoDB = async (req: Request) => {
  const { service_id } = req.params;
  const payload = req.body;

  const isExistService = await pool.query(
    `SELECT id FROM services WHERE id = $1 AND "isDeleted" = FALSE`,
    [service_id],
  );
  if (!isExistService.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found.");
  }

  if (payload.slug) {
    const slugCheck = await pool.query(
      `SELECT id FROM services WHERE slug = $1 AND id != $2`,
      [payload.slug, service_id],
    );
    if (slugCheck.rows.length) {
      throw new AppError(httpStatus.CONFLICT, "Service with this slug already exists.");
    }
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIdx = 1;

    const updatableFields = [
      "categoryId", "name", "slug", "shortDescription", "description",
      "eligibility", "processingTime", "officialUrl", "verificationStatus", "isPublished",
    ];

    for (const field of updatableFields) {
      if (payload[field] !== undefined) {
        const dbField = field === "categoryId" ? `"categoryId"` : field === "shortDescription" ? `"shortDescription"` : field === "processingTime" ? `"processingTime"` : field === "officialUrl" ? `"officialUrl"` : field === "verificationStatus" ? `"verificationStatus"` : field === "isPublished" ? `"isPublished"` : field;
        setClauses.push(`${dbField} = $${paramIdx++}`);
        values.push(payload[field]);
      }
    }

    let updatedService = isExistService.rows[0];

    if (setClauses.length > 0) {
      setClauses.push(`"updatedAt" = CURRENT_TIMESTAMP`);
      values.push(service_id);

      const result = await client.query(
        `UPDATE services SET ${setClauses.join(", ")} WHERE id = $${paramIdx} AND "isDeleted" = FALSE RETURNING *`,
        values,
      );
      updatedService = result.rows[0];
    }

    // Replace requirements if provided
    if (Array.isArray(payload.requirements)) {
      await client.query(
        `DELETE FROM serviceRequirement WHERE "serviceId" = $1`,
        [service_id],
      );
      for (let i = 0; i < payload.requirements.length; i++) {
        const reqItem = payload.requirements[i];
        await client.query(
          `INSERT INTO serviceRequirement ("serviceId", name, description, "isMandatory", "conditionDescription", "sortOrder")
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            service_id,
            reqItem.name,
            reqItem.description || null,
            reqItem.isMandatory !== undefined ? reqItem.isMandatory : true,
            reqItem.conditionDescription || null,
            reqItem.sortOrder !== undefined ? reqItem.sortOrder : i + 1,
          ],
        );
      }
    }

    // Replace steps if provided
    if (Array.isArray(payload.steps)) {
      await client.query(
        `DELETE FROM serviceStep WHERE "serviceId" = $1`,
        [service_id],
      );
      for (let i = 0; i < payload.steps.length; i++) {
        const stepItem = payload.steps[i];
        await client.query(
          `INSERT INTO serviceStep ("serviceId", "stepNumber", title, description, "actionType", "officialUrl")
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            service_id,
            stepItem.stepNumber !== undefined ? stepItem.stepNumber : i + 1,
            stepItem.title,
            stepItem.description,
            stepItem.actionType || "READ_GUIDE",
            stepItem.officialUrl || null,
          ],
        );
      }
    }

    // Replace fees if provided
    if (Array.isArray(payload.fees)) {
      await client.query(
        `DELETE FROM serviceFee WHERE "serviceId" = $1`,
        [service_id],
      );
      for (let i = 0; i < payload.fees.length; i++) {
        const feeItem = payload.fees[i];
        await client.query(
          `INSERT INTO serviceFee ("serviceId", name, amount, currency, description, "effectiveFrom", "effectiveUntil")
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            service_id,
            feeItem.name,
            feeItem.amount !== undefined && feeItem.amount !== "" ? feeItem.amount : null,
            feeItem.currency || "BDT",
            feeItem.description || null,
            feeItem.effectiveFrom || null,
            feeItem.effectiveUntil || null,
          ],
        );
      }
    }

    // Replace sources if provided
    if (Array.isArray(payload.sources)) {
      await client.query(
        `DELETE FROM serviceSource WHERE "serviceId" = $1`,
        [service_id],
      );
      for (let i = 0; i < payload.sources.length; i++) {
        const srcItem = payload.sources[i];
        await client.query(
          `INSERT INTO serviceSource ("serviceId", title, url, "sourceType")
           VALUES ($1, $2, $3, $4)`,
          [
            service_id,
            srcItem.title,
            srcItem.url,
            srcItem.sourceType || "OFFICIAL_PORTAL",
          ],
        );
      }
    }

    await client.query("COMMIT");

    return updatedService;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const deleteServiceFromDB = async (service_id: string) => {
  const isExistService = await pool.query(
    `SELECT id FROM services WHERE id = $1 AND "isDeleted" = FALSE`,
    [service_id],
  );
  if (!isExistService.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found.");
  }

  const result = await pool.query(
    `UPDATE services SET "isDeleted" = TRUE, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    [service_id],
  );

  return result.rows[0];
};

export const ServiceServices = {
  createServiceIntoDB,
  getAllServicesFromDB,
  getSingleServiceFromDB,
  updateServiceIntoDB,
  deleteServiceFromDB,
};
