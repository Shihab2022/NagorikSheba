import config from "../../../config";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

export type ValhallaRouteResult = { distanceKm: number | null };

const cache = new Map<string, { expires: number; distanceKm: number }>();
const inFlight = new Map<string, Promise<number | null>>();
const lastFailureAt = new Map<string, number>();
const failureCooldownMs = 30000;
const cacheTtlMs = Number(config.valhalla.cache_ttl_ms);
const minIntervalMs = Number(config.valhalla.min_request_interval_ms);
const timeoutMs = Number(config.valhalla.request_timeout_ms);
let lastRequestAt = 0;

function cacheKey(origin: { lat: number; lng: number }, dest: { lat: number; lng: number }) {
  return `${origin.lat.toFixed(4)},${origin.lng.toFixed(4)}->${dest.lat.toFixed(4)},${dest.lng.toFixed(4)}:auto_shorter`;
}

export async function getValhallaDrivingDistanceKm(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }): Promise<number | null> {
  const key = cacheKey(origin, destination);
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) return cached.distanceKm;
  const failureAt = lastFailureAt.get(key);
  if (failureAt && Date.now() - failureAt < failureCooldownMs) return null;
  const existing = inFlight.get(key);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const now = Date.now();
      if (now - lastRequestAt < minIntervalMs) {
        await new Promise((r) => setTimeout(r, minIntervalMs - (now - lastRequestAt)));
      }
      lastRequestAt = Date.now();
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const baseUrl = config.valhalla.base_url;
      const clientId = config.valhalla.client_id;
      let response: Response;
      try {
        response = await fetch(`${baseUrl}/route`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Client-Id": clientId },
          body: JSON.stringify({
            locations: [{ lat: origin.lat, lon: origin.lng }, { lat: destination.lat, lon: destination.lng }],
            costing: "auto_shorter",
            units: "kilometers",
            alternates: 2,
            directions_type: "none",
            id: "nagoriksheba-nearby-office",
          }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timer);
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      const distances: number[] = [];
      const primary = json?.trip?.summary?.length;
      if (typeof primary === "number" && Number.isFinite(primary)) distances.push(primary);
      const altTrips = Array.isArray(json?.alternatives) ? json.alternatives : [];
      for (const alt of altTrips) {
        const d = alt?.trip?.summary?.length;
        if (typeof d === "number" && Number.isFinite(d)) distances.push(d);
      }
      if (distances.length === 0) {
        lastFailureAt.set(key, Date.now());
        return null;
      }
      const min = Math.min(...distances);
      cache.set(key, { expires: Date.now() + cacheTtlMs, distanceKm: min });
      return min;
    } catch {
      lastFailureAt.set(key, Date.now());
      return null;
    } finally {
      inFlight.delete(key);
    }
  })();
  inFlight.set(key, promise);
  return promise;
}