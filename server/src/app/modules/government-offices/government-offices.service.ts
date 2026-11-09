import httpStatus from "http-status";
import { pool } from "../../../utils/pg";
import AppError from "../../errors/AppError";
import {
  overpassPassportProvider,
  type OfficeCandidate,
  type PassportAreaSearchInput,
} from "./office-location-provider";
import { getValhallaDrivingDistanceKm } from "./valhalla-routing.provider";
import { dispatchOfficeSearch } from "./provider-dispatch";
import { getServiceDefinitionByServiceKey } from "./service-definitions";
import { type NormalizedOffice } from "./office-provider.types";
// Register the Election Commission OSM provider with the shared provider
// registry so NID requests can be dispatched to it.
import "./election-commission-osm.provider";

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
const MAX_RADIUS_KM = 100;
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
  if (typeof raw === "string") {
    const fromSlug = SERVICE_KEY_BY_SLUG[raw.trim().toLowerCase()];
    if (fromSlug) return fromSlug;
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
 * Map a NormalizedOffice (EC OSM provider) into the existing nearby-office
 * response shape. Coordinates and distance remain nullable where applicable.
 */
const mapNidOfficesToResponse = (offices: NormalizedOffice[]) =>
  offices.map((o) => ({
    id: o.id,
    name: o.name,
    officeType: o.officeType,
    address: o.address ?? null,
    district: o.matchedArea?.district ?? null,
    upazila: o.matchedArea?.upazila ?? null,
    latitude: o.latitude,
    longitude: o.longitude,
    phone: o.phone ?? null,
    officialUrl: o.officialUrl ?? null,
    lastVerifiedAt: null,
    source: o.source,
    family: o.family,
    matchedArea: o.matchedArea,
    distanceKm: o.distanceKm,
  }));

const paginate = <T>(items: T[], page: number, limit: number) => {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
};

/**
 * NID GPS discovery: dispatches to the configured Election Commission OSM
 * provider through the shared provider dispatcher.
 */
const findNearbyNidOffices = async (params: {
  service: OfficeServiceKey;
  lat: number;
  lng: number;
  radiusKm: number;
  page: number;
  limit: number;
}) => {
  const serviceDefinition = getServiceDefinitionByServiceKey(params.service);
  if (!serviceDefinition) {
    throw new AppError(
      httpStatus.NOT_IMPLEMENTED,
      "NID service is not configured.",
    );
  }

  const outcome = await dispatchOfficeSearch({
    serviceDefinition,
    mode: "gps",
    params: { lat: params.lat, lng: params.lng, radiusKm: params.radiusKm },
  });

  const offices = mapNidOfficesToResponse(outcome.offices);
  const total = offices.length;

  if (outcome.outcome === "complete-failure") {
    throw new AppError(
      503,
      "Office discovery failed — all configured providers were unavailable.",
    );
  }
  if (outcome.outcome === "missing-config") {
    throw new AppError(
      httpStatus.NOT_IMPLEMENTED,
      "NID office discovery is not configured.",
    );
  }

  return {
    service: params.service,
    origin: { lat: params.lat, lng: params.lng },
    radiusKm: params.radiusKm,
    offices: paginate(offices, params.page, params.limit),
    meta: { page: params.page, limit: params.limit, total },
  };
};

/**
 * NID area discovery: dispatches to the configured Election Commission OSM
 * provider through the shared provider dispatcher.
 */
const findOfficesByAreaNid = async (params: {
  service: OfficeServiceKey;
  district: string;
  districtBn?: string;
  upazila?: string;
  upazilaBn?: string;
  page: number;
  limit: number;
}) => {
  const serviceDefinition = getServiceDefinitionByServiceKey(params.service);
  if (!serviceDefinition) {
    throw new AppError(
      httpStatus.NOT_IMPLEMENTED,
      "NID service is not configured.",
    );
  }

  const outcome = await dispatchOfficeSearch({
    serviceDefinition,
    mode: "area",
    params: {
      district: params.district,
      districtBn: params.districtBn,
      upazila: params.upazila,
      upazilaBn: params.upazilaBn,
    },
  });

  const offices = mapNidOfficesToResponse(outcome.offices);
  const total = offices.length;

  if (outcome.outcome === "complete-failure") {
    throw new AppError(
      503,
      "Office discovery failed — all configured providers were unavailable.",
    );
  }
  if (outcome.outcome === "missing-config") {
    throw new AppError(
      httpStatus.NOT_IMPLEMENTED,
      "NID office discovery is not configured.",
    );
  }

  return {
    service: params.service,
    area: { district: params.district, upazila: params.upazila },
    offices: paginate(offices, params.page, params.limit),
    meta: { page: params.page, limit: params.limit, total },
  };
};

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
  const lng = parseCoordinate(params.lng, {
    min: -180,
    max: 180,
    label: "lng",
  });

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

  if (service === "PASSPORT") {
    let offices: any[] = [];
    try {
      const rawCandidates =
        await overpassPassportProvider.findNearbyPassportCandidates(
          lat,
          lng,
          radiusKm,
        );
      const seen = new Set();
      const filtered = rawCandidates.filter((c) => {
        const key = `${c.osmType}:${c.osmId}`;
        if (seen.has(key)) return false;
        seen.add(key);
        const d = Math.hypot(c.latitude - lat, c.longitude - lng) * 111;
        return d <= radiusKm;
      });
      const mapped = filtered.map((c) => ({
        id: `osm:${c.osmType}:${c.osmId}`,
        name: c.name,
        latitude: c.latitude,
        longitude: c.longitude,
        address: c.address,
        phone: c.phone,
        officialUrl: c.officialUrl,
        source: "OpenStreetMap",
      }));
      // attach driving distances
      const withDistances = await Promise.all(
        mapped.map(async (office) => {
          const drivingDistanceKm = await getValhallaDrivingDistanceKm(
            { lat, lng },
            { lat: office.latitude, lng: office.longitude },
          );
          return { ...office, drivingDistanceKm };
        }),
      );
      offices = withDistances
        .filter(
          (office) =>
            office.drivingDistanceKm == null ||
            office.drivingDistanceKm <= radiusKm,
        )
        .sort((a, b) => {
          if (a.drivingDistanceKm == null && b.drivingDistanceKm == null)
            return 0;
          if (a.drivingDistanceKm == null) return 1;
          if (b.drivingDistanceKm == null) return -1;
          return a.drivingDistanceKm - b.drivingDistanceKm;
        });
      console.info(`Passport OSM offices: ${offices.length}`);
    } catch {
      offices = [];
    }
    return {
      service,
      origin: { lat, lng },
      radiusKm,
      offices,
      meta: { page, limit, total: offices.length },
    };
  }

  // NID office discovery goes through the shared provider dispatcher
  // (Election Commission OSM provider) instead of the PostgreSQL path.
  if (service === "NID") {
    return findNearbyNidOffices({
      service,
      lat,
      lng,
      radiusKm,
      page,
      limit,
    });
  }

  // existing DB path for other services
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

  const latDelta = radiusKm / 111.045;

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
    [service, lat - latDelta, lat + latDelta, lng - lngDelta, lng + lngDelta],
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

  const offices = result.rows.map(mapOfficeRow);

  return {
    service,
    origin: { lat, lng },
    radiusKm,
    offices,
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
  districtBn?: unknown;
  upazila?: unknown;
  upazilaBn?: unknown;
  page?: unknown;
  limit?: unknown;
}) => {
  const service = parseServiceKey(params.service);
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

  // Sanitize optional Bengali parameters using existing logic.
  // sanitizeAreaText returns string | null; for optional fields we convert null to undefined.
  const sanitizedDistrictBn =
    params.districtBn !== undefined && params.districtBn !== null
      ? (sanitizeAreaText(params.districtBn, "districtBn", false) ?? undefined)
      : undefined;

  const sanitizedUpazilaBn =
    params.upazilaBn !== undefined && params.upazilaBn !== null
      ? (sanitizeAreaText(params.upazilaBn, "upazilaBn", false) ?? undefined)
      : undefined;

  // Passport area discovery uses OSM/Overpass with administrative boundaries
  if (service === "PASSPORT") {
    const passportInput: PassportAreaSearchInput = {
      district: district as string,
      districtBn: sanitizedDistrictBn,
      upazila: upazila as string | undefined,
      upazilaBn: sanitizedUpazilaBn,
    };
    const candidates =
      await overpassPassportProvider.findPassportOfficesByArea(passportInput);
    // Apply pagination: slice the mapped office list, but total is from complete list
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedOffices = candidates
      .map((c) => ({
        id: `osm:${c.osmType}:${c.osmId}`,
        name: c.name,
        latitude: c.latitude,
        longitude: c.longitude,
        address: c.address,
        phone: c.phone,
        officialUrl: c.officialUrl,
        source: "OpenStreetMap",
        // Distance fields are not applicable for area-based Passport results
        distanceKm: null,
      }))
      .slice(start, end);
    return {
      service,
      area: { district, upazila },
      offices: paginatedOffices,
      meta: {
        page,
        limit,
        total: candidates.length,
      },
    };
  }

  // NID area discovery goes through the shared provider dispatcher
  // (Election Commission OSM provider) instead of the PostgreSQL path.
  if (service === "NID") {
    return findOfficesByAreaNid({
      service,
      district: district as string,
      districtBn: sanitizedDistrictBn,
      upazila: upazila as string | undefined,
      upazilaBn: sanitizedUpazilaBn,
      page,
      limit,
    });
  }

  const filters = `o."isDeleted" = FALSE AND o."isActive" = TRUE
      AND o.district = $1
      ${upazila ? "AND o.upazila = $2" : ""}
      AND EXISTS (
        SELECT 1 FROM government_office_services s
        WHERE s."officeId" = o.id AND s."serviceKey" = $${upazila ? 3 : 2}
      )`;
  const paramsList = upazila
    ? [district, upazila, service]
    : [district, service];

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
