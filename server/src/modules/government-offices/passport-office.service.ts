import fs from "node:fs";
import path from "node:path";
import httpStatus from "http-status";
import ApiError from "../../app/errors/AppError";
import {
  haversineDistanceKm,
  isValidCoordinate,
} from "./distance";

type RawPassportOffice = {
  office_name?: unknown;
  division?: unknown;
  district?: unknown;
  upazila?: unknown;
  address?: unknown;
  phone?: unknown;
  service_type?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  source_url?: unknown;
  verified?: unknown;
  image_url?: unknown;
  officeType?: unknown;
};

export type PassportOffice = {
  id: string;
  name: string;
  officeType: string | null;
  address: string | null;
  division: string | null;
  district: string | null;
  upazila: string | null;
  latitude: number;
  longitude: number;
  phone: string | null;
  officialUrl: string | null;
  verified: boolean | null;
  imageUrl: string | null;
  lastVerifiedAt: string | null;
  distanceKm: number;
};

const DEFAULT_RADIUS_KM = 50;
const MAX_RADIUS_KM = 500;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
let cachedRows: RawPassportOffice[] | null = null;

function dataFilePath(): string {
  const configured = process.env.PASSPORT_OFFICE_DATA_PATH;
  if (configured) return path.resolve(configured);

  const candidates = [
    path.resolve(process.cwd(), "data/passportOfficeData.json"),
    path.resolve(process.cwd(), "../data/passportOfficeData.json"),
    path.resolve(__dirname, "../../../../data/passportOfficeData.json"),
  ];
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  return found ?? candidates[0];
}

function loadRows(): RawPassportOffice[] {
  if (cachedRows) return cachedRows;

  const filePath = dataFilePath();
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(
      `Could not load passport office data from ${filePath}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  const rows = Array.isArray(parsed)
    ? parsed
    : typeof parsed === "object" &&
        parsed !== null &&
        Array.isArray((parsed as { offices?: unknown }).offices)
      ? (parsed as { offices: unknown[] }).offices
      : null;

  if (!rows || rows.some((row) => typeof row !== "object" || row === null)) {
    throw new Error("Passport office data must be an array of office records.");
  }

  cachedRows = rows as RawPassportOffice[];
  return cachedRows;
}

function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function numberValue(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isPassportRecord(row: RawPassportOffice): boolean {
  const searchable = [
    row.office_name,
    row.service_type,
    row.officeType,
    row.source_url,
  ]
    .map(text)
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return searchable.includes("passport") || searchable.includes("epassport");
}

function stableId(row: RawPassportOffice, index: number): string {
  const identity = [
    text(row.office_name) ?? "office",
    text(row.district) ?? "",
    numberValue(row.latitude) ?? "",
    numberValue(row.longitude) ?? "",
  ]
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return identity ? `passport-office-${identity}` : `passport-office-${index}`;
}

function parseCoordinate(raw: unknown, label: "lat" | "lng"): number {
  if (typeof raw !== "string" || !/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(raw)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid ${label}. Expected a complete decimal number.`,
    );
  }
  const value = Number(raw);
  const valid = label === "lat" ? value >= -90 && value <= 90 : value >= -180 && value <= 180;
  if (!Number.isFinite(value) || !valid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid ${label}. Expected a number within geographic bounds.`,
    );
  }
  return value;
}

function parseNumber(
  raw: unknown,
  fallback: number,
  min: number,
  max: number,
  label: string,
): number {
  if (raw === undefined || raw === null || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid ${label}. Expected a number between ${min} and ${max}.`,
    );
  }
  return value;
}

function parseLimit(raw: unknown): number {
  if (raw === undefined || raw === null || raw === "") return DEFAULT_LIMIT;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > MAX_LIMIT) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid limit. Expected an integer between 1 and ${MAX_LIMIT}.`,
    );
  }
  return value;
}

export function findNearbyPassportOffices(params: {
  lat: unknown;
  lng: unknown;
  radiusKm?: unknown;
  limit?: unknown;
}) {
  const lat = parseCoordinate(params.lat, "lat");
  const lng = parseCoordinate(params.lng, "lng");
  const radiusKm = parseNumber(
    params.radiusKm,
    DEFAULT_RADIUS_KM,
    1,
    MAX_RADIUS_KM,
    "radiusKm",
  );
  const limit = parseLimit(params.limit);

  const matches = loadRows()
    .map((row, index): PassportOffice | null => {
      if (!isPassportRecord(row)) return null;
      const officeLat = numberValue(row.latitude);
      const officeLng = numberValue(row.longitude);
      if (
        officeLat === null ||
        officeLng === null ||
        !isValidCoordinate(officeLat, officeLng)
      ) {
        return null;
      }

      const distanceKm = haversineDistanceKm(
        { lat, lng },
        { lat: officeLat, lng: officeLng },
      );
      if (distanceKm > radiusKm) return null;

      return {
        id: stableId(row, index),
        name: text(row.office_name) ?? "Unnamed passport office",
        officeType: text(row.service_type) ?? text(row.officeType),
        address: text(row.address),
        division: text(row.division),
        district: text(row.district),
        upazila: text(row.upazila),
        latitude: officeLat,
        longitude: officeLng,
        phone: text(row.phone),
        officialUrl: text(row.source_url),
        verified: typeof row.verified === "boolean" ? row.verified : null,
        imageUrl: text(row.image_url),
        lastVerifiedAt: null,
        distanceKm: Number(distanceKm.toFixed(2)),
      };
    })
    .filter((office): office is PassportOffice => office !== null)
    .sort((a, b) => a.distanceKm - b.distanceKm || a.name.localeCompare(b.name));

  return {
    origin: { lat, lng },
    radiusKm,
    offices: matches.slice(0, limit),
    meta: { total: matches.length, limit },
  };
}

export function clearPassportOfficeCache(): void {
  cachedRows = null;
}
