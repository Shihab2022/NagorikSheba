import { pool } from "../../../utils/pg";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import crypto from "crypto";
import { assertSafeUrl } from "../../../scraper/utils/urlSafety";
import { scrapeSource, NoticeSourceRecord } from "../../../scraper/engine";

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

// -------------------------------------------------------------
// PUBLIC SERVICES
// -------------------------------------------------------------

const getCategoryNotices = async (slugOrId: string, options: PaginationOptions) => {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(options.limit) || 20));
  const offset = (page - 1) * limit;

  // 1. Look up category
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
  const catWhere = isUUID ? `id = $1` : `slug = $1`;

  const catResult = await pool.query(
    `SELECT id, name, slug, description, icon FROM category WHERE ${catWhere} AND "isDeleted" = FALSE LIMIT 1`,
    [slugOrId]
  );

  if (!catResult.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, `Category '${slugOrId}' not found.`);
  }

  const category = catResult.rows[0];

  // 2. Count total non-hidden notices
  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM notices WHERE category_id = $1 AND is_hidden = FALSE`,
    [category.id]
  );
  const total = countResult.rows[0]?.total || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  // 3. Query items
  const itemsResult = await pool.query(
    `SELECT n.id, n.title, n.url, n.published_at AS "publishedAt",
            n.is_manual AS "isManual", n.created_at AS "createdAt",
            COALESCE(s.name, 'Direct Publication') AS "sourceName"
     FROM notices n
     LEFT JOIN notice_sources s ON n.source_id = s.id
     WHERE n.category_id = $1 AND n.is_hidden = FALSE
     ORDER BY COALESCE(n.published_at, n.created_at) DESC, n.id DESC
     LIMIT $2 OFFSET $3`,
    [category.id, limit, offset]
  );

  return {
    category,
    items: itemsResult.rows,
    page,
    limit,
    total,
    totalPages,
  };
};

const getLatestNotices = async (query: { categoryId?: string; slug?: string; limit?: number }) => {
  const limit = Math.min(20, Math.max(1, Number(query.limit) || 5));
  let targetCategoryId = query.categoryId;

  if (!targetCategoryId && query.slug) {
    const catRes = await pool.query(
      `SELECT id FROM category WHERE slug = $1 AND "isDeleted" = FALSE LIMIT 1`,
      [query.slug]
    );
    if (catRes.rows.length) {
      targetCategoryId = catRes.rows[0].id;
    }
  }

  if (!targetCategoryId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Either categoryId or slug must be provided.");
  }

  const itemsResult = await pool.query(
    `SELECT n.id, n.title, n.url, n.published_at AS "publishedAt",
            n.is_manual AS "isManual", n.created_at AS "createdAt",
            COALESCE(s.name, 'Direct Publication') AS "sourceName"
     FROM notices n
     LEFT JOIN notice_sources s ON n.source_id = s.id
     WHERE n.category_id = $1 AND n.is_hidden = FALSE
     ORDER BY COALESCE(n.published_at, n.created_at) DESC, n.id DESC
     LIMIT $2`,
    [targetCategoryId, limit]
  );

  return itemsResult.rows;
};

// -------------------------------------------------------------
// ADMIN NOTICE SOURCES
// -------------------------------------------------------------

const getAllNoticeSources = async () => {
  const result = await pool.query(
    `SELECT s.id, s.category_id AS "categoryId", s.name, s.list_url AS "listUrl",
            s.scraper_type AS "scraperType", s.config, s.is_active AS "isActive",
            s.fetch_interval_minutes AS "fetchIntervalMinutes",
            s.last_fetched_at AS "lastFetchedAt", s.last_status AS "lastStatus",
            s.last_error AS "lastError", s.consecutive_failures AS "consecutiveFailures",
            s.created_at AS "createdAt", s.updated_at AS "updatedAt",
            c.name AS "categoryName", c.slug AS "categorySlug",
            COUNT(n.id)::int AS "noticeCount"
     FROM notice_sources s
     JOIN category c ON s.category_id = c.id
     LEFT JOIN notices n ON n.source_id = s.id
     GROUP BY s.id, c.id
     ORDER BY s.id DESC`
  );
  return result.rows;
};

const getNoticeSourceById = async (id: number) => {
  const result = await pool.query(
    `SELECT s.id, s.category_id AS "categoryId", s.name, s.list_url AS "listUrl",
            s.scraper_type AS "scraperType", s.config, s.is_active AS "isActive",
            s.fetch_interval_minutes AS "fetchIntervalMinutes",
            s.last_fetched_at AS "lastFetchedAt", s.last_status AS "lastStatus",
            s.last_error AS "lastError", s.consecutive_failures AS "consecutiveFailures",
            s.created_at AS "createdAt", s.updated_at AS "updatedAt",
            c.name AS "categoryName", c.slug AS "categorySlug"
     FROM notice_sources s
     JOIN category c ON s.category_id = c.id
     WHERE s.id = $1`,
    [id]
  );

  if (!result.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Notice source not found.");
  }

  return result.rows[0];
};

const createNoticeSource = async (payload: {
  categoryId: string;
  name: string;
  listUrl: string;
  scraperType?: string;
  config?: any;
  isActive?: boolean;
  fetchIntervalMinutes?: number;
}) => {
  // Validate category existence
  const catRes = await pool.query(`SELECT id FROM category WHERE id = $1 AND "isDeleted" = FALSE`, [
    payload.categoryId,
  ]);
  if (!catRes.rows.length) {
    throw new AppError(httpStatus.BAD_REQUEST, "Specified category does not exist.");
  }

  // SSRF check
  await assertSafeUrl(payload.listUrl);

  const result = await pool.query(
    `INSERT INTO notice_sources (category_id, name, list_url, scraper_type, config, is_active, fetch_interval_minutes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, category_id AS "categoryId", name, list_url AS "listUrl",
               scraper_type AS "scraperType", config, is_active AS "isActive",
               fetch_interval_minutes AS "fetchIntervalMinutes", created_at AS "createdAt"`,
    [
      payload.categoryId,
      payload.name,
      payload.listUrl,
      payload.scraperType || "html",
      JSON.stringify(payload.config || {}),
      payload.isActive !== false,
      payload.fetchIntervalMinutes || 180,
    ]
  );

  return result.rows[0];
};

const updateNoticeSource = async (
  id: number,
  payload: Partial<{
    categoryId: string;
    name: string;
    listUrl: string;
    scraperType: string;
    config: any;
    isActive: boolean;
    fetchIntervalMinutes: number;
  }>
) => {
  const existing = await pool.query(`SELECT * FROM notice_sources WHERE id = $1`, [id]);
  if (!existing.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Notice source not found.");
  }

  if (payload.categoryId) {
    const catRes = await pool.query(`SELECT id FROM category WHERE id = $1 AND "isDeleted" = FALSE`, [
      payload.categoryId,
    ]);
    if (!catRes.rows.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Specified category does not exist.");
    }
  }

  if (payload.listUrl) {
    await assertSafeUrl(payload.listUrl);
  }

  const current = existing.rows[0];
  const newCategoryId = payload.categoryId || current.category_id;
  const newName = payload.name !== undefined ? payload.name : current.name;
  const newListUrl = payload.listUrl !== undefined ? payload.listUrl : current.list_url;
  const newScraperType = payload.scraperType !== undefined ? payload.scraperType : current.scraper_type;
  const newConfig = payload.config !== undefined ? JSON.stringify(payload.config) : JSON.stringify(current.config);
  const newIsActive = payload.isActive !== undefined ? payload.isActive : current.is_active;
  const newFetchInterval = payload.fetchIntervalMinutes !== undefined ? payload.fetchIntervalMinutes : current.fetch_interval_minutes;

  const result = await pool.query(
    `UPDATE notice_sources
     SET category_id = $1, name = $2, list_url = $3, scraper_type = $4,
         config = $5, is_active = $6, fetch_interval_minutes = $7, updated_at = NOW()
     WHERE id = $8
     RETURNING id, category_id AS "categoryId", name, list_url AS "listUrl",
               scraper_type AS "scraperType", config, is_active AS "isActive",
               fetch_interval_minutes AS "fetchIntervalMinutes", updated_at AS "updatedAt"`,
    [newCategoryId, newName, newListUrl, newScraperType, newConfig, newIsActive, newFetchInterval, id]
  );

  return result.rows[0];
};

const deleteNoticeSource = async (id: number) => {
  const result = await pool.query(`DELETE FROM notice_sources WHERE id = $1 RETURNING id`, [id]);
  if (!result.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Notice source not found.");
  }
  return { id };
};

const testNoticeSource = async (id: number) => {
  const result = await pool.query(`SELECT * FROM notice_sources WHERE id = $1`, [id]);
  if (!result.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Notice source not found.");
  }

  const source: NoticeSourceRecord = result.rows[0];
  return await scrapeSource(source, { dryRun: true });
};

const runNoticeSource = async (id: number) => {
  const result = await pool.query(`SELECT * FROM notice_sources WHERE id = $1`, [id]);
  if (!result.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Notice source not found.");
  }

  const source: NoticeSourceRecord = result.rows[0];
  return await scrapeSource(source, { dryRun: false });
};

// -------------------------------------------------------------
// ADMIN NOTICES
// -------------------------------------------------------------

const getAllNoticesAdmin = async (query: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: any[] = [];
  let paramIdx = 1;

  if (query.categoryId) {
    conditions.push(`n.category_id = $${paramIdx++}`);
    params.push(query.categoryId);
  }

  if (query.search) {
    conditions.push(`n.title ILIKE $${paramIdx++}`);
    params.push(`%${query.search}%`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const countRes = await pool.query(
    `SELECT COUNT(*)::int AS total FROM notices n ${whereClause}`,
    params
  );
  const total = countRes.rows[0]?.total || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  const itemsRes = await pool.query(
    `SELECT n.id, n.category_id AS "categoryId", n.source_id AS "sourceId",
            n.title, n.url, n.published_at AS "publishedAt",
            n.is_manual AS "isManual", n.is_hidden AS "isHidden",
            n.created_at AS "createdAt",
            c.name AS "categoryName", c.slug AS "categorySlug",
            COALESCE(s.name, 'Manual Entry') AS "sourceName"
     FROM notices n
     JOIN category c ON n.category_id = c.id
     LEFT JOIN notice_sources s ON n.source_id = s.id
     ${whereClause}
     ORDER BY COALESCE(n.published_at, n.created_at) DESC, n.id DESC
     LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
    [...params, limit, offset]
  );

  return {
    items: itemsRes.rows,
    page,
    limit,
    total,
    totalPages,
  };
};

const createManualNotice = async (payload: {
  categoryId: string;
  title: string;
  url: string;
  publishedAt?: string | null;
}) => {
  const catRes = await pool.query(`SELECT id FROM category WHERE id = $1 AND "isDeleted" = FALSE`, [
    payload.categoryId,
  ]);
  if (!catRes.rows.length) {
    throw new AppError(httpStatus.BAD_REQUEST, "Specified category does not exist.");
  }

  await assertSafeUrl(payload.url);

  const contentHash = crypto
    .createHash("sha256")
    .update(`manual:${payload.url}:${payload.title}`)
    .digest("hex");

  const result = await pool.query(
    `INSERT INTO notices (source_id, category_id, title, url, published_at, content_hash, is_manual, is_hidden)
     VALUES (NULL, $1, $2, $3, $4, $5, TRUE, FALSE)
     RETURNING id, category_id AS "categoryId", title, url, published_at AS "publishedAt",
               is_manual AS "isManual", is_hidden AS "isHidden", created_at AS "createdAt"`,
    [
      payload.categoryId,
      payload.title,
      payload.url,
      payload.publishedAt ? new Date(payload.publishedAt).toISOString() : null,
      contentHash,
    ]
  );

  return result.rows[0];
};

const updateNotice = async (
  id: number,
  payload: Partial<{
    categoryId: string;
    title: string;
    url: string;
    isHidden: boolean;
  }>
) => {
  const existing = await pool.query(`SELECT * FROM notices WHERE id = $1`, [id]);
  if (!existing.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Notice not found.");
  }

  if (payload.categoryId) {
    const catRes = await pool.query(`SELECT id FROM category WHERE id = $1 AND "isDeleted" = FALSE`, [
      payload.categoryId,
    ]);
    if (!catRes.rows.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Specified category does not exist.");
    }
  }

  if (payload.url) {
    await assertSafeUrl(payload.url);
  }

  const current = existing.rows[0];
  const newCategoryId = payload.categoryId || current.category_id;
  const newTitle = payload.title !== undefined ? payload.title : current.title;
  const newUrl = payload.url !== undefined ? payload.url : current.url;
  const newIsHidden = payload.isHidden !== undefined ? payload.isHidden : current.is_hidden;

  const result = await pool.query(
    `UPDATE notices
     SET category_id = $1, title = $2, url = $3, is_hidden = $4
     WHERE id = $5
     RETURNING id, category_id AS "categoryId", title, url, published_at AS "publishedAt",
               is_manual AS "isManual", is_hidden AS "isHidden"`,
    [newCategoryId, newTitle, newUrl, newIsHidden, id]
  );

  return result.rows[0];
};

const deleteNotice = async (id: number) => {
  const result = await pool.query(`DELETE FROM notices WHERE id = $1 RETURNING id`, [id]);
  if (!result.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Notice not found.");
  }
  return { id };
};

export const NoticeServices = {
  getCategoryNotices,
  getLatestNotices,
  getAllNoticeSources,
  getNoticeSourceById,
  createNoticeSource,
  updateNoticeSource,
  deleteNoticeSource,
  testNoticeSource,
  runNoticeSource,
  getAllNoticesAdmin,
  createManualNotice,
  updateNotice,
  deleteNotice,
};
