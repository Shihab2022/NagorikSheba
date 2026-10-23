import { Request } from "express";
import { pool } from "../../../utils/pg";
import AppError from "../../../app/errors/AppError";
import httpStatus from "http-status";

const createServiceStepIntoDB = async (req: Request) => {
  const { serviceId, stepNumber, title, description, actionType, officialUrl } = req.body;

  const isServiceExist = await pool.query(
    `SELECT id FROM services WHERE id = $1 AND "isDeleted" = FALSE`,
    [serviceId],
  );
  if (!isServiceExist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found.");
  }

  const result = await pool.query(
    `INSERT INTO serviceStep ("serviceId", "stepNumber", title, description, "actionType", "officialUrl") 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [serviceId, stepNumber, title, description, actionType || "READ_GUIDE", officialUrl || null],
  );

  return result.rows[0];
};

const getServiceStepsFromDB = async (serviceId: string) => {
  const result = await pool.query(
    `SELECT * FROM serviceStep WHERE "serviceId" = $1 AND "isDeleted" = FALSE ORDER BY "stepNumber" ASC`,
    [serviceId],
  );
  return result.rows;
};

const updateServiceStepIntoDB = async (req: Request) => {
  const { step_id } = req.params;
  const payload = req.body;

  const isExist = await pool.query(
    `SELECT id FROM serviceStep WHERE id = $1 AND "isDeleted" = FALSE`,
    [step_id],
  );
  if (!isExist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Service step not found.");
  }

  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIdx = 1;

  const updatableFields = ["stepNumber", "title", "description", "actionType", "officialUrl"];
  for (const field of updatableFields) {
    if (payload[field] !== undefined) {
      const dbField = field === "stepNumber" ? `"stepNumber"` : field === "actionType" ? `"actionType"` : field === "officialUrl" ? `"officialUrl"` : field;
      setClauses.push(`${dbField} = $${paramIdx++}`);
      values.push(payload[field]);
    }
  }

  setClauses.push(`"updatedAt" = CURRENT_TIMESTAMP`);
  values.push(step_id);

  const result = await pool.query(
    `UPDATE serviceStep SET ${setClauses.join(", ")} WHERE id = $${paramIdx} AND "isDeleted" = FALSE RETURNING *`,
    values,
  );

  return result.rows[0];
};

const deleteServiceStepFromDB = async (step_id: string) => {
  const isExist = await pool.query(
    `SELECT id FROM serviceStep WHERE id = $1 AND "isDeleted" = FALSE`,
    [step_id],
  );
  if (!isExist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Service step not found.");
  }

  const result = await pool.query(
    `UPDATE serviceStep SET "isDeleted" = TRUE, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    [step_id],
  );

  return result.rows[0];
};

export const ServiceStepServices = {
  createServiceStepIntoDB,
  getServiceStepsFromDB,
  updateServiceStepIntoDB,
  deleteServiceStepFromDB,
};
