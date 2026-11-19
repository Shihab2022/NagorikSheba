import type { OfficeServiceKey } from "@/lib/types";

/**
 * Helpers for the "Nearby Government Offices" feature.
 *
 * - Maps service page slugs to the office-service keys understood by the
 *   backend (`/api/government-offices/*`).
 * - Wraps the browser Geolocation API in a promise with a timeout.
 * - Builds validated Google Maps Directions URLs (no API key required).
 */

/**
 * Which service-page slugs have a nearby-office lookup, and which office
 * service key the backend expects for them. Only services with a verified
 * office network are listed — the backend never guesses availability.
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

export function getOfficeServiceKey(slug: string): OfficeServiceKey | null {
  return SERVICE_KEY_BY_SLUG[slug] ?? null;
}

/**
 * Geographical boundary coordinates for Bangladesh.
 * NagorikSheba strictly restricts location operations to Bangladesh.
 */
export const BANGLADESH_BOUNDS = {
  minLat: 20.5,
  maxLat: 26.7,
  minLng: 88.0,
  maxLng: 92.7,
} as const;

/** Default and selectable search radii (km) for the nearby lookup. */
export const RADIUS_OPTIONS_KM = [10, 25, 50, 100] as const;
export const DEFAULT_RADIUS_KM = 50;

/** Valid numeric coordinates (WGS84 degrees). */
export function isValidCoordinate(lat: unknown, lng: unknown): boolean {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/** Strictly checks that coordinates fall within Bangladesh territory. */
export function isWithinBangladesh(lat: unknown, lng: unknown): boolean {
  if (!isValidCoordinate(lat, lng)) return false;
  const latitude = lat as number;
  const longitude = lng as number;

  if (
    latitude < BANGLADESH_BOUNDS.minLat ||
    latitude > BANGLADESH_BOUNDS.maxLat ||
    longitude < BANGLADESH_BOUNDS.minLng ||
    longitude > BANGLADESH_BOUNDS.maxLng
  ) {
    return false;
  }

  // Refined regional borders to reject bordering areas outside Bangladesh:
  // South-West border: At latitude <= 23.3° N, western border is at ~88.85° E.
  if (latitude <= 23.3 && longitude < 88.85) {
    return false;
  }

  // Mid-West border: At 23.3° < latitude <= 24.0°, western border is at ~88.55° E.
  if (latitude > 23.3 && latitude <= 24.0 && longitude < 88.55) {
    return false;
  }

  // North-East border: North of 25.3° N, Bangladesh territory ends west of 92.5° E.
  if (latitude > 25.3 && longitude > 92.5) {
    return false;
  }

  return true;
}

export function parseCoordinateQuery(
  value: unknown,
  min: number,
  max: number,
): number | null {
  if (
    typeof value !== "string" ||
    !/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(value)
  ) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max
    ? parsed
    : null;
}

/** Geolocation error codes from the browser Geolocation API. */
export type GeolocationFailure =
  | "permission-denied"
  | "position-unavailable"
  | "timeout"
  | "unsupported"
  | "outside-bangladesh"
  | "unknown";

export class GeolocationError extends Error {
  reason: GeolocationFailure;
  constructor(reason: GeolocationFailure, message: string) {
    super(message);
    this.name = "GeolocationError";
    this.reason = reason;
  }
}

/**
 * Request the user's current position once. Only call this after an
 * explicit user gesture (button click) — never on page load.
 * Strictly verifies that the location is inside Bangladesh.
 */
export function requestBrowserPosition(
  timeoutMs = 12_000,
): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(
        new GeolocationError(
          "unsupported",
          "Geolocation is not supported by this browser.",
        ),
      );
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (!isValidCoordinate(latitude, longitude)) {
          reject(
            new GeolocationError(
              "position-unavailable",
              "The device returned an invalid location.",
            ),
          );
        } else if (!isWithinBangladesh(latitude, longitude)) {
          reject(
            new GeolocationError(
              "outside-bangladesh",
              "Your location was detected outside Bangladesh. NagorikSheba only provides services for locations within Bangladesh.",
            ),
          );
        } else {
          resolve({ lat: latitude, lng: longitude });
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(
              new GeolocationError(
                "permission-denied",
                "Location permission was denied.",
              ),
            );
            break;
          case error.POSITION_UNAVAILABLE:
            reject(
              new GeolocationError(
                "position-unavailable",
                "Your current location could not be determined.",
              ),
            );
            break;
          case error.TIMEOUT:
            reject(
              new GeolocationError(
                "timeout",
                "The location request timed out.",
              ),
            );
            break;
          default:
            reject(
              new GeolocationError("unknown", "Could not get your location."),
            );
        }
      },
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 60_000 },
    );
  });
}

/**
 * Build a Google Maps Directions URL (driving mode) from an origin to a
 * destination. Coordinates are validated and encoded; the route itself is
 * calculated by Google Maps, not by this app.
 *
 * Origin is either precise coordinates or a human-readable area string
 * (when the user manually selected a district/upazila instead of sharing
 * GPS). Returns null when the destination is invalid.
 */
export function buildGoogleMapsDirectionsUrl(
  origin: { lat: number; lng: number } | { area: string },
  destination: { lat: number; lng: number },
): string | null {
  if (!isValidCoordinate(destination.lat, destination.lng)) return null;

  const originParam =
    "area" in origin
      ? origin.area.trim()
      : isValidCoordinate(origin.lat, origin.lng)
        ? `${origin.lat.toFixed(6)},${origin.lng.toFixed(6)}`
        : "";
  if (!originParam) return null;

  const destinationParam = `${destination.lat.toFixed(6)},${destination.lng.toFixed(6)}`;

  const params = new URLSearchParams({
    api: "1",
    origin: originParam,
    destination: destinationParam,
    travelmode: "driving",
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

/**
 * Build a no-API-key Google Maps embed URL for an address query.
 *
 * Uses `https://maps.google.com/maps?q=...&output=embed`, which needs no
 * API key and works in a plain <iframe>. The query is URI-encoded so
 * office names with commas/spaces embed correctly, e.g.:
 * `CHAPAI NABABGANJ SADAR Upazila Election Office, CHAPAI NABABGANJ, Bangladesh`.
 *
 * Returns null when the query is empty.
 */
export function buildGoogleMapsEmbedUrl(query: string): string | null {
  const q = query.trim();
  if (!q) return null;
  const mapSearchQuery = encodeURIComponent(q);
  return `https://maps.google.com/maps?q=${mapSearchQuery}&output=embed`;
}

/**
 * Build the human-readable map query for an office — name + address +
 * upazila/district + Bangladesh — so the Google embed pins the right place.
 */
export function buildOfficeMapQuery(office: {
  name: string;
  address: string;
  upazila?: string | null;
  district?: string | null;
}): string {
  return [office.name, office.address, office.upazila, office.district, "Bangladesh"]
    .map((part) => (part ?? "").trim())
    .filter(Boolean)
    .join(", ");
}

/** Bilingual display labels for backend office-type enums. */
export const OFFICE_TYPE_LABELS: Record<string, { bn: string; en: string }> = {
  ELECTION_COMMISSION: { bn: "নির্বাচন কমিশন", en: "Election Commission" },
  PASSPORT_OFFICE: { bn: "পাসপোর্ট অফিস", en: "Passport Office" },
  REGISTRAR_GENERAL: { bn: "জন্ম নিবন্ধন কর্তৃপক্ষ", en: "Registrar General" },
  UNION_PARISHAD: { bn: "ইউনিয়ন পরিষদ", en: "Union Parishad" },
  MUNICIPALITY: { bn: "পৌরসভা", en: "Municipality" },
  CITY_CORPORATION: { bn: "সিটি কর্পোরেশন", en: "City Corporation" },
  BRTA_OFFICE: { bn: "বিআরটিএ অফিস", en: "BRTA Office" },
  GOVERNMENT_HOSPITAL: { bn: "সরকারি হাসপাতাল", en: "Government Hospital" },
  LAND_OFFICE: { bn: "ভূমি অফিস (নামজারি)", en: "AC Land Office" },
};

/** Bilingual display labels for office service keys. */
export const OFFICE_SERVICE_LABELS: Record<
  OfficeServiceKey,
  { bn: string; en: string }
> = {
  NID: { bn: "জাতীয় পরিচয়পত্র (NID)", en: "National ID (NID)" },
  PASSPORT: { bn: "পাসপোর্ট", en: "Passport" },
  BIRTH_REGISTRATION: { bn: "জন্ম নিবন্ধন", en: "Birth Registration" },
  DRIVING_LICENCE: { bn: "ড্রাইভিং লাইসেন্স", en: "Driving Licence" },
  HOSPITAL: { bn: "সরকারি হাসপাতাল", en: "Government Hospital" },
  LAND: { bn: "ভূমি সেবা (নামজারি)", en: "Land Office" },
  ALL: { bn: "সকল সরকারি অফিস", en: "All Government Offices" },
};
