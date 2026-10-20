"use client";

import Link from "next/link";
import { Bot, Building2, PackageSearch, Search } from "lucide-react";
import { useTranslation, type Dict } from "@/lib/i18n";

const ITEMS: { icon: typeof Search; label: Dict<string>; href: string }[] = [
  { icon: Search, label: { bn: "সেবা খুঁজুন", en: "Search Service" }, href: "/search" },
  { icon: PackageSearch, label: { bn: "আবেদন ট্র্যাক", en: "Track Application" }, href: "/application-tracker" },
  { icon: Building2, label: { bn: "অফিস খুঁজুন", en: "Find Office" }, href: "/government-offices" },
  { icon: Bot, label: { bn: "এআইকে জিজ্ঞাসা", en: "Ask AI" }, href: "/ai-assistant" },
];

export function QuickActions() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {ITEMS.map((q) => (
        <Link
          key={q.href}
          href={q.href}
          className="group flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover"
        >
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition-transform duration-300 group-hover:scale-105">
            <q.icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-sm font-bold text-slate-800">{t(q.label)}</span>
        </Link>
      ))}
    </div>
  );
}

export default QuickActions;
