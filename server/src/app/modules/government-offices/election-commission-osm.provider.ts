import config from "../../../config";
import AppError from "../../errors/AppError";
import { classifyEcRecord } from "./election-commission.matching";
import {
  NormalizedOffice,
  OfficeFamily,
  OfficeProvider,
  OfficeServiceMode,
  OfficeSource,
  OfficeType,
} from "./office-provider.types";
import { officeProviderRegistry } from "./provider-registry";

export const ELECTION_COMMISSION_OSM_PROVIDER_ID = "election-commission-osm";

const DEFAULT_TIMEOUT_MS = 12000;

// Area searches are scoped to Bangladesh so a district/upazila lookup does not
// scan the whole planet.
const BANGLADESH_BBOX = { south: 20.6, west: 88.0, north: 26.7, east: 92.8 };

function overpassEndpoint(): string {
  const overpass = config.overpass;
  const baseUrl = overpass.overpass_api_url;
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
  const clean = baseUrl.replace(/\/+$/, "");
  return clean.endsWith("/interpreter") ? clean : `${clean}/interpreter`;
}

function getQueryTimeoutSeconds(): number {
  const timeoutMs =
    Number(config.overpass.overpass_timeout_ms) || DEFAULT_TIMEOUT_MS;

  return Math.max(1, Math.ceil(timeoutMs / 1000));
}

function buildGpsQuery(lat: number, lng: number, radiusKm: number): string {
  const radiusM = Math.round(radiusKm * 1000);

  return `[out:json][timeout:${getQueryTimeoutSeconds()}];
(
  node[office=government](around:${radiusM},${lat},${lng});
  way[office=government](around:${radiusM},${lat},${lng});
  relation[office=government](around:${radiusM},${lat},${lng});
);
out center;
`;
}

function buildAreaQuery(): string {
  const { south, west, north, east } = BANGLADESH_BBOX;

  return `[out:json][timeout:${getQueryTimeoutSeconds()}];
(
  node[office=government](${south},${west},${north},${east});
  way[office=government](${south},${west},${north},${east});
  relation[office=government](${south},${west},${north},${east});
);
out center;
`;
}

async function fetchOverpassElements(
  query: string,
): Promise<Record<string, unknown>[]> {
  const response = await fetch(overpassEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": config.overpass.overpass_user_agent ?? "NagorikSheba/1.0",
    },
    body: `data=${encodeURIComponent(query)}`,
    signal: AbortSignal.timeout(
      Number(config.overpass.overpass_timeout_ms) || DEFAULT_TIMEOUT_MS,
    ),
  });

  if (!response.ok) {
    throw new AppError(502, `Overpass API returned ${response.status}`);
  }

  const json = await response.json();
  const elements = json.elements;
  return Array.isArray(elements) ? elements : [];
}

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return 2 * 6371 * Math.asin(Math.sqrt(a));
}

function elementName(tags: Record<string, string>): string {
  return (
    tags.name ??
    tags["name:en"] ??
    tags["name:bn"] ??
    "Election Commission Office"
  );
}

function normalizeElement(
  element: Record<string, unknown>,
  userLat?: number,
  userLng?: number,
): NormalizedOffice {
  const tags = (element.tags ?? {}) as Record<string, string>;
  const center = element.center as Record<string, unknown> | undefined;
  const latitude =
    typeof element.lat === "number"
      ? element.lat
      : center != null && typeof center.lat === "number"
        ? center.lat
        : null;
  const longitude =
    typeof element.lon === "number"
      ? element.lon
      : center != null && typeof center.lon === "number"
        ? center.lon
        : null;
  let distanceKm: number | null = null;
  if (
    latitude != null &&
    longitude != null &&
    userLat != null &&
    userLng != null
  ) {
    distanceKm =
      Math.round(haversineKm(userLat, userLng, latitude, longitude) * 100) /
      100;
  }
  return {
    id: `osm:${String(element.type ?? "node")}:${String(element.id ?? "")}`,
    name: elementName(tags),
    officeType: "UNKNOWN",
    family: "ELECTION_COMMISSION",
    address: tags["addr:full"] ?? tags.address ?? undefined,
    phone: tags.phone ?? undefined,
    officialUrl: tags.website ?? tags.official_url ?? undefined,
    latitude,
    longitude,
    source: "OpenStreetMap",
    matchedArea: undefined,
    distanceKm,
  };
}

function isElectionOffice(element: Record<string, unknown>): boolean {
  const tags = (element.tags ?? {}) as Record<string, string>;
  return classifyEcRecord(tags) === "include";
}

const electionCommissionOsmProvider: OfficeProvider = {
  providerId: ELECTION_COMMISSION_OSM_PROVIDER_ID,
  family: "ELECTION_COMMISSION",
  supportedModes: ["gps", "area"],
  async findNearby(params) {
    if (
      typeof params.lat !== "number" ||
      typeof params.lng !== "number" ||
      !Number.isFinite(params.lat) ||
      !Number.isFinite(params.lng) ||
      params.lat < -90 ||
      params.lat > 90 ||
      params.lng < -180 ||
      params.lng > 180
    ) {
      return [];
    }
    const radiusKm =
      typeof params.radiusKm === "number" && Number.isFinite(params.radiusKm)
        ? params.radiusKm
        : 50;
    const elements = await fetchOverpassElements(
      buildGpsQuery(params.lat, params.lng, radiusKm),
    );
    return elements
      .filter(isElectionOffice)
      .map((element) => normalizeElement(element, params.lat, params.lng));
  },
  async findByArea(params) {
    if (!params.district) {
      throw new AppError(400, "District is required.");
    }
    const elements = await fetchOverpassElements(buildAreaQuery());
    const matched = elements.filter((element) => {
      if (!isElectionOffice(element)) return false;
      const tags = (element.tags ?? {}) as Record<string, string>;
      const searchable = [
        tags.name,
        tags["name:en"],
        tags["name:bn"],
        tags["addr:full"],
        tags.address,
        tags.district,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const districtMatch = searchable.includes(
        String(params.district).toLowerCase(),
      );
      const upazilaMatch = params.upazila
        ? searchable.includes(String(params.upazila).toLowerCase())
        : true;
      return districtMatch && upazilaMatch;
    });
    return matched.map((element) => {
      const office = normalizeElement(element);
      office.matchedArea = {
        district: params.district,
        upazila: params.upazila,
        mode: "area",
      };
      return office;
    });
  },
};

// Register with the shared provider registry (stable provider identity).
officeProviderRegistry.register(electionCommissionOsmProvider);

export { electionCommissionOsmProvider };
export default electionCommissionOsmProvider;
