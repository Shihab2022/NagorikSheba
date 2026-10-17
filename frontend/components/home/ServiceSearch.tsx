"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslation } from "@/lib/i18n";
import { COMMON } from "@/lib/i18n/common";

// Search keywords match the (English) mock service data, so they stay as-is.
const POPULAR = [
  "NID",
  "Passport",
  "Driving License",
  "Birth Registration",
  "e-TIN",
  "Land Mutation",
  "Police Clearance",
  "Tax Return",
];

const STRINGS = {
  bn: {
    eyebrow: "স্মার্ট সার্চ",
    title: "আপনার প্রয়োজনীয় সরকারি সেবা খুঁজুন",
    description:
      "সেবা, অফিস, নোটিশ ও ডকুমেন্ট চেকলিস্ট — সবকিছু এক জায়গায় অনুসন্ধান করুন।",
    searchLabel: "সরকারি সেবা অনুসন্ধান করুন",
    placeholder: "যেমন: পাসপোর্ট নবায়ন, NID সংশোধন, জমির নামজারি...",
    popular: "জনপ্রিয় অনুসন্ধান",
  },
  en: {
    eyebrow: "Smart Search",
    title: "Find the government service you need",
    description:
      "Search across services, offices, notices and document checklists in one place.",
    searchLabel: "Search government services",
    placeholder: "e.g. Passport Renewal, NID Correction, Land Mutation...",
    popular: "Popular searches",
  },
};

/** Large prominent smart-search band on the homepage. */
export function ServiceSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { t } = useTranslation();
  const s = t(STRINGS);

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <section aria-labelledby="search-heading" className="bg-canvas">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading
            id="search-heading"
            eyebrow={s.eyebrow}
            title={s.title}
            description={s.description}
          />
        </Reveal>

        <Reveal delay={100}>
          <form onSubmit={submit} role="search" className="mx-auto mt-8 max-w-3xl">
            <label htmlFor="home-search" className="sr-only">
              {s.searchLabel}
            </label>
            <div className="group relative flex flex-col gap-2 rounded-2xl border border-line bg-white p-2 shadow-card transition-all duration-300 focus-within:border-brand-400 focus-within:shadow-lift focus-within:ring-4 focus-within:ring-brand-100 sm:flex-row sm:rounded-full sm:p-1.5">
              <div className="flex flex-1 items-center gap-3 px-3">
                <Search
                  className="h-5 w-5 shrink-0 text-slate-400 transition-colors group-focus-within:text-brand-600"
                  aria-hidden="true"
                />
                <input
                  id="home-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={s.placeholder}
                  className="h-11 w-full min-w-0 bg-transparent text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-700 active:translate-y-px sm:rounded-full"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                {t(COMMON).searchServices}
              </button>
            </div>
          </form>
        </Reveal>

        <Reveal delay={160}>
          <div className="mx-auto mt-6 max-w-3xl">
            <p className="text-center text-sm font-semibold text-slate-500">{s.popular}</p>
            <div className="scrollbar-none mt-3 flex snap-x gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible">
              {POPULAR.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
                  className="shrink-0 snap-start rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 sm:text-sm"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default ServiceSearch;
