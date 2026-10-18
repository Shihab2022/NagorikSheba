"use client";

import { useCallback, useEffect, useState } from "react";
import { getNearbyOffices, getOfficesByArea } from "@/service/offices";
import type {
  NearbyOffice,
  NearbyOrigin,
  OfficeServiceKey,
} from "@/lib/types";

/**
 * Reusable nearby-offices data hook — the single place that talks to the
 * reusable backend API (`GET /api/government-offices/nearby` for GPS,
 * `GET /api/government-offices/by-area` for manual area).
 *
 * Any page (`/services/[slug]/nearby-offices` today, new services tomorrow)
 * gets user-location search, office cards data, map markers and directions
 * origins from this one hook — no per-service fetching logic.
 */
export function useNearbyOffices(params: {
  service: OfficeServiceKey;
  origin: NearbyOrigin;
  radiusKm: number;
}) {
  const { service, origin, radiusKm } = params;
  const [offices, setOffices] = useState<NearbyOffice[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    const res =
      origin.mode === "gps"
        ? await getNearbyOffices({
            service,
            lat: origin.lat,
            lng: origin.lng,
            radiusKm,
          })
        : await getOfficesByArea({
            service,
            district: origin.district,
            upazila: origin.upazila,
          });
    if (res.success) {
      setOffices(res.data?.offices ?? []);
    } else {
      setFailed(true);
      setOffices([]);
    }
    setLoading(false);
  }, [origin, service, radiusKm]);

  useEffect(() => {
    load();
  }, [load]);

  return { offices, loading, failed, reload: load, setOffices };
}

export default useNearbyOffices;
