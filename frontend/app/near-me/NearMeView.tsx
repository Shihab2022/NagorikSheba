"use client";

import { useMemo, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n";
import {
  buildGoogleMapsDirectionsUrl,
} from "@/lib/nearby";

const STRINGS = {
  bn: {
    title: "CHAPAI NABABGANJ SADAR Upazila Election Office",
    subtitle: "CHAPAI NABABGANJ, Bangladesh",
    hint: "নিচে Google Maps-এ এই লোকেশনটি সরাসরি দেখানো হচ্ছে — কোনো API key লাগে না।",
    openInGoogleMaps: "Google Maps-এ খুলুন",
    customLabel: "অন্য ঠিকানা দেখুন",
    customPlaceholder: "যেমন: Rajshahi District Election Office, Bangladesh",
    show: "ম্যাপে দেখান",
    directions: "দিকনির্দেশনা",
  },
  en: {
    title: "CHAPAI NABABGANJ SADAR Upazila Election Office",
    subtitle: "CHAPAI NABABGANJ, Bangladesh",
    hint: "This location is shown live below via Google Maps — no API key needed.",
    openInGoogleMaps: "Open in Google Maps",
    customLabel: "Show another address",
    customPlaceholder: "e.g. Rajshahi District Election Office, Bangladesh",
    show: "Show on map",
    directions: "Directions",
  },
};

const DEFAULT_QUERY =
  "CHAPAI NABABGANJ SADAR Upazila Election Office, CHAPAI NABABGANJ, Bangladesh";

/**
 * Standalone "Near Me" map — always renders (never 404s). Shows the
 * requested Chapai Nababganj office via the no-key Google Maps embed
 * (`maps.google.com/maps?q=...&output=embed`) plus an "Open in Maps" link.
 */
export function NearMeView() {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const [custom, setCustom] = useState("");
  const [query, setQuery] = useState(DEFAULT_QUERY);

  const mapSearchQuery = useMemo(() => encodeURIComponent(query), [query]);
  const iframeSrc = `https://maps.google.com/maps?q=${mapSearchQuery}&output=embed`;
  const openUrl = useMemo(
    () =>
      `https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`,
    [mapSearchQuery],
  );
  // Directions (no API key): generic Bangladesh origin → office query.
  // Keeping the same q-based approach so it never 404s when coords are unknown.
  const directionsUrl =
    buildGoogleMapsDirectionsUrl(
      { area: "Bangladesh" },
      { lat: 24.5964, lng: 88.2711 },
    ) ?? openUrl;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5">
        <p className="flex items-start gap-2 text-base font-extrabold text-slate-900">
          <MapPin
            className="mt-0.5 h-5 w-5 shrink-0 text-flag-500"
            aria-hidden="true"
          />
          <span>
            {s.title}
            <span className="block text-sm font-semibold text-slate-500">
              {s.subtitle}
            </span>
          </span>
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-500">{s.hint}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={openUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-bold text-white transition-colors hover:bg-brand-700"
          >
            <Navigation className="h-4 w-4" aria-hidden="true" />
            {s.openInGoogleMaps}
          </a>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-bold text-brand-700 transition-colors hover:border-brand-300"
          >
            {s.directions}
          </a>
        </div>
      </div>

      <figure className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <iframe
          key={query}
          title={`${s.title} — ${s.subtitle}`}
          src={iframeSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="h-[420px] w-full border-0 sm:h-[520px]"
        />
        <figcaption className="px-4 py-2.5 text-xs text-slate-500">
          {query}
        </figcaption>
      </figure>

      <form
        className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (custom.trim()) setQuery(custom.trim());
        }}
      >
        <label
          htmlFor="near-me-query"
          className="text-xs font-bold text-slate-600"
        >
          {s.customLabel}
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="near-me-query"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder={s.customPlaceholder}
            className="h-10 w-full rounded-xl border border-line bg-canvas px-3 text-sm text-slate-800 outline-none focus:border-brand-400"
          />
          <Button type="submit" size="sm" className="shrink-0">
            {s.show}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default NearMeView;
