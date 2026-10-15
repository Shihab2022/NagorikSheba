"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Loader2,
  LocateFixed,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { EmptyState, ErrorState, SkeletonCard } from "@/components/ui/States";
import { NearbyOfficeCard } from "@/components/nearby/NearbyOfficeCard";
import { NearbyMap } from "@/components/nearby/NearbyMap";
import {
  GeolocationError,
  OFFICE_SERVICE_LABELS,
  RADIUS_OPTIONS_KM,
  requestBrowserPosition,
} from "@/lib/nearby";
import { getNearbyOffices, getOfficesByArea } from "@/service/offices";
import type { NearbyOffice, NearbyOrigin, OfficeServiceKey } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

const STRINGS = {
  bn: {
    locating: "অফিস খোঁজা হচ্ছে…",
    yourLocation: "আপনার অবস্থান",
    gpsNote: "GPS দিয়ে নির্ধারিত আপনার বর্তমান অবস্থান",
    areaNote: "আপনার নির্বাচিত এলাকা — এটি আপনার যাচাইকৃত লাইভ লোকেশন নয়",
    findAgain: "আবার লোকেশন নিন",
    finding: "লোকেশন নেওয়া হচ্ছে…",
    radiusLabel: "অনুসন্ধানের পরিসর",
    resultsCount: "{n} টি অফিস পাওয়া গেছে",
    noResults: "এই পরিসরে কোনো অফিস পাওয়া যায়নি",
    noResultsHint:
      "পরিসর বাড়িয়ে দেখুন বা অন্য এলাকা নির্বাচন করুন। অফিসের তথ্য কেবল যাচাইকৃত উৎস থেকে যুক্ত হয়।",
    errorTitle: "অফিসের তথ্য আনা যায়নি",
    errorHint: "সার্ভারে সমস্যা হতে পারে। একটু পরে আবার চেষ্টা করুন।",
    locErrDenied: "লোকেশনের অনুমতি দেওয়া হয়নি — আগের ফলাফল দেখানো হচ্ছে।",
    locErrOther: "লোকেশন আপডেট করা যায়নি — আগের ফলাফল দেখানো হচ্ছে।",
    straightLineDisclaimer:
      "দূরত্ব আনুমানিক সরলরেখা। প্রকৃত রাস্তার দূরত্ব ও সময় Google Maps-এ দেখুন।",
  },
  en: {
    locating: "Searching for offices…",
    yourLocation: "Your location",
    gpsNote: "Your current location (from GPS)",
    areaNote: "Your selected area — this is not your verified live location",
    findAgain: "Find My Location Again",
    finding: "Getting location…",
    radiusLabel: "Search radius",
    resultsCount: "{n} offices found",
    noResults: "No offices found within this radius",
    noResultsHint:
      "Try a larger radius or choose a different area. Office data is only added from verified official sources.",
    errorTitle: "Could not load office data",
    errorHint: "There may be a server problem. Please try again shortly.",
    locErrDenied: "Location permission was denied — showing previous results.",
    locErrOther: "Could not update location — showing previous results.",
    straightLineDisclaimer:
      "Distances are approximate straight-line values. See actual road distance and travel time on Google Maps.",
  },
};

/**
 * Main body of the nearby-offices page: fetches offices for the chosen
 * service from the backend (GPS or manual-area mode), shows skeletons
 * while loading, and handles empty/error/refresh states. Coordinates come
 * from the page URL (refresh-safe) — they are never stored server-side.
 */
export function NearbyOfficesView({
  slug,
  service,
  origin,
  radiusKm,
}: {
  slug: string;
  service: OfficeServiceKey;
  origin: NearbyOrigin;
  radiusKm: number;
}) {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const router = useRouter();

  const [offices, setOffices] = useState<NearbyOffice[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

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

  const handleRadiusChange = useCallback(
    (value: number) => {
      if (origin.mode !== "gps") return;
      const params = new URLSearchParams({
        lat: origin.lat.toFixed(5),
        lng: origin.lng.toFixed(5),
        radius: String(value),
      });
      router.replace(`/services/${slug}/nearby-offices?${params.toString()}`, {
        scroll: false,
      });
    },
    [origin, router, slug],
  );

  const handleFindAgain = useCallback(async () => {
    if (locating) return;
    setLocating(true);
    setLocError(null);
    try {
      const { lat, lng } = await requestBrowserPosition();
      const params = new URLSearchParams({
        lat: lat.toFixed(5),
        lng: lng.toFixed(5),
        radius: String(radiusKm),
      });
      router.replace(`/services/${slug}/nearby-offices?${params.toString()}`, {
        scroll: false,
      });
    } catch (err) {
      setLocError(
        err instanceof GeolocationError && err.reason === "permission-denied"
          ? s.locErrDenied
          : s.locErrOther,
      );
    } finally {
      setLocating(false);
    }
  }, [locating, radiusKm, router, s.locErrDenied, s.locErrOther, slug]);

  const countLabel = s.resultsCount.replace("{n}", String(offices.length));
  const serviceLabel = OFFICE_SERVICE_LABELS[service];

  return (
    <div className="space-y-6">
      {/* Location summary + controls */}
      <section
        aria-label={s.yourLocation}
        className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-5"
      >
        <div className="min-w-0">
          <Badge tone="soft-green">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {serviceLabel?.bn} / {serviceLabel?.en}
          </Badge>
          <p className="mt-2 text-sm font-semibold text-slate-800">
            {origin.mode === "gps"
              ? `${s.yourLocation}: ${origin.lat.toFixed(4)}, ${origin.lng.toFixed(4)}`
              : `${s.yourLocation}: ${origin.upazila ? `${origin.upazila}, ` : ""}${origin.district}`}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {origin.mode === "gps" ? s.gpsNote : s.areaNote}
          </p>
        </div>

        {origin.mode === "gps" ? (
          <div className="flex flex-wrap items-center gap-2.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              {s.radiusLabel}
              <Select
                aria-label={s.radiusLabel}
                className="h-9 w-28 text-xs"
                value={String(radiusKm)}
                onChange={(e) => handleRadiusChange(Number(e.target.value))}
              >
                {RADIUS_OPTIONS_KM.map((km) => (
                  <option key={km} value={km}>
                    {km} km
                  </option>
                ))}
              </Select>
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFindAgain}
              disabled={locating}
              aria-busy={locating}
              icon={
                locating ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <LocateFixed className="h-4 w-4" aria-hidden="true" />
                )
              }
            >
              {locating ? s.finding : s.findAgain}
            </Button>
          </div>
        ) : null}
      </section>

      {locError ? (
        <p
          role="alert"
          className="rounded-xl border border-flag-200 bg-flag-50 px-4 py-3 text-sm text-flag-700"
        >
          {locError}
        </p>
      ) : null}

      {/* Results */}
      {loading ? (
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-busy="true"
          aria-live="polite"
        >
          <span className="sr-only">{s.locating}</span>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : failed ? (
        <ErrorState
          title={s.errorTitle}
          description={s.errorHint}
          onRetry={load}
        />
      ) : offices.length === 0 ? (
        <EmptyState
          title={s.noResults}
          description={s.noResultsHint}
          icon={<Building2 className="h-7 w-7" aria-hidden="true" />}
        />
      ) : (
        <>
          <p className="text-sm font-semibold text-slate-600" aria-live="polite">
            {countLabel}
          </p>
          <NearbyMap origin={origin} offices={offices} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offices.map((office) => (
              <NearbyOfficeCard key={office.id} office={office} origin={origin} />
            ))}
          </div>
          <p className="rounded-xl border border-dashed border-line bg-canvas px-4 py-3 text-xs leading-5 text-slate-500">
            {s.straightLineDisclaimer}
          </p>
        </>
      )}
    </div>
  );
}

export default NearbyOfficesView;

