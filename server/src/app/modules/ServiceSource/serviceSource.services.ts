import { Request } from "express";
import { pool } from "../../../utils/pg";
import AppError from "../../../app/errors/AppError";
import httpStatus from "http-status";

const createServiceSourceIntoDB = async (req: Request) => {
  const { serviceId, title, url, sourceType } = req.body;

  const isServiceExist = await pool.query(
    `SELECT id FROM services WHERE id = $1 AND "isDeleted" = FALSE`,
    [serviceId],
  );
  if (!isServiceExist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found.");
  }

  const result = await pool.query(
    `INSERT INTO serviceSource ("serviceId", title, url, "sourceType") 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [serviceId, title, url, sourceType],
  );

  return result.rows[0];
};

const getServiceSourcesFromDB = async (serviceId: string) => {
  const result = await pool.query(
    `SELECT * FROM serviceSource WHERE "serviceId" = $1 AND "isDeleted" = FALSE ORDER BY "createdAt" DESC`,
    [serviceId],
  );
  return result.rows;
};

const updateServiceSourceIntoDB = async (req: Request) => {
  const { source_id } = req.params;
  const payload = req.body;

  const isExist = await pool.query(
    `SELECT id FROM serviceSource WHERE id = $1 AND "isDeleted" = FALSE`,
    [source_id],
  );
  if (!isExist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Service source not found.");
  }

  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIdx = 1;

  const updatableFields = ["title", "url", "sourceType"];
  for (const field of updatableFields) {
    if (payload[field] !== undefined) {
      const dbField = field === "sourceType" ? `"sourceType"` : field;
      setClauses.push(`${dbField} = $${paramIdx++}`);
      values.push(payload[field]);
    }
  }

  setClauses.push(`"updatedAt" = CURRENT_TIMESTAMP`);
  values.push(source_id);

  const result = await pool.query(
    `UPDATE serviceSource SET ${setClauses.join(", ")} WHERE id = $${paramIdx} AND "isDeleted" = FALSE RETURNING *`,
    values,
  );

  return result.rows[0];
};

const deleteServiceSourceFromDB = async (source_id: string) => {
  const isExist = await pool.query(
    `SELECT id FROM serviceSource WHERE id = $1 AND "isDeleted" = FALSE`,
    [source_id],
  );
  if (!isExist.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Service source not found.");
  }

  const result = await pool.query(
    `UPDATE serviceSource SET "isDeleted" = TRUE, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    [source_id],
  );

  return result.rows[0];
};

export const ServiceSourceServices = {
  createServiceSourceIntoDB,
  getServiceSourcesFromDB,
  updateServiceSourceIntoDB,
  deleteServiceSourceFromDB,
};
