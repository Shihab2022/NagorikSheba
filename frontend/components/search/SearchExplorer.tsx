"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Bot, Clock, Coins, Globe, Loader2, MapPin, Search, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { Tabs } from "@/components/ui/Tabs";
import { useTranslation, type Dict, type Lang } from "@/lib/i18n";
import { useDebounce } from "@/hooks/useDebounce";
import { searchGlobal, type UnifiedSearchResultItem } from "@/service/search";

const TABS: { value: string; label: Dict<string> }[] = [
  { value: "all", label: { bn: "সব", en: "All" } },
  { value: "service", label: { bn: "সেবা", en: "Services" } },
  { value: "office", label: { bn: "অফিস", en: "Offices" } },
  { value: "document", label: { bn: "ডকুমেন্ট", en: "Documents" } },
  { value: "notice", label: { bn: "নোটিশ", en: "Notices" } },
];

const POPULAR_QUERIES = [
  { bn: "পাসপোর্ট", en: "Passport" },
  { bn: "এনআইডি সংশোধন", en: "NID Correction" },
  { bn: "ড্রাইভিং লাইসেন্স", en: "Driving License" },
  { bn: "জন্ম নিবন্ধন", en: "Birth Certificate" },
  { bn: "নামজারি", en: "Land Mutation" },
  { bn: "পুলিশ ক্লিয়ারেন্স", en: "Police Clearance" },
];

const STRINGS = {
  bn: {
    searchLabel: "সরকারি সেবা, ডকুমেন্ট, অফিস ও নোটিশ অনুসন্ধান করুন",
    searchPlaceholder: "সরকারি সেবা, ডকুমেন্ট বা অফিস খুঁজুন (যেমন: পাসপোর্ট, NID, ড্রাইভিং লাইসেন্স)...",
    resultsFor: "{n} টি ফলাফল “{q}” এর জন্য পাওয়া গেছে",
    showingPopular: "{n} টি জনপ্রিয় ফলাফল দেখানো হচ্ছে — যেকোনো সেবা খুঁজতে বাংলায় বা ইংরেজিতে লিখুন।",
    typeService: "সেবা",
    typeOffice: "অফিস",
    typeNotice: "নোটিশ",
    typeDocument: "ডকুমেন্ট",
    online: "অনলাইন সেবা",
    office: "অফিস সেবা",
    open: "বিস্তারিত দেখুন",
    noResults: "কোনো ফলাফল পাওয়া যায়নি।",
    nothingMatched: "“{q}” এর সাথে মিলে এমন কিছু পাওয়া যায়নি। পাসপোর্ট, NID, ড্রাইভিং লাইসেন্স বা জমির মতো কীওয়ার্ড দিয়ে দেখুন।",
    popularSuggestions: "জনপ্রিয় অনুসন্ধান:",
    aiMatchBadge: "এআই স্মার্ট ম্যাচ",
    aiInsightTitle: "স্মার্ট সারসংক্ষেপ",
    searching: "অনুসন্ধান করা হচ্ছে...",
    clear: "মুছুন",
    fee: "ফি:",
    time: "সময়:",
  },
  en: {
    searchLabel: "Search government services, documents, offices and notices",
    searchPlaceholder: "Search services, documents or offices (e.g. Passport, NID, Driving License)...",
    resultsFor: "{n} results found for “{q}”",
    showingPopular: "Showing {n} popular results — type in English or Bangla to search everything.",
    typeService: "Service",
    typeOffice: "Office",
    typeNotice: "Notice",
    typeDocument: "Document",
    online: "Online Service",
    office: "Office Visit",
    open: "View details",
    noResults: "No results found.",
    nothingMatched: "Nothing matched “{q}”. Try keywords like passport, NID, driving license or land.",
    popularSuggestions: "Popular searches:",
    aiMatchBadge: "AI Smart Match",
    aiInsightTitle: "Smart Summary",
    searching: "Searching...",
    clear: "Clear",
    fee: "Fee:",
    time: "Time:",
  },
};

/** Highlight query terms safely without breaking on regex or special characters. */
export function Hi({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q || !text) return <>{text}</>;
  
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return <>{text}</>;
  
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-amber-200/80 px-0.5 text-inherit">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export function SearchExplorer({ initialQuery = "" }: { initialQuery?: string }) {
  const sp = useSearchParams();
  const { lang, t } = useTranslation();
  const s = t(STRINGS);

  const [query, setQuery] = useState(sp.get("q") ?? initialQuery);
  const debouncedQuery = useDebounce(query, 300);
  const [tab, setTab] = useState("all");
  const [results, setResults] = useState<UnifiedSearchResultItem[]>([]);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [counts, setCounts] = useState({
    all: 0,
    service: 0,
    office: 0,
    document: 0,
    notice: 0,
  });
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  // Fetch results when debounced query or language changes
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    searchGlobal(debouncedQuery, "all")
      .then((res) => {
        if (isCancelled) return;
        if (res.success && res.data) {
          startTransition(() => {
            setResults(res.data.results || []);
            setAiInsight(res.data.aiInsight || null);
            setCounts({
              all: res.data.counts?.all ?? (res.data.results?.length || 0),
              service: res.data.counts?.service ?? 0,
              office: res.data.counts?.office ?? 0,
              document: res.data.counts?.document ?? 0,
              notice: res.data.counts?.notice ?? 0,
            });
          });
        }
      })
      .catch((err) => {
        console.error("Search failed:", err);
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, lang]);

  // Keep URL query in sync smoothly without page reload and save recent searches
  useEffect(() => {
    if (typeof window !== "undefined") {
      const trimmed = debouncedQuery.trim();
      const url = new URL(window.location.href);
      if (trimmed) {
        url.searchParams.set("q", trimmed);
        try {
          const raw = localStorage.getItem("nagorik_recent_searches");
          const arr = raw ? JSON.parse(raw) : [];
          const updated = [trimmed, ...arr.filter((x: string) => x.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
          localStorage.setItem("nagorik_recent_searches", JSON.stringify(updated));
        } catch {}
      } else {
        url.searchParams.delete("q");
      }
      window.history.replaceState({}, "", url.toString());
    }
  }, [debouncedQuery]);

  const filtered = tab === "all" ? results : results.filter((r) => r.type === tab);

  const typeLabels: Record<string, string> = {
    service: s.typeService,
    office: s.typeOffice,
    notice: s.typeNotice,
    document: s.typeDocument,
  };

  return (
    <div>
      {/* Search Input Box */}
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="rounded-2xl border border-line bg-white p-4 shadow-card transition-all duration-300 focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-50 sm:p-5"
      >
        <label htmlFor="global-search" className="sr-only">
          {s.searchLabel}
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="global-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={s.searchPlaceholder}
            autoComplete="off"
            className="h-[52px] w-full rounded-xl border border-line bg-canvas py-3.5 pr-11 pl-12 text-[15px] text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          />
          {loading ? (
            <div className="absolute top-1/2 right-4 -translate-y-1/2">
              <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
            </div>
          ) : query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={s.clear}
              className="absolute top-1/2 right-3.5 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {/* Quick Popular Suggestions */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <span className="font-semibold text-slate-600">{s.popularSuggestions}</span>
          {POPULAR_QUERIES.map((p) => {
            const label = p[lang as Lang] || p.bn;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setQuery(label)}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-4 border-t border-slate-100 pt-3">
          <Tabs
            tabs={TABS.map((tabItem) => ({
              value: tabItem.value,
              label: t(tabItem.label),
              count: counts[tabItem.value as keyof typeof counts] ?? 0,
            }))}
            defaultValue="all"
            onChange={setTab}
            size="sm"
          />
        </div>
      </form>

      {/* AI Smart Summary Callout (if semantic vector match exists) */}
      {aiInsight && query.trim() ? (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50/80 via-emerald-50/50 to-teal-50/60 p-4 shadow-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <Bot className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-800 uppercase tracking-wide">
                <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                {s.aiInsightTitle}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">{aiInsight}</p>
          </div>
        </div>
      ) : null}

      {/* Results Status Header */}
      <div className="mt-5 flex items-center justify-between text-sm font-medium text-slate-500" role="status" aria-live="polite">
        <p>
          {loading ? (
            s.searching
          ) : query.trim() ? (
            s.resultsFor.replace("{n}", String(filtered.length)).replace("{q}", query.trim())
          ) : (
            s.showingPopular.replace("{n}", String(filtered.length))
          )}
        </p>
      </div>

      {/* Results List */}
      {filtered.length > 0 ? (
        <ul className="mt-4 space-y-3.5">
          {filtered.slice(0, 40).map((r) => (
            <li
              key={`${r.type}-${r.id}`}
              className="group relative rounded-2xl border border-line bg-white p-4 shadow-card transition-all duration-300 hover:border-brand-200 hover:shadow-card-hover sm:p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    tone={
                      r.type === "service"
                        ? "soft-green"
                        : r.type === "notice"
                        ? "soft-red"
                        : r.type === "document"
                        ? "soft-amber"
                        : "outline"
                    }
                  >
                    {typeLabels[r.type] ?? r.type}
                  </Badge>

                  {/* AI Semantic match indicator */}
                  {r.aiMatched ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-200/60">
                      <Sparkles className="h-3 w-3 text-indigo-500" />
                      {s.aiMatchBadge}
                      {r.aiSimilarity ? ` (${r.aiSimilarity}%)` : ""}
                    </span>
                  ) : null}

                  {r.badge ? (
                    <span className="text-xs font-medium text-slate-400">
                      {r.badge}
                    </span>
                  ) : null}
                </div>

                {/* Quick specs for services */}
                {r.type === "service" && (r.fee || r.processingTime) ? (
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    {r.fee ? (
                      <span className="flex items-center gap-1 font-semibold text-emerald-700">
                        <Coins className="h-3.5 w-3.5" />
                        {r.fee}
                      </span>
                    ) : null}
                    {r.processingTime ? (
                      <span className="hidden items-center gap-1 sm:flex">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {r.processingTime}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <Link
                href={r.href}
                className="mt-2.5 block text-base font-bold text-slate-900 transition-colors group-hover:text-brand-700 sm:text-lg"
              >
                <Hi text={r.title} query={query} />
              </Link>

              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 line-clamp-2">
                <Hi text={r.description} query={query} />
              </p>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                <Link
                  href={r.href}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800"
                >
                  {s.open} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>

                {r.type === "service" ? (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                    <Globe className="h-3.5 w-3.5" />
                    {r.isOnline ? s.online : s.office}
                  </span>
                ) : r.type === "office" ? (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="h-3.5 w-3.5" />
                    {r.badge}
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          className="mt-6"
          title={s.noResults}
          description={s.nothingMatched.replace("{q}", query.trim())}
        />
      )}
    </div>
  );
}

export default SearchExplorer;
