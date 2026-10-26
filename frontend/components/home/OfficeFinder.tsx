"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Building2, MapPin, MapPinned } from "lucide-react";
import { DIVISIONS, OFFICES, OFFICE_TYPES } from "@/lib/data/offices";
import { OfficeCard } from "@/components/offices/OfficeCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Select } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/States";
import { useTranslation } from "@/lib/i18n";
import { COMMON } from "@/lib/i18n/common";

const STRINGS = {
  bn: {
    eyebrow: "অফিস খোঁজ",
    title: "সরকারি অফিস খুঁজুন",
    description:
      "নিকটতম পাসপোর্ট অফিস, ভূমি অফিস, বিআরটিএ, থানা, হাসপাতাল বা কর অফিস খুঁজুন।",
    division: "বিভাগ",
    district: "জেলা",
    upazila: "উপজেলা",
    officeType: "অফিসের ধরন",
    allDivisions: "সব বিভাগ",
    allDistricts: "সব জেলা",
    allUpazilas: "সব উপজেলা",
    allOfficeTypes: "সব অফিসের ধরন",
    resetFilters: "ফিল্টার রিসেট",
    demoOffices: "{n} টি ডেমো অফিস বাংলাদেশজুড়ে — এই প্রোটোটাইপে।",
    openOfficeFinder: "অফিস ফাইন্ডার খুলুন",
  },
  en: {
    eyebrow: "Office finder",
    title: "Find Government Offices",
    description:
      "Find the nearest passport office, land office, BRTA, police station, hospital or tax office.",
    division: "Division",
    district: "District",
    upazila: "Upazila",
    officeType: "Office type",
    allDivisions: "All Divisions",
    allDistricts: "All Districts",
    allUpazilas: "All Upazilas",
    allOfficeTypes: "All Office Types",
    resetFilters: "Reset filters",
    demoOffices: "{n} demo offices across Bangladesh in this prototype.",
    openOfficeFinder: "Open office finder",
  },
};

/** Homepage office finder with division / district / upazila / type filters. */
export function OfficeFinder() {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const c = t(COMMON);
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [type, setType] = useState("");

  const districts = useMemo(
    () =>
      Array.from(
        new Set(
          OFFICES.filter((o) => !division || o.division === division).map((o) => o.district),
        ),
      ).sort(),
    [division],
  );
  const upazilas = useMemo(
    () =>
      Array.from(
        new Set(
          OFFICES.filter(
            (o) =>
              (!division || o.division === division) && (!district || o.district === district),
          ).map((o) => o.upazila),
        ),
      ).sort(),
    [division, district],
  );

  const results = OFFICES.filter(
    (o) =>
      (!division || o.division === division) &&
      (!district || o.district === district) &&
      (!upazila || o.upazila === upazila) &&
      (!type || o.type === type),
  ).slice(0, 6);

  const reset = () => {
    setDivision("");
    setDistrict("");
    setUpazila("");
    setType("");
  };

  return (
    <section aria-labelledby="office-finder-heading" className="bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading
            id="office-finder-heading"
            eyebrow={s.eyebrow}
            title={s.title}
            description={s.description}
          />
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 grid grid-cols-1 gap-3 rounded-2xl border border-line bg-canvas p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-5">
            <Select
              aria-label={s.division}
              value={division}
              onChange={(e) => {
                setDivision(e.target.value);
                setDistrict("");
                setUpazila("");
              }}
            >
              <option value="">{s.allDivisions}</option>
              {DIVISIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
            <Select
              aria-label={s.district}
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setUpazila("");
              }}
            >
              <option value="">{s.allDistricts}</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
            <Select
              aria-label={s.upazila}
              value={upazila ?? ""}
              onChange={(e) => setUpazila(e.target.value)}
            >
              <option value="">{s.allUpazilas}</option>
              {upazilas.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </Select>
            <Select aria-label={s.officeType} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">{s.allOfficeTypes}</option>
              {OFFICE_TYPES.map((ot) => (
                <option key={ot.type} value={ot.type}>
                  {ot.typeLabel}
                </option>
              ))}
            </Select>
            <button
              type="button"
              onClick={reset}
              className="col-span-1 h-12 rounded-xl border border-line bg-white text-sm font-semibold text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-700 sm:col-span-2 lg:col-span-1"
            >
              {s.resetFilters}
            </button>
          </div>
        </Reveal>

        <div className="mt-6">
          {results.length === 0 ? (
            <EmptyState
              title={c.noOffices}
              description={c.tryFilters}
              icon={<Building2 className="h-7 w-7" aria-hidden="true" />}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((office, i) => (
                <Reveal key={office.id} delay={(i % 3) * 60} className="h-full">
                  <OfficeCard office={office} />
                </Reveal>
              ))}
            </div>
          )}
        </div>

        <Reveal>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-brand-50 px-5 py-4 ring-1 ring-brand-100 sm:flex-row">
            <p className="flex items-center gap-2 text-sm font-semibold text-brand-800">
              <MapPinned className="h-[18px] w-[18px]" aria-hidden="true" />
              {s.demoOffices.replace("{n}", String(OFFICES.length))}
            </p>
            <Link
              href="/government-offices"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-bold text-white transition-all hover:bg-brand-700"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {s.openOfficeFinder}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default OfficeFinder;
