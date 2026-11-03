"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, Search } from "lucide-react";
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
    <section aria-labelledby="dash-recent" className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <h2 id="dash-recent" className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
        <History className="h-[18px] w-[18px] text-brand-600" aria-hidden="true" />
        <T bn="সাম্প্রতিক অনুসন্ধান" en="Recent Searches" />
      </h2>
      <ul className="mt-3 space-y-2">
        {items.slice(0, 5).map((t) => (
          <li key={t}>
            <Link
              href={`/search?q=${encodeURIComponent(t)}`}
              className="flex items-center justify-between truncate rounded-xl bg-canvas px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-50/60 hover:text-brand-700"
            >
              <span className="truncate">{t}</span>
              <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default RecentSearchesCard;
