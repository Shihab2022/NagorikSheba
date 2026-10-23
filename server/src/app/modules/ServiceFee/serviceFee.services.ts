import { Request } from "express";
import { pool } from "../../../utils/pg";
import AppError from "../../../app/errors/AppError";
import httpStatus from "http-status";

const createServiceFeeIntoDB = async (req: Request) => {
  const { serviceId, name, amount, currency, description, effectiveFrom, effectiveUntil } = req.body;

  const isServiceExist = await pool.query(
    `SELECT id FROM services WHERE id = $1 AND "isDeleted" = FALSE`,
    [serviceId],
  );
  if (!isServiceExist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found.");
  }

  const result = await pool.query(
    `INSERT INTO serviceFee ("serviceId", name, amount, currency, description, "effectiveFrom", "effectiveUntil") 
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [serviceId, name, amount !== undefined ? Number(amount) : null, currency || "BDT", description || null, effectiveFrom || null, effectiveUntil || null],
  );

  return result.rows[0];
};

const getServiceFeesFromDB = async (serviceId: string) => {
  const result = await pool.query(
    `SELECT * FROM serviceFee WHERE "serviceId" = $1 AND "isDeleted" = FALSE ORDER BY "createdAt" DESC`,
    [serviceId],
  );
  return result.rows;
};

const updateServiceFeeIntoDB = async (req: Request) => {
  const { fee_id } = req.params;
  const payload = req.body;

  const isExist = await pool.query(
    `SELECT id FROM serviceFee WHERE id = $1 AND "isDeleted" = FALSE`,
    [fee_id],
  );
  if (!isExist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Service fee not found.");
  }

  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIdx = 1;

  const updatableFields = ["name", "amount", "currency", "description", "effectiveFrom", "effectiveUntil"];
  for (const field of updatableFields) {
    if (payload[field] !== undefined) {
      const dbField = field === "effectiveFrom" ? `"effectiveFrom"` : field === "effectiveUntil" ? `"effectiveUntil"` : field;
      setClauses.push(`${dbField} = $${paramIdx++}`);
      values.push(field === "amount" ? Number(payload[field]) : payload[field]);
    }
  }

  setClauses.push(`"updatedAt" = CURRENT_TIMESTAMP`);
  values.push(fee_id);

  const result = await pool.query(
    `UPDATE serviceFee SET ${setClauses.join(", ")} WHERE id = $${paramIdx} AND "isDeleted" = FALSE RETURNING *`,
    values,
  );

  return result.rows[0];
};

const deleteServiceFeeFromDB = async (fee_id: string) => {
  const isExist = await pool.query(
    `SELECT id FROM serviceFee WHERE id = $1 AND "isDeleted" = FALSE`,
    [fee_id],
  );
  if (!isExist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Service fee not found.");
  }

  const result = await pool.query(
    `UPDATE serviceFee SET "isDeleted" = TRUE, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    [fee_id],
  );

  return result.rows[0];
};

export const ServiceFeeServices = {
  createServiceFeeIntoDB,
  getServiceFeesFromDB,
  updateServiceFeeIntoDB,
  deleteServiceFeeFromDB,
};
