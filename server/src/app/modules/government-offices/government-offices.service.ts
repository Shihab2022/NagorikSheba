import httpStatus from "http-status";
import { pool } from "../../../utils/pg";
import AppError from "../../errors/AppError";
import {
  isWithinBangladesh,
} from "./distance";
import {
  resolveBangladeshLocation,
  searchNearestOfficesInMemory,
  VERIFIED_BANGLADESH_GOVERNMENT_OFFICES,
} from "./bangladesh-locations";

/**
 * Government offices — nearby lookup module.
 *
 * Office records are curated from official Bangladesh government sources
 * (Election Commission, Department of Immigration & Passports, BDRIS,
 * BRTA, DGHS, Land Ministry). Coordinates, phone numbers and service availability
 * must be verified before insertion — never invented.
 *
 * STRICT REQUIREMENT: Only locations within Bangladesh territory are accepted or returned.
 */

export const OFFICE_SERVICE_KEYS = [
  "NID",
  "PASSPORT",
  "BIRTH_REGISTRATION",
  "DRIVING_LICENCE",
  "HOSPITAL",
  "LAND",
  "ALL",
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
  "government-hospital-services": "HOSPITAL",
  "land-mutation": "LAND",
  "e-mutation": "LAND",
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
  if (raw === undefined || raw === null || raw === "") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid ${bounds.label}. Expected a complete decimal number.`,
    );
  }
  const value = Number(raw);
  if (!Number.isFinite(value) || value < bounds.min || value > bounds.max) {
    throw new AppError(
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
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid ${label}. Expected an integer between 1 and ${max}.`,
    );
  }
  return value;
};

const parseServiceKey = (raw: unknown): OfficeServiceKey => {
  if (raw === undefined || raw === null || raw === "") {
    return "ALL";
  }
  if (typeof raw === "string") {
    const fromSlug = SERVICE_KEY_BY_SLUG[raw.trim().toLowerCase()];
    if (fromSlug) return fromSlug;
    const upper = raw.trim().toUpperCase();
    if ((OFFICE_SERVICE_KEYS as readonly string[]).includes(upper)) {
      return upper as OfficeServiceKey;
    }
  }
  if (!isOfficeServiceKey(raw)) {
    throw new AppError(
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
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Missing required query parameter: ${label}.`,
      );
    }
    return null;
  }
  if (typeof raw !== "string" || raw.length > 100) {
    throw new AppError(httpStatus.BAD_REQUEST, `Invalid ${label}.`);
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    if (required) {
      throw new AppError(
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
  phone:
    row.phone === null || row.phone === undefined ? null : String(row.phone),
  officialUrl:
    row.officialUrl === null || row.officialUrl === undefined
      ? null
      : String(row.officialUrl),
  lastVerifiedAt: new Date(String(row.lastVerifiedAt))
    .toISOString()
    .slice(0, 10),
  distanceKm:
    row.distanceKm === null || row.distanceKm === undefined
      ? null
      : Number(row.distanceKm),
});

/**
 * Offices supporting `service` within `radiusKm` of the given coordinates,
 * nearest first. Strictly restricted to Bangladesh locations only.
 */
const findNearbyOffices = async (params: {
  service?: unknown;
  lat?: unknown;
  lng?: unknown;
  location?: unknown;
  radiusKm?: unknown;
  page?: unknown;
  limit?: unknown;
}) => {
  const service = parseServiceKey(params.service ?? "ALL");

  let lat: number;
  let lng: number;
  let locationLabel: string | undefined;

  if (params.lat !== undefined && params.lng !== undefined && params.lat !== "" && params.lng !== "") {
    lat = parseCoordinate(params.lat, { min: -90, max: 90, label: "lat" });
    lng = parseCoordinate(params.lng, {
      min: -180,
      max: 180,
      label: "lng",
    });
  } else if (params.location && typeof params.location === "string" && params.location.trim()) {
    const resolved = resolveBangladeshLocation(params.location);
    if (!resolved) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Could not resolve location '${params.location}' within Bangladesh. NagorikSheba only provides location services within Bangladesh.`,
      );
    }
    lat = resolved.lat;
    lng = resolved.lng;
    locationLabel = resolved.displayName;
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Missing location coordinates or location name. Please provide lat/lng or a location in Bangladesh.",
    );
  }

  // Strictly check that user coordinates fall within Bangladesh
  if (!isWithinBangladesh(lat, lng)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "The specified location is outside Bangladesh. NagorikSheba only provides location services within Bangladesh.",
    );
  }

  const rawRadius =
    params.radiusKm === undefined ||
      params.radiusKm === "" ||
      params.radiusKm === null
      ? DEFAULT_RADIUS_KM
      : Number(params.radiusKm);
  if (
    !Number.isFinite(rawRadius) ||
    rawRadius < 1 ||
    rawRadius > MAX_RADIUS_KM
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid radiusKm. Expected a number between 1 and ${MAX_RADIUS_KM}.`,
    );
  }
  const radiusKm = rawRadius;
  const page = parsePositiveInt(
    params.page,
    1,
    Number.MAX_SAFE_INTEGER,
    "page",
  );
  const limit = parsePositiveInt(
    params.limit,
    DEFAULT_PAGE_LIMIT,
    MAX_PAGE_LIMIT,
    "limit",
  );
  const offset = (page - 1) * limit;

  // Try PostgreSQL database if available
  try {
    // Bounding box in degrees around the search point (1 deg lat ≈ 111.045 km).
    const latDelta = radiusKm / 111.045;
    const cosLat = Math.max(Math.abs(Math.cos((lat * Math.PI) / 180)), 0.01);
    const lngDelta = radiusKm / (111.045 * cosLat);

    const haversine = `(6371 * acos(LEAST(1.0, GREATEST(-1.0,
        cos(radians($2)) * cos(radians(o.latitude)) * cos(radians(o.longitude) - radians($3))
        + sin(radians($2)) * sin(radians(o.latitude))
      ))))`;

    const serviceFilter =
      service === "ALL"
        ? ""
        : `AND EXISTS (
             SELECT 1 FROM government_office_services s
             WHERE s."officeId" = o.id AND s."serviceKey" = $1
           )`;

    const baseFrom = `FROM government_offices o
      WHERE o."isDeleted" = FALSE
        AND o."isActive" = TRUE
        AND o.latitude BETWEEN $4 AND $5
        AND o.longitude BETWEEN $6 AND $7
        ${serviceFilter}`;

    const paramsList = [
      service,
      lat,
      lng,
      lat - latDelta,
      lat + latDelta,
      lng - lngDelta,
      lng + lngDelta,
    ];

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total
       FROM government_offices o
       WHERE o."isDeleted" = FALSE
         AND o."isActive" = TRUE
         AND o.latitude BETWEEN $2 AND $3
         AND o.longitude BETWEEN $4 AND $5
         ${service === "ALL" ? "" : `AND EXISTS (
           SELECT 1 FROM government_office_services s
           WHERE s."officeId" = o.id AND s."serviceKey" = $1
         )`}`,
      service === "ALL"
        ? [lat - latDelta, lat + latDelta, lng - lngDelta, lng + lngDelta]
        : [service, lat - latDelta, lat + latDelta, lng - lngDelta, lng + lngDelta],
    );
    const total: number = countResult.rows[0]?.total ?? 0;

    if (total > 0) {
      const result = await pool.query(
        `SELECT * FROM (
           SELECT ${OFFICE_COLUMNS}, ROUND((${haversine})::numeric, 2) AS "distanceKm" ${baseFrom}
         ) candidates
         WHERE candidates."distanceKm" <= $8
         ORDER BY candidates."distanceKm" ASC, candidates.name ASC
         LIMIT $9 OFFSET $10`,
        [...paramsList, radiusKm, limit, offset],
      );

      if (result.rows.length > 0) {
        return {
          service,
          origin: { lat, lng },
          locationName: locationLabel,
          radiusKm,
          country: "Bangladesh",
          offices: result.rows.map(mapOfficeRow),
          meta: { page, limit, total },
        };
      }
    }
  } catch (error) {
    // Database connection or table not seeded; fallback gracefully to in-memory verified dataset
  }

  // Graceful fallback to verified in-memory Bangladesh government offices dataset
  const inMemory = searchNearestOfficesInMemory({
    service,
    lat,
    lng,
    radiusKm,
    limit,
  });

  return {
    service,
    origin: { lat, lng },
    locationName: locationLabel,
    radiusKm,
    country: "Bangladesh",
    offices: inMemory.offices.map((off) => ({
      id: off.id,
      name: off.name,
      officeType: off.officeType,
      address: off.address,
      district: off.district,
      upazila: off.upazila,
      latitude: off.latitude,
      longitude: off.longitude,
      phone: off.phone,
      officialUrl: off.officialUrl,
      lastVerifiedAt: off.lastVerifiedAt,
      distanceKm: off.distanceKm,
    })),
    meta: { page, limit, total: inMemory.total },
  };
};

/**
 * Offices supporting `service` inside a manually selected district/upazila in Bangladesh.
 */
const findOfficesByArea = async (params: {
  service: unknown;
  district: unknown;
  upazila?: unknown;
  page?: unknown;
  limit?: unknown;
}) => {
  const service = parseServiceKey(params.service ?? "ALL");
  const district = sanitizeAreaText(params.district, "district", true);
  const upazila = sanitizeAreaText(params.upazila, "upazila", false);
  const page = parsePositiveInt(
    params.page,
    1,
    Number.MAX_SAFE_INTEGER,
    "page",
  );
  const limit = parsePositiveInt(
    params.limit,
    DEFAULT_PAGE_LIMIT,
    MAX_PAGE_LIMIT,
    "limit",
  );
  const offset = (page - 1) * limit;

  try {
    const serviceFilter =
      service === "ALL"
        ? ""
        : `AND EXISTS (
             SELECT 1 FROM government_office_services s
             WHERE s."officeId" = o.id AND s."serviceKey" = $${upazila ? 3 : 2}
           )`;

    const filters = `o."isDeleted" = FALSE AND o."isActive" = TRUE
        AND o.district ILIKE $1
        ${upazila ? "AND o.upazila ILIKE $2" : ""}
        ${serviceFilter}`;
    const paramsList = upazila
      ? [district, upazila, ...(service === "ALL" ? [] : [service])]
      : [district, ...(service === "ALL" ? [] : [service])];

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM government_offices o WHERE ${filters}`,
      paramsList,
    );
    const total: number = countResult.rows[0]?.total ?? 0;

    if (total > 0) {
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
        country: "Bangladesh",
        offices: result.rows.map(mapOfficeRow),
        meta: { page, limit, total },
      };
    }
  } catch (err) {
    // Fall back to in-memory verified Bangladesh offices
  }

  // In-memory fallback
  const dLower = district?.toLowerCase() ?? "";
  const uLower = upazila?.toLowerCase() ?? "";

  const filtered = VERIFIED_BANGLADESH_GOVERNMENT_OFFICES.filter((off) => {
    if (dLower && !off.district.toLowerCase().includes(dLower)) return false;
    if (uLower && !off.upazila.toLowerCase().includes(uLower)) return false;
    if (
      service !== "ALL" &&
      !off.services.some((s) => s.toUpperCase() === service)
    ) {
      return false;
    }
    return true;
  });

  return {
    service,
    area: { district, upazila },
    country: "Bangladesh",
    offices: filtered.slice(offset, offset + limit).map((off) => ({
      id: off.id,
      name: off.name,
      officeType: off.officeType,
      address: off.address,
      district: off.district,
      upazila: off.upazila,
      latitude: off.latitude,
      longitude: off.longitude,
      phone: off.phone,
      officialUrl: off.officialUrl,
      lastVerifiedAt: off.lastVerifiedAt,
      distanceKm: null,
    })),
    meta: { page, limit, total: filtered.length },
  };
};

/** Distinct district/upazila pairs that have active offices for a service. */
const listServiceAreas = async (params: { service: unknown }) => {
  const service = parseServiceKey(params.service ?? "ALL");

  try {
    const serviceFilter =
      service === "ALL"
        ? ""
        : `AND EXISTS (
             SELECT 1 FROM government_office_services s
             WHERE s."officeId" = o.id AND s."serviceKey" = $1
           )`;

    const result = await pool.query(
      `SELECT o.district, o.upazila
       FROM government_offices o
       WHERE o."isDeleted" = FALSE AND o."isActive" = TRUE
         ${serviceFilter}
       GROUP BY o.district, o.upazila
       ORDER BY o.district ASC, o.upazila ASC`,
      service === "ALL" ? [] : [service],
    );

    if (result.rows.length > 0) {
      return result.rows.map((row) => ({
        district: String(row.district),
        upazila: String(row.upazila),
      }));
    }
  } catch (err) {
    // Fall back to in-memory verified list
  }

  // In-memory fallback
  const matching = VERIFIED_BANGLADESH_GOVERNMENT_OFFICES.filter((off) => {
    if (service === "ALL") return true;
    return off.services.some((s) => s.toUpperCase() === service);
  });

  const unique = new Map<string, { district: string; upazila: string }>();
  for (const off of matching) {
    const key = `${off.district}__${off.upazila}`;
    if (!unique.has(key)) {
      unique.set(key, { district: off.district, upazila: off.upazila });
    }
  }

  return Array.from(unique.values()).sort((a, b) =>
    a.district.localeCompare(b.district) || a.upazila.localeCompare(b.upazila),
  );
};

export const GovernmentOfficesServices = {
  findNearbyOffices,
  findOfficesByArea,
  listServiceAreas,
};
