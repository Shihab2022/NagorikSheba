import { Request } from "express";
import { pool } from "../../../utils/pg";
import AppError from "../../../app/errors/AppError";
import httpStatus from "http-status";

const now = (): string => new Date().toISOString();

const createTrackedServiceIntoDB = async (req: Request) => {
  const userId = (req as any).user?.id;
  const { serviceSlug, title, referenceNumber, status } = req.body;

  // Resolve the service by its stable slug rather than a hardcoded UUID so the
  // call keeps working regardless of which id the row was created with.
  const serviceExist = await pool.query(
    `SELECT id, slug FROM services WHERE slug = $1 AND "isDeleted" = FALSE LIMIT 1`,
    [serviceSlug],
  );
  if (!serviceExist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found.");
  }
  const serviceId: string = serviceExist.rows[0].id;

  // If user already actively tracks this service and didn't specify a new title/reference, return it
  if (!title && !referenceNumber) {
    const existingActive = await pool.query(
      `SELECT * FROM trackedService
       WHERE "userId" = $1 AND "serviceId" = $2 AND status NOT IN ('COMPLETED_BY_USER', 'CANCELLED')
       LIMIT 1`,
      [userId, serviceId],
    );
    if (existingActive.rows.length) {
      return existingActive.rows[0];
    }
  }

  const tsNow = now();
  const finalStatus = status || "PREPARING";

  const result = await pool.query(
    `INSERT INTO trackedService (
       "userId", "serviceId", title, status, "referenceNumber",
       "startedAt", "lastUpdatedAt", "createdAt", "updatedAt"
     )
     VALUES ($1, $2, $3, $4, $5, $6, $6, $6, $6)
     RETURNING *`,
    [userId, serviceId, title || null, finalStatus, referenceNumber || null, tsNow],
  );

  const tracked = result.rows[0];

  // Pre-seed tracked steps for all active steps of the service
  const stepRows = await pool.query(
    `SELECT id FROM serviceStep WHERE "serviceId" = $1 AND "isDeleted" = FALSE ORDER BY "stepNumber" ASC`,
    [serviceId],
  );
  for (const step of stepRows.rows) {
    await pool.query(
      `INSERT INTO trackedStep (
         "trackedServiceId", "serviceStepId", status, "createdAt", "updatedAt"
       )
       VALUES ($1, $2, 'NOT_STARTED', $3, $3)
       ON CONFLICT ("trackedServiceId", "serviceStepId") DO NOTHING`,
      [tracked.id, step.id, tsNow],
    );
  }

  return tracked;
};

const getMyTrackedServicesFromDB = async (userId: string) => {
  const result = await pool.query(
    `SELECT ts.*, s.name AS service_name, s.slug AS service_slug,
            c.name AS service_category, c.icon AS service_icon
     FROM trackedService ts
     JOIN services s ON s.id = ts."serviceId" AND s."isDeleted" = FALSE
     LEFT JOIN category c ON c.id = s."categoryId" AND c."isDeleted" = FALSE
     WHERE ts."userId" = $1
     ORDER BY ts."updatedAt" DESC`,
    [userId],
  );
  return result.rows;
};

const getSingleTrackedServiceFromDB = async (
  trackedServiceId: string,
  userId: string,
  userRole?: string,
) => {
  const result = await pool.query(
    `SELECT ts.*, 
            s.name AS service_name, 
            s.slug AS service_slug,
            s."shortDescription" AS service_short_description,
            s.description AS service_description,
            s.eligibility AS service_eligibility,
            s."processingTime" AS service_processing_time,
            s."officialUrl" AS service_official_url,
            c.name AS service_category, 
            c.icon AS service_icon
     FROM trackedService ts
     LEFT JOIN services s ON s.id = ts."serviceId" AND s."isDeleted" = FALSE
     LEFT JOIN category c ON c.id = s."categoryId" AND c."isDeleted" = FALSE
     WHERE ts.id = $1 AND (ts."userId" = $2 OR $3 = 'ADMIN')
     LIMIT 1`,
    [trackedServiceId, userId, userRole || "USER"],
  );
  if (!result.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Tracked service not found.");
  }
  return result.rows[0];
};

const updateTrackedServiceIntoDB = async (req: Request) => {
  const userId = (req as any).user?.id;
  const userRole = (req as any).user?.role;
  const { tracked_service_id } = req.params;
  const { title, status, referenceNumber, completedAt } = req.body;

  const exist = await pool.query(
    `SELECT id, status, "completedAt" FROM trackedService
     WHERE id = $1 AND ("userId" = $2 OR $3 = 'ADMIN') LIMIT 1`,
    [tracked_service_id, userId, userRole || "USER"],
  );
  if (!exist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Tracked service not found.");
  }

  const tsNow = now();
  const existingCompletedAt = exist.rows[0].completedAt;
  let finalCompletedAt = existingCompletedAt;
  if (status === "COMPLETED_BY_USER" && !existingCompletedAt) {
    finalCompletedAt = tsNow;
  } else if (status !== "COMPLETED_BY_USER") {
    finalCompletedAt = null;
  }

  const result = await pool.query(
    `UPDATE trackedService
       SET title = COALESCE($1, title),
           status = COALESCE($2, status),
           "referenceNumber" = COALESCE($3, "referenceNumber"),
           "completedAt" = $4,
           "lastUpdatedAt" = $5,
           "updatedAt" = $5
     WHERE id = $6 AND ("userId" = $7 OR $8 = 'ADMIN')
     RETURNING *`,
    [title, status, referenceNumber, finalCompletedAt, tsNow, tracked_service_id, userId, userRole || "USER"],
  );
  return result.rows[0];
};

const deleteTrackedServiceFromDB = async (
  trackedServiceId: string,
  userId: string,
  userRole?: string,
) => {
  const exist = await pool.query(
    `SELECT id FROM trackedService WHERE id = $1 AND ("userId" = $2 OR $3 = 'ADMIN') LIMIT 1`,
    [trackedServiceId, userId, userRole || "USER"],
  );
  if (!exist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Tracked service not found.");
  }
  await pool.query(
    `DELETE FROM trackedStep WHERE "trackedServiceId" = $1`,
    [trackedServiceId],
  );
  const result = await pool.query(
    `DELETE FROM trackedService WHERE id = $1 RETURNING *`,
    [trackedServiceId],
  );
  return result.rows[0];
};

export const TrackedServiceServices = {
  createTrackedServiceIntoDB,
  getMyTrackedServicesFromDB,
  getSingleTrackedServiceFromDB,
  updateTrackedServiceIntoDB,
  deleteTrackedServiceFromDB,
};
