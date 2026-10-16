import { Request } from "express";
import { pool } from "../../../utils/pg";
import AppError from "../../../app/errors/AppError";
import httpStatus from "http-status";

const createServiceRequirementIntoDB = async (req: Request) => {
  const { serviceId, name, description, isMandatory, conditionDescription, sortOrder } = req.body;

  const isServiceExist = await pool.query(
    `SELECT id FROM services WHERE id = $1 AND "isDeleted" = FALSE`,
    [serviceId],
  );
  if (!isServiceExist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found.");
  }

  const result = await pool.query(
    `INSERT INTO serviceRequirement ("serviceId", name, description, "isMandatory", "conditionDescription", "sortOrder") 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [serviceId, name, description || null, isMandatory !== undefined ? isMandatory : false, conditionDescription || null, sortOrder],
  );

  return result.rows[0];
};

const getServiceRequirementsFromDB = async (serviceId: string) => {
  const result = await pool.query(
    `SELECT * FROM serviceRequirement WHERE "serviceId" = $1 AND "isDeleted" = FALSE ORDER BY "sortOrder" ASC`,
    [serviceId],
  );
  return result.rows;
};

const updateServiceRequirementIntoDB = async (req: Request) => {
  const { requirement_id } = req.params;
  const payload = req.body;

  const isExist = await pool.query(
    `SELECT id FROM serviceRequirement WHERE id = $1 AND "isDeleted" = FALSE`,
    [requirement_id],
  );
  if (!isExist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Service requirement not found.");
  }

  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIdx = 1;

  const updatableFields = ["name", "description", "isMandatory", "conditionDescription", "sortOrder"];
  for (const field of updatableFields) {
    if (payload[field] !== undefined) {
      setClauses.push(`${field} = $${paramIdx++}`);
      values.push(payload[field]);
    }
  }

  setClauses.push(`"updatedAt" = CURRENT_TIMESTAMP`);
  values.push(requirement_id);

  const result = await pool.query(
    `UPDATE serviceRequirement SET ${setClauses.join(", ")} WHERE id = $${paramIdx} AND "isDeleted" = FALSE RETURNING *`,
    values,
  );

  return result.rows[0];
};

const deleteServiceRequirementFromDB = async (requirement_id: string) => {
  const isExist = await pool.query(
    `SELECT id FROM serviceRequirement WHERE id = $1 AND "isDeleted" = FALSE`,
    [requirement_id],
  );
  if (!isExist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Service requirement not found.");
  }

  const result = await pool.query(
    `UPDATE serviceRequirement SET "isDeleted" = TRUE, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    [requirement_id],
  );

  return result.rows[0];
};

export const ServiceRequirementServices = {
  createServiceRequirementIntoDB,
  getServiceRequirementsFromDB,
  updateServiceRequirementIntoDB,
  deleteServiceRequirementFromDB,
};
