import httpStatus from "http-status";
import ApiError from "../../app/errors/AppError";
import { pool } from "../../utils/pg";

/**
 * Government offices — nearby lookup module.
 *
 * Office records are curated from official Bangladesh government sources
 * (Election Commission, Department of Immigration & Passports, BDRIS,
 * BRTA). Coordinates, phone numbers and service availability must be
 * verified before insertion — never invented.
 */

export const OFFICE_SERVICE_KEYS = [
  "NID",
  "PASSPORT",
  "BIRTH_REGISTRATION",
  "DRIVING_LICENCE",
] as const;

export type OfficeServiceKey = (typeof OFFICE_SERVICE_KEYS)[number];

/**
 * Service-page slugs resolve to the same keys, so one reusable `/nearby`
 * endpoint serves every `/services/[slug]/nearby-offices` page without the
 * frontend having to map slugs first. Keys still work directly.
 */
const SERVICE_KEY_BY_SLUG: Record<string, OfficeServiceKey> = {
  "nid-correction": "NID",
  "epassport-new": "PASSPORT",
  "passport-renewal": "PASSPORT",
  "birth-registration": "BIRTH_REGISTRATION",
  "birth-certificate-copy": "BIRTH_REGISTRATION",
  "driving-license": "DRIVING_LICENCE",
};

const DEFAULT_RADIUS_KM = 50;
const MAX_RADIUS_KM = 500;
const DEFAULT_PAGE_LIMIT = 20;
const MAX_PAGE_LIMIT = 50;

const isOfficeServiceKey = (value: unknown): value is OfficeServiceKey =>
  typeof value === "string" &&
  (OFFICE_SERVICE_KEYS as readonly string[]).includes(value);

const parseCoordinate = (
  raw: unknown,
  bounds: { min: number; max: number; label: string },
): number => {
  if (
    typeof raw !== "string" ||
    !/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(raw)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid ${bounds.label}. Expected a complete decimal number.`,
    );
  }
  const value = Number(raw);
  if (!Number.isFinite(value) || value < bounds.min || value > bounds.max) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid ${bounds.label}. Expected a number between ${bounds.min} and ${bounds.max}.`,
    );
  }
  return value;
};

const parsePositiveInt = (
  raw: unknown,
  fallback: number,
  max: number,
  label: string,
): number => {
  if (raw === undefined || raw === null || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > max) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid ${label}. Expected an integer between 1 and ${max}.`,
    );
  }
  return value;
};

const parseServiceKey = (raw: unknown): OfficeServiceKey => {
  if (typeof raw === "string") {
    const fromSlug = SERVICE_KEY_BY_SLUG[raw.trim().toLowerCase()];
    if (fromSlug) return fromSlug;
  }
  if (!isOfficeServiceKey(raw)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid service. Expected one of: ${OFFICE_SERVICE_KEYS.join(", ")} (or a service slug like epassport-new).`,
    );
  }
  return raw;
};

const sanitizeAreaText = (
  raw: unknown,
  label: string,
  required: boolean,
): string | null => {
  if (raw === undefined || raw === null || raw === "") {
    if (required) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Missing required query parameter: ${label}.`,
      );
    }
    return null;
  }
  if (typeof raw !== "string" || raw.length > 100) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Invalid ${label}.`);
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    if (required) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Missing required query parameter: ${label}.`,
      );
    }
    return null;
  }
  return trimmed;
};

export type NearbyOfficeRow = {
  id: string;
  name: string;
  officeType: string;
  address: string;
  district: string;
  upazila: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  officialUrl: string | null;
  lastVerifiedAt: string;
  distanceKm: number | null;
};

const OFFICE_COLUMNS = `o.id, o.name, o."officeType", o.address, o.district, o.upazila,
       o.latitude, o.longitude, o.phone, o."officialUrl", o."lastVerifiedAt"`;

const mapOfficeRow = (row: Record<string, unknown>): NearbyOfficeRow => ({
  id: String(row.id),
  name: String(row.name),
  officeType: String(row.officeType),
  address: String(row.address),
  district: String(row.district),
  upazila: String(row.upazila),
  latitude: Number(row.latitude),
  longitude: Number(row.longitude),
  phone: row.phone === null || row.phone === undefined ? null : String(row.phone),
  officialUrl:
    row.officialUrl === null || row.officialUrl === undefined
      ? null
      : String(row.officialUrl),
  lastVerifiedAt: new Date(String(row.lastVerifiedAt)).toISOString().slice(0, 10),
  distanceKm:
    row.distanceKm === null || row.distanceKm === undefined
      ? null
      : Number(row.distanceKm),
});

/**
 * Offices supporting `service` within `radiusKm` of the given coordinates,
 * nearest first. A bounding-box pre-filter (indexed) narrows the candidate
 * set before the exact Haversine distance is computed in SQL.
 */
const findNearbyOffices = async (params: {
  service: unknown;
  lat: unknown;
  lng: unknown;
  radiusKm?: unknown;
  page?: unknown;
  limit?: unknown;
}) => {
  const service = parseServiceKey(params.service);
  const lat = parseCoordinate(params.lat, { min: -90, max: 90, label: "lat" });
  const lng = parseCoordinate(params.lng, { min: -180, max: 180, label: "lng" });

  const rawRadius =
    params.radiusKm === undefined ||
    params.radiusKm === "" ||
    params.radiusKm === null
      ? DEFAULT_RADIUS_KM
      : Number(params.radiusKm);
  if (!Number.isFinite(rawRadius) || rawRadius < 1 || rawRadius > MAX_RADIUS_KM) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid radiusKm. Expected a number between 1 and ${MAX_RADIUS_KM}.`,
    );
  }
  const radiusKm = rawRadius;
  const page = parsePositiveInt(params.page, 1, Number.MAX_SAFE_INTEGER, "page");
  const limit = parsePositiveInt(params.limit, DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT, "limit");
  const offset = (page - 1) * limit;

  // Bounding box in degrees around the search point (1 deg lat ≈ 111.045 km).
  const latDelta = radiusKm / 111.045;
  const cosLat = Math.max(Math.abs(Math.cos((lat * Math.PI) / 180)), 0.01);
  const lngDelta = radiusKm / (111.045 * cosLat);

  const haversine = `(6371 * acos(LEAST(1.0, GREATEST(-1.0,
      cos(radians($2)) * cos(radians(o.latitude)) * cos(radians(o.longitude) - radians($3))
      + sin(radians($2)) * sin(radians(o.latitude))
    ))))`;

  const baseFrom = `FROM government_offices o
    WHERE o."isDeleted" = FALSE
      AND o."isActive" = TRUE
      AND o.latitude BETWEEN $4 AND $5
      AND o.longitude BETWEEN $6 AND $7
      AND EXISTS (
        SELECT 1 FROM government_office_services s
        WHERE s."officeId" = o.id AND s."serviceKey" = $1
      )`;

  const paramsList = [
    service,
    lat,
    lng,
    lat - latDelta,
    lat + latDelta,
    lng - lngDelta,
    lng + lngDelta,
  ];

  // The count query doesn't reference the raw lat/lng ($2/$3 of the main
  // query), so it uses its own renumbered placeholders — Postgres cannot
  // infer the type of a parameter that never appears in the SQL text.
  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM government_offices o
     WHERE o."isDeleted" = FALSE
       AND o."isActive" = TRUE
       AND o.latitude BETWEEN $2 AND $3
       AND o.longitude BETWEEN $4 AND $5
       AND EXISTS (
         SELECT 1 FROM government_office_services s
         WHERE s."officeId" = o.id AND s."serviceKey" = $1
       )`,
    [
      service,
      lat - latDelta,
      lat + latDelta,
      lng - lngDelta,
      lng + lngDelta,
    ],
  );
  const total: number = countResult.rows[0]?.total ?? 0;

  const result = await pool.query(
    `SELECT * FROM (
       SELECT ${OFFICE_COLUMNS}, ROUND((${haversine})::numeric, 2) AS "distanceKm" ${baseFrom}
     ) candidates
     WHERE candidates."distanceKm" <= $8
     ORDER BY candidates."distanceKm" ASC, candidates.name ASC
     LIMIT $9 OFFSET $10`,
    [...paramsList, radiusKm, limit, offset],
  );

  return {
    service,
    origin: { lat, lng },
    radiusKm,
    offices: result.rows.map(mapOfficeRow),
    meta: { page, limit, total },
  };
};

/**
 * Offices supporting `service` inside a manually selected district/upazila.
 * Used when the user prefers not to share their GPS location. No distance
 * is returned because there is no verified user coordinate to measure from.
 */
const findOfficesByArea = async (params: {
  service: unknown;
  district: unknown;
  upazila?: unknown;
  page?: unknown;
  limit?: unknown;
}) => {
  const service = parseServiceKey(params.service);
  const district = sanitizeAreaText(params.district, "district", true);
  const upazila = sanitizeAreaText(params.upazila, "upazila", false);
  const page = parsePositiveInt(params.page, 1, Number.MAX_SAFE_INTEGER, "page");
  const limit = parsePositiveInt(params.limit, DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT, "limit");
  const offset = (page - 1) * limit;

  const filters = `o."isDeleted" = FALSE AND o."isActive" = TRUE
      AND o.district = $1
      ${upazila ? "AND o.upazila = $2" : ""}
      AND EXISTS (
        SELECT 1 FROM government_office_services s
        WHERE s."officeId" = o.id AND s."serviceKey" = $${upazila ? 3 : 2}
      )`;
  const paramsList = upazila ? [district, upazila, service] : [district, service];

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM government_offices o WHERE ${filters}`,
    paramsList,
  );
  const total: number = countResult.rows[0]?.total ?? 0;

  const result = await pool.query(
    `SELECT ${OFFICE_COLUMNS}, NULL::numeric AS "distanceKm"
     FROM government_offices o
     WHERE ${filters}
     ORDER BY o.name ASC
     LIMIT $${paramsList.length + 1} OFFSET $${paramsList.length + 2}`,
    [...paramsList, limit, offset],
  );

  return {
    service,
    area: { district, upazila },
    offices: result.rows.map(mapOfficeRow),
    meta: { page, limit, total },
  };
};

/** Distinct district/upazila pairs that have active offices for a service. */
const listServiceAreas = async (params: { service: unknown }) => {
  const service = parseServiceKey(params.service);

  const result = await pool.query(
    `SELECT o.district, o.upazila
     FROM government_offices o
     WHERE o."isDeleted" = FALSE AND o."isActive" = TRUE
       AND EXISTS (
         SELECT 1 FROM government_office_services s
         WHERE s."officeId" = o.id AND s."serviceKey" = $1
       )
     GROUP BY o.district, o.upazila
     ORDER BY o.district ASC, o.upazila ASC`,
    [service],
  );

  return result.rows.map((row) => ({
    district: String(row.district),
    upazila: String(row.upazila),
  }));
};

export const GovernmentOfficesServices = {
  findNearbyOffices,
  findOfficesByArea,
  listServiceAreas,
};
