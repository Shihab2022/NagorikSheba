"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { NOTICES } from "@/lib/data/notices";
import { OFFICES } from "@/lib/data/offices";
import { SERVICES } from "@/lib/data/services";
import type { SearchResult } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { Tabs } from "@/components/ui/Tabs";
import { useTranslation, type Dict, type Lang } from "@/lib/i18n";

const TABS: { value: string; label: Dict<string> }[] = [
  { value: "all", label: { bn: "সব", en: "All" } },
  { value: "service", label: { bn: "সেবা", en: "Services" } },
  { value: "office", label: { bn: "অফিস", en: "Offices" } },
  { value: "notice", label: { bn: "নোটিশ", en: "Notices" } },
  { value: "document", label: { bn: "ডকুমেন্ট", en: "Documents" } },
];

const STRINGS = {
  bn: {
    searchLabel: "সরকারি সেবা, ডকুমেন্ট, অফিস ও নোটিশ অনুসন্ধান করুন",
    searchPlaceholder: "সরকারি সেবা, ডকুমেন্ট, অফিস ও নোটিশ অনুসন্ধান করুন...",
    resultsFor: "{n} টি ফলাফল “{q}” এর জন্য",
    showingPopular: "{n} টি জনপ্রিয় ফলাফল দেখানো হচ্ছে — সবকিছু খুঁজতে লিখুন।",
    typeService: "সেবা",
    typeOffice: "অফিস",
    typeNotice: "নোটিশ",
    typeDocument: "ডকুমেন্ট",
    online: "অনলাইন",
    office: "অফিস",
    requiredFor: "{name} এর জন্য প্রয়োজন",
    open: "খুলুন",
    noResults: "কোনো ফলাফল পাওয়া যায়নি।",
    nothingMatched: "“{q}” এর সাথে মিলে এমন কিছু পাওয়া যায়নি। পাসপোর্ট, NID বা ভূমি এর মতো কীওয়ার্ড দিয়ে দেখুন।",
  },
  en: {
    searchLabel: "Search government services, documents, offices and notices",
    searchPlaceholder: "Search government services, documents, offices and notices...",
    resultsFor: "{n} results for “{q}”",
    showingPopular: "Showing {n} popular results — type to search everything.",
    typeService: "Service",
    typeOffice: "Office",
    typeNotice: "Notice",
    typeDocument: "Document",
    online: "Online",
    office: "Office",
    requiredFor: "Required for {name}",
    open: "Open",
    noResults: "No results found.",
    nothingMatched: "Nothing matched “{q}”. Try a keyword like passport, NID or land.",
  },
};

function collect(q0: string, lang: Lang): SearchResult[] {
  const q = q0.trim().toLowerCase();
  const out: SearchResult[] = [];
  const bn = lang === "bn";
  for (const s of SERVICES) {
    const hay = `${s.name} ${s.description} ${(s.requiredDocuments ?? []).join(" ")} ${s.department}`.toLowerCase();
    if (!q || hay.includes(q))
      out.push({ id: s.id, type: "service", title: s.name, description: s.description, href: `/services/${s.slug}`, badge: s.isOnline ? (bn ? "অনলাইন" : "Online") : bn ? "অফিস" : "Office" });
  }
  for (const o of OFFICES) {
    const hay = `${o.name} ${o.typeLabel} ${o.district} ${o.division}`.toLowerCase();
    if (!q || hay.includes(q))
      out.push({ id: o.id, type: "office", title: o.name, description: `${o.typeLabel} — ${o.address}`, href: `/government-offices/${o.id}`, badge: o.district });
  }
  for (const n of NOTICES) {
    const hay = `${n.title} ${n.summary} ${n.department}`.toLowerCase();
    if (!q || hay.includes(q))
      out.push({ id: n.id, type: "notice", title: n.title, description: n.summary, href: `/notices/${n.id}`, badge: bn ? "নোটিশ" : "Notice" });
  }
  for (const s of SERVICES) {
    for (const doc of s.requiredDocuments ?? []) {
      if (!q || doc.toLowerCase().includes(q)) {
        out.push({ id: `${s.id}-${doc}`, type: "document", title: doc, description: bn ? `${s.name} এর জন্য প্রয়োজন` : `Required for ${s.name}`, href: `/services/${s.slug}`, badge: s.name });
        break;
      }
    }
  }
  return out;
}

export function Hi({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-amber-200/70 px-0.5 text-inherit">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export function SearchExplorer({ initialQuery }: { initialQuery: string }) {
  const sp = useSearchParams();
  const { lang, t } = useTranslation();
  const s = t(STRINGS);
  const [query, setQuery] = useState(sp.get("q") ?? initialQuery);
  const [tab, setTab] = useState("all");
  const results = useMemo(() => collect(query, lang), [query, lang]);
  const filtered = tab === "all" ? results : results.filter((r) => r.type === tab);
  const counts = {
    all: results.length,
    service: results.filter((r) => r.type === "service").length,
    office: results.filter((r) => r.type === "office").length,
    notice: results.filter((r) => r.type === "notice").length,
    document: results.filter((r) => r.type === "document").length,
  };
  const typeLabels: Record<string, string> = {
    service: s.typeService,
    office: s.typeOffice,
    notice: s.typeNotice,
    document: s.typeDocument,
  };

  return (
    <div>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5">
        <label htmlFor="global-search" className="sr-only">{s.searchLabel}</label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input id="global-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder={s.searchPlaceholder} autoComplete="off"
            className="h-[52px] w-full rounded-xl border border-line bg-canvas py-3.5 pr-4 pl-12 text-[15px] text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
        </div>
        <div className="mt-3">
          <Tabs tabs={TABS.map((tabItem) => ({ value: tabItem.value, label: t(tabItem.label), count: counts[tabItem.value as keyof typeof counts] ?? 0 }))} defaultValue="all" onChange={setTab} size="sm" />
        </div>
      </form>
      <p className="mt-5 text-sm font-medium text-slate-500" role="status" aria-live="polite">
        {query.trim()
          ? s.resultsFor.replace("{n}", String(filtered.length)).replace("{q}", query.trim())
          : s.showingPopular.replace("{n}", String(filtered.length))}
      </p>
      {filtered.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {filtered.slice(0, 30).map((r) => (
            <li key={`${r.type}-${r.id}`} className="group relative rounded-2xl border border-line bg-white p-4 shadow-card transition-all duration-300 hover:border-brand-200 hover:shadow-card-hover sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={r.type === "service" ? "soft-green" : r.type === "notice" ? "soft-red" : r.type === "document" ? "soft-amber" : "outline"}>{typeLabels[r.type] ?? r.type}</Badge>
                {r.badge ? <span className="text-xs font-medium text-slate-400">{r.badge}</span> : null}
              </div>
              <Link href={r.href} className="mt-2 block text-base font-bold text-slate-900 group-hover:text-brand-700">
                <Hi text={r.title} query={query} />
              </Link>
              <p className="mt-1 text-sm leading-6 text-slate-500"><Hi text={r.description} query={query} /></p>
              <Link href={r.href} className="mt-2.5 inline-flex items-center gap-1 text-sm font-bold text-brand-700 hover:text-brand-800">
                {s.open} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          className="mt-4"
          title={s.noResults}
          description={s.nothingMatched.replace("{q}", query.trim())}
        />
      )}
    </div>
  );
}

export default SearchExplorer;

