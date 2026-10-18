import Link from "next/link";
import { History } from "lucide-react";
import { T } from "@/components/ui/T";

const DEFAULT_SEARCHES = ["passport renewal", "NID correction", "land mutation"];

export interface RecentSearchesCardProps {
  searches?: string[];
}

export function RecentSearchesCard({ searches = DEFAULT_SEARCHES }: RecentSearchesCardProps) {
  return (
    <section aria-labelledby="dash-recent" className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <h2 id="dash-recent" className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
        <History className="h-[18px] w-[18px] text-brand-600" aria-hidden="true" />
        <T bn="সাম্প্রতিক অনুসন্ধান" en="Recent Searches" />
      </h2>
      <ul className="mt-3 space-y-2">
        {searches.map((t) => (
          <li key={t}>
            <Link
              href={`/search?q=${encodeURIComponent(t)}`}
              className="block truncate rounded-xl bg-canvas px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:text-brand-700"
            >
              {t}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default RecentSearchesCard;
