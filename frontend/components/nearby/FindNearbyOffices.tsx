"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AreaPickerModal } from "@/components/nearby/AreaPickerModal";
import {
  GeolocationError,
  getOfficeServiceKey,
  requestBrowserPosition,
} from "@/lib/nearby";
import { useTranslation } from "@/lib/i18n";

const STRINGS = {
  bn: {
    cta: "কাছাকাছি অফিস খুঁজুন",
    locating: "লোকেশন নেওয়া হচ্ছে…",
    why: "নিকটবর্তী সরকারি অফিস দেখাতে আপনার বর্তমান অবস্থান ব্যবহার করা হবে। আপনার সুনির্দিষ্ট লোকেশন কোথাও সংরক্ষণ করা হয় না।",
    manualLink: "লোকেশন ছাড়াই এলাকা দিয়ে খুঁজুন",
    errDenied:
      "লোকেশন ব্যবহারের অনুমতি দেওয়া হয়নি। আপনি চাইলে জেলা/উপজেলা নির্বাচন করে অফিস দেখতে পারেন।",
    errUnavailable:
      "আপনার বর্তমান লোকেশন পাওয়া যায়নি। একটু পরে আবার চেষ্টা করুন, অথবা এলাকা দিয়ে খুঁজুন।",
    errTimeout:
      "লোকেশন পেতে বেশি সময় লেগেছে। আবার চেষ্টা করুন বা এলাকা দিয়ে খুঁজুন।",
    errUnsupported:
      "এই ব্রাউজারে লোকেশন ব্যবহার করা যায় না। অনুগ্রহ করে এলাকা দিয়ে খুঁজুন।",
    errUnknown: "লোকেশন পাওয়া যায়নি। আবার চেষ্টা করুন বা এলাকা দিয়ে খুঁজুন।",
    needLocationBody:
      "নিকটবর্তী সরকারি অফিস দেখার জন্য আপনার বর্তমান লোকেশন বা নির্বাচিত এলাকা প্রয়োজন। নিচের বোতামে ক্লিক করুন।",
    invalidCoordinates:
      "এই URL-এর latitude বা longitude অসম্পূর্ণ বা ভুল। 23.8103 ও 90.4125-এর মতো দশমিক স্থানাঙ্ক ব্যবহার করুন অথবা আবার লোকেশন নিন।",
  },
  en: {
    cta: "Find Nearby Offices",
    locating: "Getting your location…",
    why: "Your current location is used only to show the nearest government offices. Your precise location is never stored.",
    manualLink: "Search by area instead",
    errDenied:
      "Location permission was denied. You can still find offices by selecting your district/upazila.",
    errUnavailable:
      "We could not determine your current location. Try again shortly, or search by area.",
    errTimeout:
      "Getting your location took too long. Try again, or search by area.",
    errUnsupported:
      "This browser does not support location access. Please search by area.",
    errUnknown: "Could not get your location. Try again or search by area.",
    needLocationBody:
      "To show nearby government offices we need your current location or a selected area. Click the button below.",
    invalidCoordinates:
      "The latitude or longitude in this URL is incomplete or invalid. Use decimal coordinates such as 23.8103 and 90.4125, or get your location again.",
  },
};

/**
 * Service-page CTA. Requests geolocation only after the user clicks the
 * button, then navigates to the nearby-offices page with coordinates in
 * the URL (refresh-safe). On any failure it falls back to manual area
 * selection — the feature is never blocked.
 */
export function FindNearbyOffices({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const router = useRouter();

  const [locating, setLocating] = useState(false);
  const [errorKey, setErrorKey] = useState<
    "permission-denied" | "position-unavailable" | "timeout" | "unsupported" | "unknown" | null
  >(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const serviceKey = getOfficeServiceKey(slug);

  const handleFind = useCallback(async () => {
    if (!serviceKey || locating) return;
    setLocating(true);
    setErrorKey(null);
    try {
      const { lat, lng } = await requestBrowserPosition();
      // Round to ~1 m precision — plenty for office lookup, and avoids
      // writing long decimals into the URL.
      const params = new URLSearchParams({
        lat: lat.toFixed(5),
        lng: lng.toFixed(5),
      });
      router.push(`/services/${slug}/nearby-offices?${params.toString()}`);
    } catch (err) {
      const reason =
        err instanceof GeolocationError ? err.reason : "unknown";
      setErrorKey(reason);
      setLocating(false);
    }
  }, [serviceKey, locating, router, slug]);

  const handleAreaSelect = useCallback(
    (area: { district: string; upazila: string | null }) => {
      setPickerOpen(false);
      const params = new URLSearchParams({ district: area.district });
      if (area.upazila) params.set("upazila", area.upazila);
      router.push(`/services/${slug}/nearby-offices?${params.toString()}`);
    },
    [router, slug],
  );

  if (!serviceKey) return null;

  const errorMessage =
    errorKey === "permission-denied"
      ? s.errDenied
      : errorKey === "position-unavailable"
        ? s.errUnavailable
        : errorKey === "timeout"
          ? s.errTimeout
          : errorKey === "unsupported"
            ? s.errUnsupported
            : errorKey === "unknown"
              ? s.errUnknown
              : null;

  return (
    <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm">
          <MapPin className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <p className="text-sm font-bold text-slate-800">{s.cta}</p>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">{s.why}</p>

      <Button
        className="mt-3"
        size="sm"
        block
        onClick={handleFind}
        disabled={locating}
        aria-busy={locating}
        icon={
          locating ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Navigation className="h-4 w-4" aria-hidden="true" />
          )
        }
      >
        {locating ? s.locating : s.cta}
      </Button>

      {errorMessage ? (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-flag-200 bg-flag-50 px-3 py-2 text-xs leading-5 text-flag-700"
        >
          {errorMessage}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => setPickerOpen(true)}
        className="mt-3 w-full text-left text-xs font-semibold text-brand-700 underline-offset-2 hover:underline"
      >
        {s.manualLink}
      </button>

      {serviceKey ? (
        <AreaPickerModal
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          service={serviceKey}
          onSelect={handleAreaSelect}
        />
      ) : null}
    </div>
  );
}

export default FindNearbyOffices;

/** Intro panel shown on the nearby page when no location/area was supplied yet. */
export function NearbyIntro({
  slug,
  invalidCoordinates = false,
}: {
  slug: string;
  invalidCoordinates?: boolean;
}) {
  const { t } = useTranslation();
  const s = t(STRINGS);
  return (
    <div className="mx-auto max-w-md">
      <p
        className={`mb-4 rounded-xl px-4 py-3 text-sm leading-6 ${
          invalidCoordinates
            ? "border border-flag-200 bg-flag-50 text-flag-700"
            : "text-slate-600"
        }`}
        role={invalidCoordinates ? "alert" : undefined}
      >
        {invalidCoordinates ? s.invalidCoordinates : s.needLocationBody}
      </p>
      <FindNearbyOffices slug={slug} />
    </div>
  );
}
