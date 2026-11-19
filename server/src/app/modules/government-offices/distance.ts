const EARTH_RADIUS_KM = 6371;

/**
 * Geographical boundary coordinates for Bangladesh.
 * - South: ~20.57° N (St. Martin's Island / Bay of Bengal)
 * - North: ~26.63° N (Tetulia, Panchagarh)
 * - West:  ~88.01° E (Shibganj, Chapai Nawabganj)
 * - East:  ~92.68° E (Bandarban / Myanmar border)
 */
export const BANGLADESH_BOUNDS = {
  minLat: 20.5,
  maxLat: 26.7,
  minLng: 88.0,
  maxLng: 92.7,
} as const;

export function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/**
 * Checks whether the given coordinates fall strictly within the territory of Bangladesh.
 * Accounts for Bangladesh's geographical contours (e.g. western border with West Bengal).
 */
export function isWithinBangladesh(lat: number, lng: number): boolean {
  if (!isValidCoordinate(lat, lng)) return false;

  // General rectangular bounds of Bangladesh
  if (
    lat < BANGLADESH_BOUNDS.minLat ||
    lat > BANGLADESH_BOUNDS.maxLat ||
    lng < BANGLADESH_BOUNDS.minLng ||
    lng > BANGLADESH_BOUNDS.maxLng
  ) {
    return false;
  }

  // Refined regional borders to reject bordering areas outside Bangladesh:
  // 1. South-West border (Khulna/Satkhira/Sundarbans):
  // At latitude <= 23.3° N, Bangladesh's western border is at ~88.85° E.
  // Locations west of 88.85° E at this latitude (such as Kolkata at 22.57° N, 88.36° E) are in India.
  if (lat <= 23.3 && lng < 88.85) {
    return false;
  }

  // 2. Mid-West border (Meherpur/Chuadanga):
  // At 23.3° < lat <= 24.0°, western border is at ~88.55° E.
  if (lat > 23.3 && lat <= 24.0 && lng < 88.55) {
    return false;
  }

  // 3. North-East border (Meghalaya border north of Sylhet/Mymensingh):
  // North of 25.3° N, Bangladesh's eastern territory ends west of 92.5° E.
  if (lat > 25.3 && lng > 92.5) {
    return false;
  }

  return true;
}

export function isValidBangladeshCoordinate(lat: number, lng: number): boolean {
  return isWithinBangladesh(lat, lng);
}

export function haversineDistanceKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): number {
  const latDelta = ((to.lat - from.lat) * Math.PI) / 180;
  const lngDelta = ((to.lng - from.lng) * Math.PI) / 180;
  const fromLat = (from.lat * Math.PI) / 180;
  const toLat = (to.lat * Math.PI) / 180;

  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lngDelta / 2) ** 2;

  return (
    2 *
    EARTH_RADIUS_KM *
    Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)))
  );
}
