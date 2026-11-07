"use client";

import { useCallback, useMemo, useState } from "react";
import { Navigation } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Select } from "@/components/ui/Input";
import {
  ALL_DISTRICTS,
  getUpazilasForDistrict,
} from "@/lib/data/bangladesh-areas";
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
  },
};

export type AreaSelection = {
  district: string;
  districtBn: string;
  upazila: string | null;
  upazilaBn: string | null;
};

/**
 * Manual area-selection fallback shown when the user denies location
 * permission or prefers not to share it.
 */
export function AreaPickerModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (area: AreaSelection) => void;
}) {
  const { t } = useTranslation();
  const s = t(STRINGS);

  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");

  const upazilas = useMemo(() => getUpazilasForDistrict(district), [district]);

  const handleClose = useCallback(() => {
    setDistrict("");
    setUpazila("");
    onClose();
  }, [onClose]);

  const handleSelect = () => {
    const selectedDistrict = ALL_DISTRICTS.find((item) => item.en === district);

    if (!selectedDistrict) return;

    const selectedUpazila = upazila
      ? upazilas.find((item) => item.en === upazila)
      : undefined;

    onSelect({
      district: selectedDistrict.en,
      districtBn: selectedDistrict.bn,
      upazila: selectedUpazila?.en ?? null,
      upazilaBn: selectedUpazila?.bn ?? null,
    });
  };

  return (
    <Modal open={open} onClose={handleClose} title={s.title}>
      <p className="text-sm leading-6 text-slate-600">{s.intro}</p>

      <div className="mt-4 space-y-4">
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
            {ALL_DISTRICTS.map((d) => (
              <option key={d.en} value={d.en}>
                {d.bn}
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
              <option key={u.en} value={u.en}>
                {u.bn}
              </option>
            ))}
          </Select>
        </Field>

        <Button
          block
          disabled={!district}
          onClick={handleSelect}
          icon={<Navigation className="h-4 w-4" aria-hidden="true" />}
        >
          {s.showOffices}
        </Button>
      </div>
    </Modal>
  );
}

export default AreaPickerModal;
