"use client";

import { ExternalLink, MapPin, Navigation, Phone, Route } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { NearbyOffice, NearbyOrigin } from "@/lib/types";
import {
  OFFICE_TYPE_LABELS,
  buildGoogleMapsDirectionsUrl,
} from "@/lib/nearby";
import { useTranslation } from "@/lib/i18n";

const STRINGS = {
  bn: {
    directions: "দিকনির্দেশনা নিন",
    showRoute: "ম্যাপে রুট দেখুন",
    approx: "≈ {n} কিমি (আনুমানিক)",
    straightLine: "সরলরেখায় দূরত্ব; প্রকৃত রাস্তার দূরত্ব Google Maps-এ দেখাবে।",
    noDistance: "দূরত্ব অনুমান করা যায় নি",
    areaOriginNote: "শুরুর বিন্দু: {area} (নিশ্চিত লোকেশন নয়)",
    verified: "যাচাইকৃত",
    phone: "যাচাইকৃত ফোন",
    source: "অফিসিয়াল উৎস",
    lastVerified: "সর্বশেষ যাচাই",
    noDirections: "দিকনির্দেশনা দেওয়া যায়নি — অফিসের সঠিক স্থানাঙ্ক নেই।",
  },
  en: {
    directions: "Get Directions",
    showRoute: "Show route on map",
    approx: "≈ {n} km (approx.)",
    straightLine: "Straight-line distance; Google Maps shows the actual road distance.",
    noDistance: "Distance unavailable",
    areaOriginNote: "Starting point: {area} (not a verified live location)",
    verified: "Verified",
    phone: "Verified phone",
    source: "Official source",
    lastVerified: "Last verified",
    noDirections: "Directions unavailable — this office has no verified coordinates.",
  },
};

/**
 * One nearby-office result card. Distance shown is approximate
 * straight-line; the "Get Directions" button opens Google Maps with the
 * user's origin and this office's coordinates so Google calculates the
 * real route and travel distance. "Show route on map" draws the same trip
 * on the page's own map (GPS mode). Cards show full office details.
 */
export function NearbyOfficeCard({
  office,
  origin,
  selected,
  onShowRoute,
}: {
  office: NearbyOffice;
  origin: NearbyOrigin;
  selected?: boolean;
  onShowRoute?: () => void;
}) {
  const { t, lang } = useTranslation();
  const s = t(STRINGS);

  const typeLabel =
    OFFICE_TYPE_LABELS[office.officeType]?.[lang] ?? office.officeType;

  const originForDirections =
    origin.mode === "gps"
      ? { lat: origin.lat, lng: origin.lng }
      : {
          area: origin.upazila
            ? `${origin.upazila}, ${origin.district}, Bangladesh`
            : `${origin.district}, Bangladesh`,
        };
  const directionsUrl = buildGoogleMapsDirectionsUrl(originForDirections, {
    lat: office.latitude,
    lng: office.longitude,
  });

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border bg-white p-5 shadow-card ${
        selected ? "border-brand-400 ring-2 ring-brand-100" : "border-line"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Badge tone="soft-green">{typeLabel}</Badge>
          <h3 className="mt-2 text-base font-bold leading-6 text-slate-900">
            {office.name}
          </h3>
        </div>
        {office.distanceKm != null ? (
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-extrabold text-brand-700 ring-1 ring-brand-100"
            title={s.straightLine}
          >
            {s.approx.replace("{n}", office.distanceKm.toFixed(1))}
          </span>
        ) : (
          <span className="shrink-0 rounded-lg bg-canvas px-2.5 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-line">
            {s.noDistance}
          </span>
        )}
      </div>

      <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-600">
        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-flag-500" aria-hidden="true" />
        <span>
          {office.address}
          <span className="block text-xs text-slate-400">
            {office.division ? `${office.division}, ` : ""}
          {[office.upazila, office.district].filter(Boolean).join(", ")}
          </span>
        </span>
      </p>

      {office.phone ? (
        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
          <Phone className="h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden="true" />
          <a href={`tel:${office.phone}`} className="hover:text-brand-700">
            {office.phone}
          </a>
        </p>
      ) : null}

      <div className="mt-auto space-y-2 border-t border-line pt-3 text-xs text-slate-500">
        {office.officialUrl ? (
          <p className="flex items-center gap-1.5">
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden="true" />
            <a
              href={office.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate font-semibold text-brand-700 hover:underline"
            >
              {s.source}
            </a>
          </p>
        ) : null}
        {office.lastVerifiedAt ? (
          <p>
            {s.lastVerified}: {office.lastVerifiedAt}
          </p>
        ) : null}
      </div>

      <div className="mt-3 space-y-2">
        {origin.mode === "gps" && onShowRoute ? (
          <Button
            variant={selected ? "primary" : "outline"}
            size="sm"
            block
            onClick={onShowRoute}
          >
            <Route className="h-4 w-4" aria-hidden="true" />
            {s.showRoute}
          </Button>
        ) : null}
        {directionsUrl ? (
          <>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white transition-colors hover:bg-brand-700"
            >
              <Navigation className="h-4 w-4" aria-hidden="true" />
              {s.directions}
            </a>
            {office.distanceKm != null ? (
              <p className="mt-1.5 text-[11px] leading-4 text-slate-400">
                {s.straightLine}
              </p>
            ) : origin.mode === "area" ? (
              <p className="mt-1.5 text-[11px] leading-4 text-slate-400">
                {s.areaOriginNote.replace(
                  "{area}",
                  origin.upazila
                    ? `${origin.upazila}, ${origin.district}`
                    : origin.district,
                )}
              </p>
            ) : null}
          </>
        ) : (
          <Button variant="outline" size="sm" block disabled>
            <Navigation className="h-4 w-4" aria-hidden="true" />
            {s.noDirections}
          </Button>
        )}
      </div>
    </article>
  );
}

export default NearbyOfficeCard;
