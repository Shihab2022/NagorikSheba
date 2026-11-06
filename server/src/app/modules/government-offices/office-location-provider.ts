import config from "../../../config";
import AppError from "../../errors/AppError";

export type OfficeCandidate = {
  osmType: "node" | "way" | "relation";
  osmId: number;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  phone?: string;
  officialUrl?: string;
  source: string;
  verificationStatus: "candidate";
  serviceEligible: boolean;
};

export interface OverpassPassportProvider {
  findNearbyPassportCandidates(lat: number, lng: number, radiusKm: number): Promise<OfficeCandidate[]>;
}

const CACHE_MAX_ENTRIES = 500;
const CACHE_TTL_MS = 10 * 60 * 1000;

const cache = new Map<string, { expires: number; candidates: OfficeCandidate[] }>();

const inFlight = new Map<string, Promise<OfficeCandidate[]>>();

const lastFailureAt = new Map<string, number>();

const failureCooldownMs = 30000;

const buildQuery = (lat: number, lng: number, radiusKm: number): string => {
  const radiusM = Math.round(radiusKm * 1000);
  return `[out:json];
  (node[office=government](around:${radiusM},${lat},${lng});
   way[office=government](around:${radiusM},${lat},${lng});
   relation[office=government](around:${radiusM},${lat},${lng});
   node[amenity=passport](around:${radiusM},${lat},${lng});
   way[amenity=passport](around:${radiusM},${lat},${lng});
  );
  out center;
  `;
};

async function fetchOverpass(lat: number, lng: number, radiusKm: number): Promise<OfficeCandidate[]> {
  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}:${radiusKm}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return cached.candidates;
  }

  const failureAt = lastFailureAt.get(cacheKey);
  if (failureAt && Date.now() - failureAt < failureCooldownMs) {
    throw new AppError(503, "Overpass service temporarily unavailable due to recent failure");
  }

  const existing = inFlight.get(cacheKey);
  if (existing) return existing;

  const overpassConfig = config.overpass;
  const baseUrl = overpassConfig.overpass_api_url;
  if (!baseUrl || typeof baseUrl !== "string" || !baseUrl.startsWith("https://")) {
    throw new AppError(
      500,
      "Overpass API URL is not configured. Set OVERPASS_API_URL environment variable.",
    );
  }
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const endpoint =
    cleanBase.endsWith("/interpreter") ? cleanBase : `${cleanBase}/interpreter`;
  const requestUrl = new URL(endpoint);

  const timeoutMs = Number(overpassConfig.overpass_timeout_ms) || 12000;

  const promise = (async () => {
    try {
      const response = await fetch(requestUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": overpassConfig.overpass_user_agent ?? "NagorikSheba/1.0 (contact: muhammadnur.codes@gmail.com)"
        },
        body: `data=${encodeURIComponent(buildQuery(lat, lng, radiusKm))}`,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!response.ok) {
        lastFailureAt.set(cacheKey, Date.now());
        throw new AppError(response.status, `Overpass API error: ${response.statusText}`);
      }
      const data = await response.json();
      const candidates = parseOverpassResponse(data);
      if (candidates.length > 0) {
        cache.set(cacheKey, { expires: Date.now() + CACHE_TTL_MS, candidates });
      }
      return candidates;
    } catch (error) {
      lastFailureAt.set(cacheKey, Date.now());
      throw error;
    } finally {
      inFlight.delete(cacheKey);
    }
  })();

  inFlight.set(cacheKey, promise);
  return promise;
}

function parseOverpassResponse(data: any): OfficeCandidate[] {
  if (!data || !data.elements || !Array.isArray(data.elements)) {
    return [];
  }

  const candidates: OfficeCandidate[] = [];
  const seen = new Set<string>();

  for (const element of data.elements) {
    const tags = element.tags || {};
    const name = tags.name || "";
    const lowercasedName = name.toLowerCase();

    const isPassportRelated =
      /\b(passport|pasport|epassport)\b/.test(lowercasedName) ||
      /passport/i.test(lowercasedName) ||
      /immigration/i.test(lowercasedName) ||
      /visa/i.test(lowercasedName) ||
      /পাসপোর্ট/i.test(lowercasedName) ||
      /ইমিগ্রেশন/i.test(lowercasedName);

    if (!isPassportRelated) {
      continue;
    }

    const key = `${element.type}:${element.id}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const candidate: OfficeCandidate = {
      osmType: element.type as "node" | "way" | "relation",
      osmId: element.id,
      name: name || "Unknown Passport Office",
      latitude: element.lat ?? element.center?.lat ?? 0,
      longitude: element.lon ?? element.center?.lon ?? 0,
      address: tags.address ?? undefined,
      phone: tags.phone ?? undefined,
      officialUrl: tags.website ?? tags.url ?? undefined,
      source: "overpass",
      verificationStatus: "candidate",
      serviceEligible: false,
    };

    candidates.push(candidate);
  }

  return candidates;
}

export { failureCooldownMs };

/** Test utilities - exposed for test isolation, not part of the public API */
export const _testUtils = {
  cache,
  inFlight,
  lastFailureAt,
};

export const overpassPassportProvider: OverpassPassportProvider = {
  async findNearbyPassportCandidates(lat: number, lng: number, radiusKm: number): Promise<OfficeCandidate[]> {
    if (!isValidCoordinate(lat, lng)) {
      return [];
    }
    return fetchOverpass(lat, lng, radiusKm);
  },
};

function isValidCoordinate(lat: number, lng: number): boolean {
  return Number.isFinite(lat) && Number.isFinite(lng) &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180;
}