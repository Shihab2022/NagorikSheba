"use client";

import Link from "next/link";
import { ArrowUpRight, Bot, Building2, PackageSearch, Search, Sparkles } from "lucide-react";
import { useTranslation, type Dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type QuickActionItem = {
  icon: typeof Search;
  title: Dict<string>;
  subtitle: Dict<string>;
  href: string;
  badge?: Dict<string>;
  accent: {
    container: string;
    icon: string;
    borderHover: string;
  };
};

const ITEMS: QuickActionItem[] = [
  {
    icon: Search,
    title: { bn: "সেবা খুঁজুন", en: "Search Services" },
    subtitle: { bn: "সকল সরকারি সেবা ব্রাউজ করুন", en: "Browse all civic services" },
    href: "/dashboard/search",
    accent: {
      container: "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white",
      icon: "text-emerald-700 group-hover:text-white",
      borderHover: "hover:border-emerald-200",
    },
  },
  {
    icon: PackageSearch,
    title: { bn: "আবেদন ট্র্যাক", en: "Track Application" },
    subtitle: { bn: "বর্তমান অবস্থা ও অগ্রগতি জানুন", en: "Check live processing status" },
    href: "/dashboard/applications",
    accent: {
      container: "bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white",
      icon: "text-blue-700 group-hover:text-white",
      borderHover: "hover:border-blue-200",
    },
  },
  {
    icon: Building2,
    title: { bn: "অফিস খুঁজুন", en: "Find Office" },
    subtitle: { bn: "নিকটস্থ দপ্তর ও দিকনির্দেশনা", en: "Locate regional desks & map" },
    href: "/dashboard/government-offices",
    accent: {
      container: "bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white",
      icon: "text-amber-700 group-hover:text-white",
      borderHover: "hover:border-amber-200",
    },
  },
  {
    icon: Bot,
    title: { bn: "এআই সহকারী", en: "AI Assistant" },
    subtitle: { bn: "তাৎক্ষণিক পরামর্শ ও গাইড", en: "Instant guidance & checklist" },
    href: "/dashboard/ai-assistant",
    badge: { bn: "স্মার্ট", en: "Smart" },
    accent: {
      container: "bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white",
      icon: "text-purple-700 group-hover:text-white",
      borderHover: "hover:border-purple-200",
    },
  },
];

export function QuickActions() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {ITEMS.map((q) => (
        <Link
          key={q.href}
          href={q.href}
          className={cn(
            "group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
            q.accent.borderHover,
          )}
        >
          <div className="flex items-start justify-between">
            <span
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 shadow-xs",
                q.accent.container,
              )}
            >
              <q.icon className={cn("h-5 w-5 transition-colors", q.accent.icon)} aria-hidden="true" />
            </span>

            <div className="flex items-center gap-1.5">
              {q.badge && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-purple-50 border border-purple-100 px-2 py-0.5 text-[10px] font-extrabold text-purple-700">
                  <Sparkles className="h-2.5 w-2.5" />
                  {t(q.badge)}
                </span>
              )}
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 transition-colors group-hover:bg-slate-50 group-hover:text-slate-600">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </div>

          <div className="mt-3.5">
            <h3 className="text-sm font-black text-slate-900 group-hover:text-brand-700 transition-colors">
              {t(q.title)}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 font-medium line-clamp-1">
              {t(q.subtitle)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default QuickActions;
