"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  Building2,
  Calculator,
  Coins,
  FileSearch,
  ListChecks,
  MapPin,
  Newspaper,
  Route,
  Search,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { useTranslation, type Dict } from "@/lib/i18n";

const TOOLS = [
  { label: { bn: "সেবা খোঁজ", en: "Service Search" }, href: "/search", icon: Search },
  { label: { bn: "কাগজপত্র", en: "Document Checklist" }, href: "/documents", icon: FileSearch },
  { label: { bn: "ফি তালিকা", en: "Fee Guide" }, href: "/fees", icon: Coins },
  { label: { bn: "আয়কর হিসাব", en: "Tax Calculator" }, href: "/income-tax-calculator", icon: Calculator },
  { label: { bn: "অফিস খোঁজ", en: "Office Finder" }, href: "/government-offices", icon: Building2 },
  { label: { bn: "কাছাকাছি অফিস", en: "Find Nearby Office" }, href: "/government-offices", icon: MapPin },
  { label: { bn: "আবেদন ট্র্যাক", en: "Application Tracker" }, href: "/application-tracker", icon: Route },
  { label: { bn: "এআই সহায়ক", en: "AI Assistant" }, href: "/ai-assistant", icon: Bot },
  { label: { bn: "নোটিশ", en: "Government Notices" }, href: "/notices", icon: Newspaper },
] satisfies { label: Dict<string>; href: string; icon: typeof Search }[];

const STRINGS = {
  bn: {
    eyebrow: "দ্রুত সাধন",
    title: "দ্রুত সেবা",
    description: "নাগরিকের যে কোনো সরঞ্জাম — এক ট্যাপের দূরত্বে।",
    needSpecific: "কিছু নির্দিষ্ট খুঁজছেন?",
    searchEverything: "সবকিছু অনুসন্ধান করুন →",
  },
  en: {
    eyebrow: "Quick tools",
    title: "Quick Tools",
    description: "Every utility a citizen needs — one tap away.",
    needSpecific: "Need something specific?",
    searchEverything: "Search everything →",
  },
};

/** "দ্রুত সেবা" — quick utility tiles. */
export function QuickTools() {
  const { t } = useTranslation();
  const s = t(STRINGS);
  return (
    <section aria-labelledby="tools-heading" className="bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading
            id="tools-heading"
            eyebrow={s.eyebrow}
            title={s.title}
            description={s.description}
          />
        </Reveal>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {TOOLS.map((tool, i) => (
            <li key={tool.label.en}>
              <Reveal delay={(i % 4) * 60} className="h-full">
                <Link
                  href={tool.href}
                  className={cn(
                    "group flex h-full flex-col items-start gap-3 rounded-2xl border border-line bg-white p-4 shadow-card transition-all duration-300",
                    "hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift sm:p-5",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-6",
                      i % 2 === 0
                        ? "bg-brand-50 text-brand-700 group-hover:bg-brand-100"
                        : "bg-flag-50 text-flag-600 group-hover:bg-flag-100",
                    )}
                  >
                    <tool.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold text-slate-900 group-hover:text-brand-700">
                      {t(tool.label)}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 text-slate-300 transition-all group-hover:text-brand-600"
                    aria-hidden="true"
                  />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal>
          <p className="mt-8 text-center text-sm text-slate-500">
            {s.needSpecific}{" "}
            <Link href="/search" className="font-bold text-brand-700 hover:text-brand-800">
              {s.searchEverything}
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default QuickTools;
