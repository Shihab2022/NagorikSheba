"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, History, Search } from "lucide-react";
import { T } from "@/components/ui/T";

const DEFAULT_SEARCHES = [
  "পাসপোর্ট নবায়ন",
  "জাতীয় পরিচয়পত্র সংশোধন",
  "ড্রাইভিং লাইসেন্স আবেদন",
  "নামজারি খতিয়ান",
];

export interface RecentSearchesCardProps {
  searches?: string[];
}

export function RecentSearchesCard({ searches = DEFAULT_SEARCHES }: RecentSearchesCardProps) {
  const [items, setItems] = useState<string[]>(searches);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nagorik_recent_searches");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }
    } catch {}
  }, []);

  return (
    <section aria-labelledby="dash-recent" className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h2 id="dash-recent" className="flex items-center gap-2 text-xs font-black tracking-wide text-slate-800 uppercase">
          <History className="h-4 w-4 text-brand-600" aria-hidden="true" />
          <T bn="সাম্প্রতিক অনুসন্ধান" en="Recent Searches" />
        </h2>
        <span className="text-[11px] font-bold text-slate-400">
          {items.length}
        </span>
      </div>

      <ul className="mt-3.5 space-y-2">
        {items.slice(0, 5).map((term) => (
          <li key={term}>
            <Link
              href={`/dashboard/search?q=${encodeURIComponent(term)}`}
              className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-2.5 text-xs font-bold text-slate-700 transition-all duration-200 hover:border-brand-200 hover:bg-brand-50/50 hover:text-brand-800"
            >
              <span className="flex items-center gap-2 truncate">
                <Search className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-brand-600" />
                <span className="truncate">{term}</span>
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default RecentSearchesCard;
