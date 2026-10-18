import { Request } from "express";
import { pool } from "../../../utils/pg";
import AppError from "../../../app/errors/AppError";
import httpStatus from "http-status";

const createCategoryIntoDB = async (req: Request) => {
  const { name, slug, description, icon } = req.body;

  if (!name || !slug) {
    throw new AppError(httpStatus.BAD_REQUEST, "Name and slug are required.");
  }

  const existingCategory = await pool.query(
    `SELECT id FROM category WHERE slug = $1`,
    [slug],
  );
  if (existingCategory.rows.length) {
    throw new AppError(httpStatus.CONFLICT, "Category with this slug already exists.");
  }

  const result = await pool.query(
    `INSERT INTO category (name, slug, description, icon) VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, slug, description || null, icon || null],
  );

  return result.rows[0];
};

const updateCategoryIntoDB = async (req: Request) => {
  const { category_id } = req.params;
  const { name, slug, description, icon } = req.body;

  const isExistCategory = await pool.query(
    `SELECT id FROM category WHERE id = $1 AND "isDeleted" = FALSE`,
    [category_id],
  );
  if (!isExistCategory.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found.");
  }

  const result = await pool.query(
    `UPDATE category SET name = COALESCE($1, name), slug = COALESCE($2, slug), description = COALESCE($3, description), icon = COALESCE($4, icon), "updatedAt" = CURRENT_TIMESTAMP WHERE id = $5 AND "isDeleted" = FALSE RETURNING *`,
    [name, slug, description, icon, category_id],
  );

  return result.rows[0];
};

const deleteCategoryFromDB = async (category_id: string) => {
  const isExistCategory = await pool.query(
    `SELECT id FROM category WHERE id = $1 AND "isDeleted" = FALSE`,
    [category_id],
  );
  if (!isExistCategory.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found.");
  }

  const result = await pool.query(
    `UPDATE category SET "isDeleted" = TRUE, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    [category_id],
  );

  return result.rows[0];
};

const getAllCategoriesFromDB = async () => {
  const result = await pool.query(
    `SELECT c.*, COUNT(s.id)::int AS "serviceCount"
     FROM category c
     LEFT JOIN services s ON c.id = s."categoryId" AND s."isDeleted" = FALSE
     WHERE c."isDeleted" = FALSE
     GROUP BY c.id
     ORDER BY c."createdAt" DESC`,
  );
  return result.rows;
};

export const CategoryServices = {
  createCategoryIntoDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
  getAllCategoriesFromDB,
};
