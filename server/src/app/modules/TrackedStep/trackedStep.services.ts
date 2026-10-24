import { pool } from "../../../utils/pg";
import AppError from "../../../app/errors/AppError";
import httpStatus from "http-status";

const now = (): string => new Date().toISOString();

const updateTrackedStepIntoDB = async ({
  trackedServiceId,
  serviceStepId,
  userId,
  userRole,
  status,
  note,
}: {
  trackedServiceId: string;
  serviceStepId: string;
  userId: string;
  userRole?: string;
  status: string;
  note?: string | null;
}) => {
  // Ownership: the tracked service must belong to the requesting user (or user is ADMIN)
  const tsExist = await pool.query(
    `SELECT id, "serviceId" FROM trackedService
     WHERE id = $1 AND ("userId" = $2 OR $3 = 'ADMIN') LIMIT 1`,
    [trackedServiceId, userId, userRole || "USER"],
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
    `SELECT id, note FROM trackedStep
     WHERE "trackedServiceId" = $1 AND "serviceStepId" = $2 LIMIT 1`,
    [trackedServiceId, serviceStepId],
  );

  const finalNote = note !== undefined ? note : (existing.rows[0]?.note ?? null);

  let result;
  if (existing.rows.length) {
    result = await pool.query(
      `UPDATE trackedStep
         SET status = $1, note = $2, "completedAt" = $3, "updatedAt" = $4
       WHERE "trackedServiceId" = $5 AND "serviceStepId" = $6
       RETURNING *`,
      [status, finalNote, completedAt, tsNow, trackedServiceId, serviceStepId],
    );
  } else {
    result = await pool.query(
      `INSERT INTO trackedStep (
         "trackedServiceId", "serviceStepId", status, note,
         "completedAt", "createdAt", "updatedAt"
       )
       VALUES ($1, $2, $3, $4, $5, $6, $6)
       RETURNING *`,
      [trackedServiceId, serviceStepId, status, finalNote, completedAt, tsNow],
    );
  }

  // Update parent trackedService updated timestamp
  await pool.query(
    `UPDATE trackedService SET "lastUpdatedAt" = $1, "updatedAt" = $1 WHERE id = $2`,
    [tsNow, trackedServiceId],
  );

  const stepMeta = await pool.query(
    `SELECT title AS step_title, "stepNumber", description AS step_description, "actionType", "officialUrl"
     FROM serviceStep WHERE id = $1 LIMIT 1`,
    [serviceStepId],
  );

  return {
    ...result.rows[0],
    ...stepMeta.rows[0],
  };
};

const getTrackedStepsFromDB = async (
  trackedServiceId: string,
  userId: string,
  userRole?: string,
) => {
  // Ownership: the tracked service must belong to the requesting user (or user is ADMIN)
  const tsExist = await pool.query(
    `SELECT id, "serviceId" FROM trackedService
     WHERE id = $1 AND ("userId" = $2 OR $3 = 'ADMIN') LIMIT 1`,
    [trackedServiceId, userId, userRole || "USER"],
  );
  if (!tsExist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Tracked service not found.");
  }

  const serviceId = tsExist.rows[0].serviceId;

  // Return all steps configured for this service with the user's tracking state
  const result = await pool.query(
    `SELECT 
       COALESCE(ts.id, ss.id) AS id,
       $1::uuid AS "trackedServiceId",
       ss.id AS "serviceStepId",
       COALESCE(ts.status, 'NOT_STARTED') AS status,
       ts."completedAt",
       ts.note,
       ss.title AS step_title,
       ss."stepNumber",
       ss.description AS step_description,
       ss."actionType",
       ss."officialUrl",
       COALESCE(ts."createdAt", ss."createdAt") AS "createdAt",
       COALESCE(ts."updatedAt", ss."updatedAt") AS "updatedAt"
     FROM serviceStep ss
     LEFT JOIN trackedStep ts
       ON ts."serviceStepId" = ss.id
       AND ts."trackedServiceId" = $1
     WHERE ss."serviceId" = $2 AND ss."isDeleted" = FALSE
     ORDER BY ss."stepNumber" ASC`,
    [trackedServiceId, serviceId],
  );
  return result.rows;
};

export const TrackedStepServices = {
  updateTrackedStepIntoDB,
  getTrackedStepsFromDB,
};
