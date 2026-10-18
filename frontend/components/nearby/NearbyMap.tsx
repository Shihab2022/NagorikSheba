"use client";

import { useEffect, useRef, useState } from "react";
import type { NearbyOffice, NearbyOrigin } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

const STRINGS = {
  bn: {
    mapLabel: "নিকটবর্তী সরকারি অফিসের ম্যাপ",
    yourLocation: "আপনার অবস্থান",
    routeFrom: "আপনার অবস্থান থেকে রুট",
    routeUnavailable: "রুট আনা যায়নি — Google Maps-এ দিকনির্দেশনা দেখুন।",
    loadingRoute: "রুট লোড হচ্ছে…",
    routeSummary: "ড্রাইভিং রুট: {km} কিমি, ≈ {min} মিনিট",
    attribution: "ম্যাপ ডেটা &copy; OpenStreetMap অবদানকারী | রুট &copy; OSRM",
  },
  en: {
    mapLabel: "Map of nearby government offices",
    yourLocation: "Your location",
    routeFrom: "Route from your location",
    routeUnavailable:
      "Route unavailable — use the Directions button for Google Maps instead.",
    loadingRoute: "Loading route…",
    routeSummary: "Driving route: {km} km, ≈ {min} min",
    attribution: "Map data &copy; OpenStreetMap contributors | Routes &copy; OSRM",
  },
};

/**
 * Interactive Leaflet map (OpenStreetMap tiles — no API key required).
 * Always shows the user's GPS point when available (even with 0 offices),
 * shows every office marker with details popup, and draws the driving
 * route user → selected office via public OSRM (Google Maps button on the
 * card stays as fallback).
 */
export function NearbyMap({
  origin,
  offices,
  selectedOfficeId,
  onMarkerClick,
}: {
  origin: NearbyOrigin;
  offices: NearbyOffice[];
  selectedOfficeId?: string | null;
  onMarkerClick?: (id: string) => void;
}) {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef(onMarkerClick);
  useEffect(() => {
    selectRef.current = onMarkerClick;
  }, [onMarkerClick]);

  const [routeInfo, setRouteInfo] = useState<{
    km: string;
    min: string;
  } | null>(null);
  const [routeState, setRouteState] = useState<"idle" | "loading" | "error">(
    "idle",
  );

  const hasGpsOrigin = origin.mode === "gps";
  const mappedOffices = offices.filter(
    (o) => Number.isFinite(o.latitude) && Number.isFinite(o.longitude),
  );
  const mappedOfficeIds = mappedOffices.map((o) => o.id).join(",");
  const selectedOffice =
    mappedOffices.find((o) => o.id === selectedOfficeId) ?? null;

  const routeKey = hasGpsOrigin
    ? `${origin.mode === "gps" ? `${origin.lat},${origin.lng}` : "nogps"}->${selectedOffice?.id ?? "none"}`
    : `area->${selectedOffice?.id ?? "none"}`;

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
          .bindPopup(`<strong>${escapeHtml(s.yourLocation)}</strong>`);
      }

      for (const office of mappedOffices) {
        const latLng = L.latLng(office.latitude, office.longitude);
        bounds.push([office.latitude, office.longitude]);
        const isSelected = office.id === selectedOffice?.id;
        const marker = L.circleMarker(latLng, {
          radius: isSelected ? 11 : 8,
          color: "#ffffff",
          weight: 3,
          fillColor: isSelected ? "#006a4e" : "#f42a41",
          fillOpacity: 1,
        }).addTo(map);
        marker.bindPopup(
          `<strong>${escapeHtml(office.name)}</strong><br/>${escapeHtml(office.address)}<br/>` +
            `<small>${escapeHtml(
              [office.upazila, office.district].filter(Boolean).join(", "),
            )}` +
            (office.distanceKm != null ? ` · ≈ ${office.distanceKm} km` : "") +
            `</small>`,
        );
        marker.on("click", () => selectRef.current?.(office.id));
        if (isSelected) marker.openPopup();
      }

      // In-app driving route user → selected office (GPS mode only, OSRM).
      let routed = false;
      if (
        hasGpsOrigin &&
        origin.mode === "gps" &&
        selectedOffice &&
        Number.isFinite(selectedOffice.latitude) &&
        Number.isFinite(selectedOffice.longitude)
      ) {
        setRouteState("loading");
        setRouteInfo(null);
        try {
          const url =
            `https://router.project-osrm.org/route/v1/driving/` +
            `${origin.lng},${origin.lat};${selectedOffice.longitude},${selectedOffice.latitude}` +
            `?overview=full&geometries=geojson`;
          const res = await fetch(url);
          const json = await res.json().catch(() => null);
          const route = json?.routes?.[0];
          const coords: [number, number][] | undefined =
            route?.geometry?.coordinates?.map(
              (pt: [number, number]) => [pt[1], pt[0]] as [number, number],
            );
          if (cancelled) return;
          if (coords && coords.length > 1) {
            L.polyline(coords, {
              color: "#006a4e",
              weight: 5,
              opacity: 0.85,
            })
              .addTo(map)
              .bindPopup(escapeHtml(s.routeFrom));
            bounds.push(...coords.filter((_, i) => i % 10 === 0));
            map.fitBounds(L.latLngBounds(bounds), {
              padding: [36, 36],
              maxZoom: 14,
            });
            routed = true;
            setRouteInfo({
              km: ((route.distance ?? 0) / 1000).toFixed(1),
              min: Math.max(
                1,
                Math.round((route.duration ?? 0) / 60),
              ).toString(),
            });
            setRouteState("idle");
          } else {
            setRouteState("error");
          }
        } catch {
          if (!cancelled) setRouteState("error");
        }
      } else {
        setRouteState("idle");
        setRouteInfo(null);
      }

      if (!routed) {
        if (bounds.length === 1) {
          map.setView(bounds[0], 13);
        } else if (bounds.length > 1) {
          map.fitBounds(L.latLngBounds(bounds), {
            padding: [36, 36],
            maxZoom: 14,
          });
        } else {
          map.setView([23.685, 90.3563], 7); // Bangladesh fallback
        }
      }
    })();

    return () => {
      cancelled = true;
      map?.remove();
      map = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasGpsOrigin,
    origin,
    mappedOfficeIds,
    s.attribution,
    s.yourLocation,
    s.routeFrom,
    routeKey,
  ]);

  if (!hasGpsOrigin && mappedOffices.length === 0) return null;

  return (
    <div className="space-y-2">
      <div
        id="nearby-map"
        ref={containerRef}
        role="region"
        aria-label={s.mapLabel}
        className="h-72 w-full overflow-hidden rounded-2xl border border-line sm:h-96 [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full"
      />
      {routeState === "loading" ? (
        <p className="text-xs font-semibold text-slate-500" aria-live="polite">
          {s.loadingRoute}
        </p>
      ) : null}
      {routeState === "error" ? (
        <p
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs leading-5 text-amber-800"
          role="alert"
        >
          {s.routeUnavailable}
        </p>
      ) : null}
      {routeInfo && selectedOffice ? (
        <p
          className="rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-2 text-xs font-semibold text-brand-800"
          aria-live="polite"
        >
          {s.routeSummary
            .replace("{km}", routeInfo.km)
            .replace("{min}", routeInfo.min)}{" "}
          — {selectedOffice.name}
        </p>
      ) : null}
    </div>
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default NearbyMap;
