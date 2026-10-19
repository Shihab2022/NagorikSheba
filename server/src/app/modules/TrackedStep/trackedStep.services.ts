import { pool } from "../../../utils/pg";
import AppError from "../../../app/errors/AppError";
import httpStatus from "http-status";

const now = (): string => new Date().toISOString();

const updateTrackedStepIntoDB = async ({
  trackedServiceId,
  serviceStepId,
  userId,
  status,
  note,
}: {
  trackedServiceId: string;
  serviceStepId: string;
  userId: string;
  status: string;
  note?: string | null;
}) => {
  // Ownership: the tracked service must belong to the requesting user.
  const tsExist = await pool.query(
    `SELECT id, "serviceId" FROM trackedService
     WHERE id = $1 AND "userId" = $2 LIMIT 1`,
    [trackedServiceId, userId],
  );
  if (!tsExist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Tracked service not found.");
  }

  // Business rule: the step must belong to the same service as the tracked service.
  const stepExist = await pool.query(
    `SELECT id FROM serviceStep
     WHERE id = $1 AND "serviceId" = $2 AND "isDeleted" = FALSE LIMIT 1`,
    [serviceStepId, tsExist.rows[0].serviceId],
  );
  if (!stepExist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Service step not found.");
  }

  const tsNow = now();
  const completedAt = status === "COMPLETED" ? tsNow : null;

  const existing = await pool.query(
    `SELECT id FROM trackedStep
     WHERE "trackedServiceId" = $1 AND "serviceStepId" = $2 LIMIT 1`,
    [trackedServiceId, serviceStepId],
  );

  if (existing.rows.length) {
    const result = await pool.query(
      `UPDATE trackedStep
         SET status = $1, note = $2, "completedAt" = $3, "updatedAt" = $4
       WHERE "trackedServiceId" = $5 AND "serviceStepId" = $6
       RETURNING *`,
      [status, note || null, completedAt, tsNow, trackedServiceId, serviceStepId],
    );
    return result.rows[0];
  }

  const result = await pool.query(
    `INSERT INTO trackedStep (
       "trackedServiceId", "serviceStepId", status, note,
       "completedAt", "createdAt", "updatedAt"
     )
     VALUES ($1, $2, $3, $4, $5, $6, $6)
     RETURNING *`,
    [trackedServiceId, serviceStepId, status, note || null, completedAt, tsNow],
  );
  return result.rows[0];
};

const getTrackedStepsFromDB = async (
  trackedServiceId: string,
  userId: string,
) => {
  // Ownership: the tracked service must belong to the requesting user.
  const tsExist = await pool.query(
    `SELECT id FROM trackedService
     WHERE id = $1 AND "userId" = $2 LIMIT 1`,
    [trackedServiceId, userId],
  );
  if (!tsExist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Tracked service not found.");
  }

  const result = await pool.query(
    `SELECT ts.*, ss.title AS step_title, ss."stepNumber"
     FROM trackedStep ts
     JOIN serviceStep ss ON ss.id = ts."serviceStepId" AND ss."isDeleted" = FALSE
     WHERE ts."trackedServiceId" = $1
     ORDER BY ss."stepNumber" ASC`,
    [trackedServiceId],
  );
  return result.rows;
};

export const TrackedStepServices = {
  updateTrackedStepIntoDB,
  getTrackedStepsFromDB,
};
