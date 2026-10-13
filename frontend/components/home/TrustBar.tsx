"use client";

import { Building2, FileText, ListChecks, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const ITEMS = [
  { icon: ShieldCheck, label: { bn: "অফিসিয়াল সেবা লিংক", en: "Official service links" } },
  { icon: ListChecks, label: { bn: "ধাপে ধাপে নির্দেশনা", en: "Step-by-step guidance" } },
  { icon: FileText, label: { bn: "প্রয়োজনীয় ডকুমেন্ট", en: "Required documents" } },
  { icon: Building2, label: { bn: "সরকারি অফিসের তথ্য", en: "Government office information" } },
];

const STRINGS = {
  bn: { ariaLabel: "কেন নাগরিকসেবায় বিশ্বাস করবেন" },
  en: { ariaLabel: "Why trust NagorikSheba" },
};

/** Compact reassurance strip directly below the hero. */
export function TrustBar() {
  const { t } = useTranslation();
  const s = t(STRINGS);
  return (
    <section aria-label={s.ariaLabel} className="border-b border-line bg-white">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-4 gap-y-3 px-4 py-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {ITEMS.map((item) => (
          <div key={item.label.en} className="flex items-center gap-2.5">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <item.icon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold leading-tight text-slate-600 sm:text-sm">
              {t(item.label)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrustBar;
