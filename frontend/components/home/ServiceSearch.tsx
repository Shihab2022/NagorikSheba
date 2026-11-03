"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Bot, Loader2, Search, Sparkles, X } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslation, type Lang } from "@/lib/i18n";
import { COMMON } from "@/lib/i18n/common";
import { useDebounce } from "@/hooks/useDebounce";
import { searchGlobal, type UnifiedSearchResultItem } from "@/service/search";

const POPULAR = [
  { bn: "পাসপোর্ট", en: "Passport" },
  { bn: "এনআইডি সংশোধন", en: "NID Correction" },
  { bn: "ড্রাইভিং লাইসেন্স", en: "Driving License" },
  { bn: "জন্ম নিবন্ধন", en: "Birth Registration" },
  { bn: "ই-টিন", en: "e-TIN" },
  { bn: "নামজারি", en: "Land Mutation" },
  { bn: "পুলিশ ক্লিয়ারেন্স", en: "Police Clearance" },
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
    viewAllResults: "“{q}” এর সব ফলাফল দেখুন",
    noSuggestions: "কোনো সরাসরি মিল পাওয়া যায়নি — সম্পূর্ণ সার্চ করতে এন্টার চাপুন।",
    aiMatch: "এআই ম্যাচ",
  },
  en: {
    eyebrow: "Smart Search",
    title: "Find the government service you need",
    description:
      "Search across services, offices, notices and document checklists in one place.",
    searchLabel: "Search government services",
    placeholder: "e.g. Passport Renewal, NID Correction, Land Mutation...",
    popular: "Popular searches",
    viewAllResults: "View all results for “{q}”",
    noSuggestions: "No direct match found — press Enter to search everything.",
    aiMatch: "AI Match",
  },
};

/** Large prominent smart-search band on the homepage with live debounced suggestions. */
export function ServiceSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);
  const [suggestions, setSuggestions] = useState<UnifiedSearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { lang, t } = useTranslation();
  const s = t(STRINGS);

  // Live suggestions query
  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let isCancelled = false;
    setLoading(true);

    searchGlobal(debouncedQuery, "all")
      .then((res) => {
        if (isCancelled) return;
        if (res.success && res.data) {
          setSuggestions((res.data.results || []).slice(0, 5));
        }
      })
      .catch(() => {
        if (!isCancelled) setSuggestions([]);
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, lang]);

  // Click outside to dismiss dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    setShowDropdown(false);
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
          <div ref={wrapperRef} className="relative mx-auto mt-8 max-w-3xl">
            <form onSubmit={submit} role="search">
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
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setShowDropdown(false);
                    }}
                    placeholder={s.placeholder}
                    autoComplete="off"
                    className="h-11 w-full min-w-0 bg-transparent text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
                  />
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                  ) : query ? (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setShowDropdown(false);
                      }}
                      className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
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

            {/* Instant Typeahead Suggestion Dropdown */}
            {showDropdown && query.trim().length >= 2 ? (
              <div className="absolute top-full right-0 left-0 z-30 mt-2 overflow-hidden rounded-2xl border border-line bg-white shadow-lift animate-in fade-in slide-in-from-top-2 duration-200">
                {suggestions.length > 0 ? (
                  <ul className="divide-y divide-slate-100">
                    {suggestions.map((item) => (
                      <li key={`${item.type}-${item.id}`}>
                        <Link
                          href={item.href}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-sm font-bold text-slate-900">
                                {item.title}
                              </span>
                              {item.aiMatched ? (
                                <span className="inline-flex items-center gap-0.5 rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
                                  <Sparkles className="h-2.5 w-2.5" />
                                  {s.aiMatch}
                                </span>
                              ) : null}
                              {item.badge ? (
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                                  {item.badge}
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-0.5 truncate text-xs text-slate-500">
                              {item.description}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                        </Link>
                      </li>
                    ))}
                    <li className="bg-slate-50/70 p-2 text-center">
                      <button
                        type="button"
                        onClick={submit}
                        className="text-xs font-bold text-brand-700 hover:underline"
                      >
                        {s.viewAllResults.replace("{q}", query.trim())} →
                      </button>
                    </li>
                  </ul>
                ) : !loading ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    {s.noSuggestions}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </Reveal>

        {/* Popular Tags */}
        <Reveal delay={160}>
          <div className="mx-auto mt-6 max-w-3xl">
            <p className="text-center text-sm font-semibold text-slate-500">{s.popular}</p>
            <div className="scrollbar-none mt-3 flex snap-x gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible">
              {POPULAR.map((item) => {
                const label = item[lang as Lang] || item.bn;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => router.push(`/search?q=${encodeURIComponent(label)}`)}
                    className="shrink-0 snap-start rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 sm:text-sm"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default ServiceSearch;
