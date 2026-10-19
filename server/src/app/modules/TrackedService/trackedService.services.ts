import { Request } from "express";
import { pool } from "../../../utils/pg";
import AppError from "../../../app/errors/AppError";
import httpStatus from "http-status";

const now = (): string => new Date().toISOString();

const createTrackedServiceIntoDB = async (req: Request) => {
  const userId = (req as any).user?.id;
  const { serviceId, title, referenceNumber, status } = req.body;

  const serviceExist = await pool.query(
    `SELECT id, slug FROM services WHERE id = $1 AND "isDeleted" = FALSE LIMIT 1`,
    [serviceId],
  );
  if (!serviceExist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found.");
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
  return result.rows[0];
};

const getMyTrackedServicesFromDB = async (userId: string) => {
  const result = await pool.query(
    `SELECT ts.*, s.name AS service_name, s.slug AS service_slug,
            s.category AS service_category, s.icon AS service_icon,
            s.department AS service_department
     FROM trackedService ts
     JOIN services s ON s.id = ts."serviceId" AND s."isDeleted" = FALSE
     WHERE ts."userId" = $1
     ORDER BY ts."updatedAt" DESC`,
    [userId],
  );
  return result.rows;
};

const getSingleTrackedServiceFromDB = async (
  trackedServiceId: string,
  userId: string,
) => {
  const result = await pool.query(
    `SELECT ts.*, s.name AS service_name, s.slug AS service_slug,
            s.category AS service_category, s.icon AS service_icon,
            s.department AS service_department
     FROM trackedService ts
     JOIN services s ON s.id = ts."serviceId" AND s."isDeleted" = FALSE
     WHERE ts.id = $1 AND ts."userId" = $2
     LIMIT 1`,
    [trackedServiceId, userId],
  );
  if (!result.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Tracked service not found.");
  }
  return result.rows[0];
};

const updateTrackedServiceIntoDB = async (req: Request) => {
  const userId = (req as any).user?.id;
  const { tracked_service_id } = req.params;
  const { title, status, referenceNumber, completedAt } = req.body;

  const exist = await pool.query(
    `SELECT id, status, "completedAt" FROM trackedService
     WHERE id = $1 AND "userId" = $2 LIMIT 1`,
    [tracked_service_id, userId],
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
     WHERE id = $6 AND "userId" = $7
     RETURNING *`,
    [title, status, referenceNumber, finalCompletedAt, tsNow, tracked_service_id, userId],
  );
  return result.rows[0];
};

const deleteTrackedServiceFromDB = async (
  trackedServiceId: string,
  userId: string,
) => {
  const exist = await pool.query(
    `SELECT id FROM trackedService WHERE id = $1 AND "userId" = $2 LIMIT 1`,
    [trackedServiceId, userId],
  );
  if (!exist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Tracked service not found.");
  }
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
