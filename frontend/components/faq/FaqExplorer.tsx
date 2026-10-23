"use client";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/lib/data/notices";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/States";
import { Tabs } from "@/components/ui/Tabs";
import { useTranslation, type Dict } from "@/lib/i18n";

const TABS: { value: string; label: Dict<string> }[] = [
  { value: "all", label: { bn: "সব", en: "All" } },
  { value: "general", label: { bn: "সাধারণ", en: "General" } },
  { value: "services", label: { bn: "সেবা", en: "Services" } },
  { value: "account", label: { bn: "অ্যাকাউন্ট", en: "Account" } },
  { value: "data", label: { bn: "তথ্য ও নির্ভুলতা", en: "Data & accuracy" } },
];

const STRINGS = {
  bn: {
    noAnswers: "কোনো উত্তর পাওয়া যায়নি।",
    tryKeyword: "অন্য কোনো কীওয়ার্ড বা বিভাগ দিয়ে দেখুন।",
  },
  en: {
    noAnswers: "No answers found.",
    tryKeyword: "Try a different keyword or category.",
  },
};

export function FaqExplorer({ query }: { query: string }) {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const [tab, setTab] = useState("all");
  const [open, setOpen] = useState<string | null>(FAQS[0]?.id ?? null);
  const q = query.trim().toLowerCase();

  const items = useMemo(
    () =>
      FAQS.filter((f) => {
        if (tab !== "all" && f.category !== tab) return false;
        if (!q) return true;
        return `${f.question.bn} ${f.question.en} ${f.answer.bn} ${f.answer.en}`
          .toLowerCase()
          .includes(q);
      }),
    [tab, q],
  );

  return (
    <div>
      <Tabs
        tabs={TABS.map((tabItem) => ({ value: tabItem.value, label: t(tabItem.label) }))}
        defaultValue="all"
        onChange={(v) => setTab(v)}
      />
      {items.length > 0 ? (
        <div className="mt-5 space-y-3">
          {items.map((f) => {
            const isOpen = open === f.id;
            return (
              <div key={f.id} className={cn("overflow-hidden rounded-2xl border bg-white shadow-card transition-colors", isOpen ? "border-brand-200" : "border-line")}>
                <button type="button" onClick={() => setOpen(isOpen ? null : f.id)} aria-expanded={isOpen}
                  aria-controls={`faq-panel-${f.id}`} id={`faq-btn-${f.id}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="text-[15px] font-bold text-slate-900">{t(f.question)}</span>
                  <ChevronDown className={cn("h-5 w-5 shrink-0 text-brand-600 transition-transform duration-300", isOpen && "rotate-180")} aria-hidden="true" />
                </button>
                <div id={`faq-panel-${f.id}`} role="region" aria-labelledby={`faq-btn-${f.id}`} hidden={!isOpen}>
                  <p className="border-t border-line px-5 py-4 text-sm leading-7 text-slate-600">{t(f.answer)}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState className="mt-5" title={s.noAnswers} description={s.tryKeyword} />
      )}
    </div>
  );
}

export default FaqExplorer;
