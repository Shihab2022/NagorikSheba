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

export type PassportAreaSearchInput = {
  district: string;
  districtBn?: string;
  upazila?: string;
  upazilaBn?: string;
};

export interface OverpassPassportProvider {
  findNearbyPassportCandidates(
    lat: number,
    lng: number,
    radiusKm: number,
  ): Promise<OfficeCandidate[]>;

  findPassportOfficesByArea(
    input: PassportAreaSearchInput,
  ): Promise<OfficeCandidate[]>;
}

const CACHE_MAX_ENTRIES = 500;
const CACHE_TTL_MS = 10 * 60 * 1000;

const cache = new Map<
  string,
  { expires: number; candidates: OfficeCandidate[] }
>();

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

async function fetchOverpass(
  lat: number,
  lng: number,
  radiusKm: number,
): Promise<OfficeCandidate[]> {
  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}:${radiusKm}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return cached.candidates;
  }

  const failureAt = lastFailureAt.get(cacheKey);
  if (failureAt && Date.now() - failureAt < failureCooldownMs) {
    throw new AppError(
      503,
      "Overpass service temporarily unavailable due to recent failure",
    );
  }

  const existing = inFlight.get(cacheKey);
  if (existing) return existing;

  const overpassConfig = config.overpass;
  const baseUrl = overpassConfig.overpass_api_url;
  if (
    !baseUrl ||
    typeof baseUrl !== "string" ||
    !baseUrl.startsWith("https://")
  ) {
    throw new AppError(
      500,
      "Overpass API URL is not configured. Set OVERPASS_API_URL environment variable.",
    );
  }
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const endpoint = cleanBase.endsWith("/interpreter")
    ? cleanBase
    : `${cleanBase}/interpreter`;
  const requestUrl = new URL(endpoint);

  const timeoutMs = Number(overpassConfig.overpass_timeout_ms) || 12000;

  const promise = (async () => {
    try {
      const response = await fetch(requestUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent":
            overpassConfig.overpass_user_agent ??
            "NagorikSheba/1.0 (contact: muhammadnur.codes@gmail.com)",
        },
        body: `data=${encodeURIComponent(buildQuery(lat, lng, radiusKm))}`,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!response.ok) {
        lastFailureAt.set(cacheKey, Date.now());
        throw new AppError(
          response.status,
          `Overpass API error: ${response.statusText}`,
        );
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

type OverpassElement = {
  type?: string;
  id?: number;
  lat?: number;
  lon?: number;
  center?: {
    lat?: number;
    lon?: number;
  };
  tags?: Record<string, string>;
};

const BANGLADESH_BBOX = "(20.5,88,26.5,92.5)";

async function executeAreaOverpassQuery(
  query: string,
  requestKey: string,
): Promise<OverpassElement[]> {
  const failureAt = lastFailureAt.get(requestKey);

  if (failureAt && Date.now() - failureAt < failureCooldownMs) {
    throw new AppError(503, "Overpass area search temporarily unavailable.");
  }

  const overpassConfig = config.overpass;
  const baseUrl = overpassConfig.overpass_api_url;

  if (
    !baseUrl ||
    typeof baseUrl !== "string" ||
    !baseUrl.startsWith("https://")
  ) {
    throw new AppError(500, "Overpass API URL is not configured.");
  }

  const cleanBase = baseUrl.replace(/\/+$/, "");

  const endpoint = cleanBase.endsWith("/interpreter")
    ? cleanBase
    : `${cleanBase}/interpreter`;

  const timeoutMs = Number(overpassConfig.overpass_timeout_ms) || 30000;

  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": overpassConfig.overpass_user_agent ?? "NagorikSheba/1.0",
      },
      body: new URLSearchParams({ data: query }).toString(),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch {
    lastFailureAt.set(requestKey, Date.now());

    throw new AppError(
      503,
      "Unable to connect to Overpass area discovery service.",
    );
  }

  if (!response.ok) {
    lastFailureAt.set(requestKey, Date.now());

    throw new AppError(
      503,
      `Overpass area query failed with HTTP ${response.status}.`,
    );
  }

  let data: any;

  try {
    data = await response.json();
  } catch {
    lastFailureAt.set(requestKey, Date.now());

    throw new AppError(502, "Invalid JSON response from Overpass.");
  }

  if (data?.remark || !Array.isArray(data?.elements)) {
    lastFailureAt.set(requestKey, Date.now());

    throw new AppError(
      502,
      "Overpass returned an invalid area query response.",
    );
  }

  lastFailureAt.delete(requestKey);

  return data.elements;
}

function normalizeAdministrativeName(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/\b(district|zilla|zila|upazila|upazilla)\b/gi, "")
    .replace(/(জেলা|উপজেলা)$/u, "")
    .replace(/য়/g, "য়")
    .replace(/ড়/g, "ড়")
    .replace(/[\s.,;:/_-]+/g, "")
    .trim();
}

function getBoundaryNames(tags: Record<string, string>): string[] {
  return [
    tags.name,
    tags["name:en"],
    tags["name:bn"],
    tags.official_name,
    tags.alt_name,
  ]
    .filter((value): value is string => Boolean(value))
    .flatMap((value) => value.split(/[;|]/))
    .map((value) => value.trim())
    .filter(Boolean);
}

function resolveUniqueBoundary(
  elements: OverpassElement[],
  adminLevel: 5 | 6,
  expectedNames: string[],
  description: string,
): OverpassElement {
  const expected = new Set(
    expectedNames
      .filter(Boolean)
      .map(normalizeAdministrativeName)
      .filter(Boolean),
  );

  const uniqueMatches = new Map<number, OverpassElement>();

  for (const element of elements) {
    if (
      element.type !== "relation" ||
      !Number.isSafeInteger(element.id) ||
      element.tags?.boundary !== "administrative" ||
      element.tags?.admin_level !== String(adminLevel)
    ) {
      continue;
    }

    const matches = getBoundaryNames(element.tags).some((name) =>
      expected.has(normalizeAdministrativeName(name)),
    );

    if (matches) {
      uniqueMatches.set(element.id!, element);
    }
  }

  const matches = [...uniqueMatches.values()];

  if (matches.length > 1) {
    throw new AppError(
      409,
      `Multiple OSM boundaries match the selected ${description}.`,
    );
  }

  const match = matches[0];

  if (!match) {
    throw new AppError(404, `OSM ${description} boundary was not found.`);
  }

  return match;
}

function buildDistrictBoundaryQuery(): string {
  return `
[out:json][timeout:30];
relation
  ["boundary"="administrative"]
  ["admin_level"="5"]
  ${BANGLADESH_BBOX};
out tags center;
`;
}

function buildUpazilaBoundaryQuery(districtRelationId: number): string {
  return `
[out:json][timeout:30];

rel(${districtRelationId})->.parentDistrict;
.parentDistrict map_to_area->.parentArea;
.parentArea out count;

relation
  (area.parentArea)
  ["boundary"="administrative"]
  ["admin_level"="6"];

out tags center;
`;
}

function buildPassportAreaOfficeQuery(relationId: number): string {
  return `
[out:json][timeout:30];

rel(${relationId})->.boundary;
.boundary map_to_area->.selectedArea;
.selectedArea out count;

(
  node(area.selectedArea)["office"="government"];
  way(area.selectedArea)["office"="government"];
  relation(area.selectedArea)["office"="government"];

  node(area.selectedArea)["amenity"="passport"];
  way(area.selectedArea)["amenity"="passport"];
  relation(area.selectedArea)["amenity"="passport"];
)->.offices;

.offices out center tags;
`;
}

function assertAreaWasResolved(
  elements: OverpassElement[],
  description: string,
): void {
  const countElement = elements.find((element) => element.type === "count");

  const areaCount = Number(
    countElement?.tags?.areas ?? countElement?.tags?.["count:areas"] ?? 0,
  );

  if (!countElement || !Number.isFinite(areaCount) || areaCount < 1) {
    throw new AppError(
      404,
      `A usable OSM polygon boundary is unavailable for ${description}.`,
    );
  }
}

function parsePassportAreaCandidates(
  elements: OverpassElement[],
): OfficeCandidate[] {
  const candidates: OfficeCandidate[] = [];
  const seen = new Set<string>();

  const passportPattern =
    /passport|pasport|e[\s-]?passport|immigration|visa|পাসপোর্ট|ইমিগ্রেশন|ভিসা/i;

  for (const element of elements) {
    if (
      element.type !== "node" &&
      element.type !== "way" &&
      element.type !== "relation"
    ) {
      continue;
    }

    if (!Number.isSafeInteger(element.id)) continue;

    const tags = element.tags ?? {};

    const searchableNames = getBoundaryNames(tags).join(" ");

    if (!passportPattern.test(searchableNames)) {
      continue;
    }

    const key = `${element.type}:${element.id}`;

    if (seen.has(key)) continue;
    seen.add(key);

    const latitude = element.lat ?? element.center?.lat;
    const longitude = element.lon ?? element.center?.lon;

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      !isValidCoordinate(latitude, longitude)
    ) {
      continue;
    }

    const name = tags.name || tags["name:en"] || tags["name:bn"];

    if (!name) continue;

    const address =
      tags["addr:full"] ||
      [tags["addr:street"], tags["addr:city"], tags["addr:district"]]
        .filter(Boolean)
        .join(", ") ||
      undefined;

    candidates.push({
      osmType: element.type,
      osmId: element.id!,
      name,
      latitude,
      longitude,
      address,
      phone: tags.phone || tags["contact:phone"] || undefined,
      officialUrl:
        tags.website || tags.url || tags["contact:website"] || undefined,
      source: "overpass",
      verificationStatus: "candidate",
      serviceEligible: false,
    });
  }

  return candidates;
}

async function findPassportOfficesByArea(
  input: PassportAreaSearchInput,
): Promise<OfficeCandidate[]> {
  const district = input.district?.trim();
  const districtBn = input.districtBn?.trim() ?? "";

  const upazila = input.upazila?.trim() ?? "";
  const upazilaBn = input.upazilaBn?.trim() ?? "";

  if (!district) {
    throw new AppError(400, "District is required.");
  }

  const cacheKey = [
    "passport-area",
    normalizeAdministrativeName(district),
    normalizeAdministrativeName(districtBn),
    normalizeAdministrativeName(upazila),
    normalizeAdministrativeName(upazilaBn),
  ].join(":");

  const cached = cache.get(cacheKey);

  if (cached && cached.expires > Date.now()) {
    return cached.candidates;
  }

  const existing = inFlight.get(cacheKey);

  if (existing) {
    return existing;
  }

  const promise = (async () => {
    try {
      // Step 1: Resolve District boundary.
      const districtElements = await executeAreaOverpassQuery(
        buildDistrictBoundaryQuery(),
        `passport-area-districts`,
      );

      const districtBoundary = resolveUniqueBoundary(
        districtElements,
        5,
        [district, districtBn],
        "district",
      );

      // Step 2: Resolve optional Upazila inside parent District.
      let selectedBoundary = districtBoundary;

      if (upazila || upazilaBn) {
        const upazilaElements = await executeAreaOverpassQuery(
          buildUpazilaBoundaryQuery(districtBoundary.id!),
          `passport-area-upazilas:${districtBoundary.id}`,
        );

        assertAreaWasResolved(upazilaElements, `district ${district}`);

        selectedBoundary = resolveUniqueBoundary(
          upazilaElements,
          6,
          [upazila, upazilaBn],
          "upazila",
        );
      }

      // Step 3: Discover offices inside the exact polygon.
      const officeElements = await executeAreaOverpassQuery(
        buildPassportAreaOfficeQuery(selectedBoundary.id!),
        `passport-area-offices:${selectedBoundary.id}`,
      );

      assertAreaWasResolved(officeElements, upazila || district);

      // Step 4: Apply the existing Passport-related name rules.
      const candidates = parsePassportAreaCandidates(officeElements);

      // Cache successful non-empty results only.
      if (candidates.length > 0) {
        cache.set(cacheKey, {
          expires: Date.now() + CACHE_TTL_MS,
          candidates,
        });
      }

      return candidates;
    } finally {
      inFlight.delete(cacheKey);
    }
  })();

  inFlight.set(cacheKey, promise);

  return promise;
}

export { failureCooldownMs, findPassportOfficesByArea };

/** Test utilities - exposed for test isolation, not part of the public API */
export const _testUtils = {
  cache,
  inFlight,
  lastFailureAt,
};

export const overpassPassportProvider: OverpassPassportProvider = {
  async findNearbyPassportCandidates(
    lat: number,
    lng: number,
    radiusKm: number,
  ): Promise<OfficeCandidate[]> {
    if (!isValidCoordinate(lat, lng)) {
      return [];
    }

    return fetchOverpass(lat, lng, radiusKm);
  },

  findPassportOfficesByArea,
};

function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}
