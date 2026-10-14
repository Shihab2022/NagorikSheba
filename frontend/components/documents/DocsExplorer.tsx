"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckSquare, ListChecks, Search } from "lucide-react";
import { SERVICES } from "@/lib/data/services";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

const STRINGS = {
  bn: {
    findServiceLabel: "একটি সেবা খুঁজুন",
    findServicePlaceholder: "একটি সেবা খুঁজুন…",
    servicesLabel: "সেবাসমূহ",
    checklist: "ডকুমেন্ট চেকলিস্ট",
    ready: "{done} / {total} প্রস্তুত",
    progressLabel: "চেকলিস্ট অগ্রগতি",
    viewGuide: "সম্পূর্ণ সেবা নির্দেশিকা দেখুন",
  },
  en: {
    findServiceLabel: "Find a service",
    findServicePlaceholder: "Find a service...",
    servicesLabel: "Services",
    checklist: "Document checklist",
    ready: "{done} of {total} ready",
    progressLabel: "Checklist progress",
    viewGuide: "View complete service guide",
  },
};

export function DocsExplorer() {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(SERVICES[0]?.id ?? "");
  const [done, setDone] = useState<string[]>([]);
  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return SERVICES.filter((s2) => !term || `${s2.name} ${s2.description}`.toLowerCase().includes(term));
  }, [q]);
  const svc = SERVICES.find((s2) => s2.id === sel) ?? list[0] ?? SERVICES[0];
  const docs = svc?.requiredDocuments ?? [];
  const pct = docs.length ? Math.round((done.filter((d) => docs.includes(d)).length / docs.length) * 100) : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <div className="rounded-2xl border border-line bg-white p-4 shadow-card">
        <label htmlFor="doc-svc-search" className="sr-only">{s.findServiceLabel}</label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input id="doc-svc-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={s.findServicePlaceholder}
            className="h-11 w-full rounded-xl border border-line bg-canvas pr-3 pl-10 text-sm focus:border-brand-500 focus:outline-none" />
        </div>
        <ul className="mt-3 max-h-[420px] space-y-1 overflow-y-auto" role="listbox" aria-label={s.servicesLabel}>
          {list.map((s2) => (
            <li key={s2.id}>
              <button type="button" role="option" aria-selected={s2.id === svc?.id} onClick={() => { setSel(s2.id); setDone([]); }}
                className={cn("flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors",
                  s2.id === svc?.id ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100")}>
                <Icon name={s2.icon} className="h-[18px] w-[18px] shrink-0" />
                <span className="truncate">{s2.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-7">
        {svc ? (<>
          <p className="text-xs font-extrabold tracking-widest text-brand-600 uppercase">{s.checklist}</p>
          <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">{svc.name}</h2>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span className="inline-flex items-center gap-1.5"><ListChecks className="h-4 w-4" aria-hidden="true" /> {s.ready
                .replace("{done}", String(done.filter((d) => docs.includes(d)).length))
                .replace("{total}", String(docs.length))}</span>
              <span>{pct}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={s.progressLabel}>
              <div className="h-full rounded-full bg-brand-600 transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <ul className="mt-5 space-y-2.5">
            {docs.map((d) => {
              const checked = done.includes(d);
              return (
                <li key={d}>
                  <label className={cn("flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                    checked ? "border-brand-200 bg-brand-50/60 text-slate-500 line-through" : "border-line bg-canvas text-slate-700 hover:border-brand-200")}>
                    <input type="checkbox" checked={checked} onChange={() => setDone((p) => checked ? p.filter((x) => x !== d) : [...p, d])} className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#006A4E]" />
                    <span className="inline-flex items-start gap-2"><CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />{d}</span>
                  </label>
                </li>
              );
            })}
          </ul>
          <Link href={`/services/${svc.slug}`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800">
            {s.viewGuide} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </>) : null}
      </div>
    </div>
  );
}
export default DocsExplorer;
