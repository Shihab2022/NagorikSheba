"use client";

import Link from "next/link";
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";
import type { GovernmentOffice } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { useTranslation } from "@/lib/i18n";

const STRINGS = {
  bn: { viewDetails: "বিস্তারিত দেখুন" },
  en: { viewDetails: "View Details" },
};

/** Government office card — used on home, offices page and search. */
export function OfficeCard({ office }: { office: GovernmentOffice }) {
  const { t } = useTranslation();
  const s = t(STRINGS);
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift hover:ring-1 hover:ring-brand-100">
      <div className="flex items-start gap-4">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-6">
          <Icon name={office.icon} className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <Badge tone="soft-green">{office.typeLabel}</Badge>
          <h3 className="mt-2 text-base font-bold leading-6 text-slate-900 transition-colors group-hover:text-brand-700">
            <Link href={`/government-offices/${office.id}`} className="after:absolute after:inset-0">
              {office.name}
            </Link>
          </h3>
          <p className="mt-1.5 flex items-start gap-1.5 text-sm text-slate-500">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-flag-500" aria-hidden="true" />
            {office.address}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-line pt-3 text-sm text-slate-600">
        <div className="flex flex-wrap gap-1.5">
          {office.services.slice(0, 3).map((s) => (
            <span
              key={s}
              className="rounded-md bg-canvas px-2 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-line"
            >
              {s}
            </span>
          ))}
        </div>
        <p className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden="true" />
          <span className="truncate text-xs">{office.openingHours}</span>
        </p>
        <p className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden="true" />
          <span className="text-xs">{office.contact}</span>
        </p>
      </div>

      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
        {s.viewDetails}
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </article>
  );
}

export default OfficeCard;
