"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigation } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Select } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/States";
import { getOfficeAreas } from "@/service/offices";
import type { OfficeArea, OfficeServiceKey } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

const STRINGS = {
  bn: {
    title: "এলাকা নির্বাচন করুন",
    intro:
      "লোকেশন শেয়ার না করে জেলা ও উপজেলা নির্বাচন করে অফিস দেখুন। দূরত্ব অনুমান করা যাবে না, তবে সব অফিস দেখা যাবে।",
    district: "জেলা",
    upazila: "উপজেলা (ঐচ্ছিক)",
    allUpazilas: "সব উপজেলা",
    selectDistrict: "জেলা নির্বাচন করুন",
    showOffices: "অফিস দেখুন",
    loading: "এলাকার তালিকা লোড হচ্ছে…",
    loadError: "এলাকার তালিকা লোড করা যায়নি। আবার চেষ্টা করুন।",
    retry: "আবার চেষ্টা করুন",
    noAreas: "এই সেবার জন্য এখনো কোনো যাচাইকৃত সরকারি অফিস যুক্ত হয়নি।",
  },
  en: {
    title: "Select your area",
    intro:
      "Browse offices by choosing your district and upazila instead of sharing your location. Distance cannot be estimated, but all listed offices will be shown.",
    district: "District",
    upazila: "Upazila (optional)",
    allUpazilas: "All upazilas",
    selectDistrict: "Select a district",
    showOffices: "Show offices",
    loading: "Loading areas…",
    loadError: "Could not load the area list. Please try again.",
    retry: "Try again",
    noAreas: "No verified government offices have been added for this service yet.",
  },
};

/**
 * Manual area-selection fallback shown when the user denies location
 * permission (or prefers not to share it). Lists only districts/upazilas
 * that actually have offices for the selected service.
 */
export function AreaPickerModal({
  open,
  onClose,
  service,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  service: OfficeServiceKey;
  onSelect: (area: { district: string; upazila: string | null }) => void;
}) {
  const { t } = useTranslation();
  const s = t(STRINGS);

  const [areas, setAreas] = useState<OfficeArea[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");

  const loadAreas = useCallback(async () => {
    setLoading(true);
    setError(false);
    const res = await getOfficeAreas(service);
    if (res.success) {
      setAreas(res.data ?? []);
    } else {
      setAreas(null);
      setError(true);
    }
    setLoading(false);
  }, [service]);

  useEffect(() => {
    if (open && areas === null && !loading && !error) {
      loadAreas();
    }
  }, [open, areas, loading, error, loadAreas]);

  useEffect(() => {
    if (!open) {
      // Reset so a reopening reflects a fresh fetch.
      setDistrict("");
      setUpazila("");
    }
  }, [open]);

  const districts = useMemo(
    () => Array.from(new Set((areas ?? []).map((a) => a.district))).sort(),
    [areas],
  );
  const upazilas = useMemo(
    () =>
      (areas ?? [])
        .filter((a) => a.district === district)
        .map((a) => a.upazila)
        .sort(),
    [areas, district],
  );

  return (
    <Modal open={open} onClose={onClose} title={s.title}>
      <p className="text-sm leading-6 text-slate-600">{s.intro}</p>
      <div className="mt-4 space-y-4">
        {loading ? (
          <div className="space-y-3" aria-busy="true" aria-live="polite">
            <span className="sr-only">{s.loading}</span>
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-flag-200 bg-flag-50 px-4 py-3 text-sm text-flag-700" role="alert">
            {s.loadError}
            <button type="button" onClick={loadAreas} className="ml-2 font-bold underline">
              {s.retry}
            </button>
          </div>
        ) : (areas?.length ?? 0) === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-canvas px-4 py-4 text-sm text-slate-500">
            {s.noAreas}
          </p>
        ) : (
          <>
            <Field label={s.district} htmlFor="area-district" required>
              <Select
                id="area-district"
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setUpazila("");
                }}
              >
                <option value="">{s.selectDistrict}</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={s.upazila} htmlFor="area-upazila">
              <Select
                id="area-upazila"
                value={upazila}
                disabled={!district}
                onChange={(e) => setUpazila(e.target.value)}
              >
                <option value="">{s.allUpazilas}</option>
                {upazilas.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </Select>
            </Field>
            <Button
              block
              disabled={!district}
              onClick={() => onSelect({ district, upazila: upazila || null })}
              icon={<Navigation className="h-4 w-4" aria-hidden="true" />}
            >
              {s.showOffices}
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}

export default AreaPickerModal;
