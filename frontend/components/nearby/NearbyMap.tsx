"use client";

import { useEffect, useRef } from "react";
import type { NearbyOffice, NearbyOrigin } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

const STRINGS = {
  bn: {
    mapLabel: "নিকটবর্তী সরকারি অফিসের ম্যাপ",
    yourLocation: "আপনার অবস্থান",
    attribution: "ম্যাপ ডেটা &copy; OpenStreetMap অবদানকারী",
  },
  en: {
    mapLabel: "Map of nearby government offices",
    yourLocation: "Your location",
    attribution: "Map data &copy; OpenStreetMap contributors",
  },
};

/**
 * Interactive Leaflet map (OpenStreetMap tiles — no API key required).
 * Rendered client-side only; hidden entirely when leaflet cannot load or
 * there is nothing to show.
 */
export function NearbyMap({
  origin,
  offices,
}: {
  origin: NearbyOrigin;
  offices: NearbyOffice[];
}) {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasGpsOrigin = origin.mode === "gps";
  const mappedOffices = offices.filter(
    (o) => Number.isFinite(o.latitude) && Number.isFinite(o.longitude),
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!hasGpsOrigin && mappedOffices.length === 0) return;

    let map: import("leaflet").Map | null = null;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      // Leaflet needs its CSS; inject once per page.
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      map = L.map(container, {
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: s.attribution,
      }).addTo(map);

      const bounds: [number, number][] = [];

      if (hasGpsOrigin && origin.mode === "gps") {
        const userLatLng = L.latLng(origin.lat, origin.lng);
        bounds.push([origin.lat, origin.lng]);
        L.circleMarker(userLatLng, {
          radius: 9,
          color: "#ffffff",
          weight: 3,
          fillColor: "#006a4e",
          fillOpacity: 1,
        })
          .addTo(map)
          .bindPopup(s.yourLocation);
      }

      for (const office of mappedOffices) {
        const latLng = L.latLng(office.latitude, office.longitude);
        bounds.push([office.latitude, office.longitude]);
        L.circleMarker(latLng, {
          radius: 8,
          color: "#ffffff",
          weight: 3,
          fillColor: "#f42a41",
          fillOpacity: 1,
        })
          .addTo(map)
          .bindPopup(`<strong>${office.name}</strong><br/>${office.address}`);
      }

      if (bounds.length === 1) {
        map.setView(bounds[0], 13);
      } else if (bounds.length > 1) {
        map.fitBounds(L.latLngBounds(bounds), { padding: [36, 36], maxZoom: 14 });
      } else {
        map.setView([23.685, 90.3563], 7); // Bangladesh fallback
      }
    })();

    return () => {
      cancelled = true;
      map?.remove();
      map = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasGpsOrigin, origin, mappedOffices.map((o) => o.id).join(","), s.attribution, s.yourLocation]);

  if (!hasGpsOrigin && mappedOffices.length === 0) return null;

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={s.mapLabel}
      className="h-72 w-full overflow-hidden rounded-2xl border border-line sm:h-96 [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full"
    />
  );
}

export default NearbyMap;
