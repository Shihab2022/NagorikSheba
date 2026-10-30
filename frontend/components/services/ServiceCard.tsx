"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock,
  FileText,
  MonitorSmartphone,
  MapPin,
  Banknote,
} from "lucide-react";

import type { GovernmentService } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/data/categories";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { useTranslation } from "@/lib/i18n";
import { COMMON } from "@/lib/i18n/common";

const STRINGS = {
  bn: {
    onlineService: "অনলাইন সেবা",
    officeService: "অফিস সেবা",
    requiredDocuments: "প্রয়োজনীয় ডকুমেন্ট",
    estimatedProcess: "আনুমানিক প্রক্রিয়া",
    documents: "{n} টি ডকুমেন্ট",
    fee: "ফি",
  },
  en: {
    onlineService: "Online Service",
    officeService: "Office Service",
    requiredDocuments: "Required documents",
    estimatedProcess: "Estimated process",
    documents: "{n} documents",
    fee: "Fee",
  },
};

/**
 * Service card used on home, category, search and services pages.
 * Fully responsive for Mobile Phone, iPad/Tablet, Laptop and Desktop.
 * `compact` drops meta rows for dense grids.
 */
export function ServiceCard({
  service,
  compact = false,
}: {
  service: GovernmentService;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const c = t(COMMON);

  const category = getCategoryBySlug(service.category);
  const servicePath = `/services/${service.slug}`;

  return (
    <article className="group relative flex h-full w-full min-w-0 max-w-full flex-col justify-between rounded-2xl border border-line bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift hover:ring-1 hover:ring-brand-200 sm:p-5">
      <div className="flex flex-col w-full min-w-0">
        {/* Top bar: Icon & Availability Badge */}
        <div className="flex items-start justify-between gap-2.5 sm:gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100/70 text-brand-700 ring-1 ring-brand-200/50 shadow-xs transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3 sm:h-12 sm:w-12">
            <Icon name={service.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>

          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <Badge tone={service.isOnline ? "soft-green" : "soft-red"}>
              {service.isOnline ? (
                <MonitorSmartphone
                  className="h-3 w-3 shrink-0"
                  aria-hidden="true"
                />
              ) : (
                <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
              )}
              {service.isOnline ? s.onlineService : s.officeService}
            </Badge>
          </div>
        </div>

        {/* Category / Department Tag */}
        <div className="mt-3">
          <span className="block truncate text-[11px] font-semibold uppercase tracking-wider text-brand-700/80 sm:text-xs">
            {category?.name ?? service.department}
          </span>
        </div>

        {/* Service Title */}
        <h3 className="mt-1 text-[15px] font-bold text-slate-900 break-words transition-colors group-hover:text-brand-700 sm:text-base lg:text-[17px]">
          <Link href={servicePath} className="line-clamp-2 hover:underline sm:line-clamp-1">
            {service.name}
          </Link>
        </h3>

        {/* Service Description */}
        <p className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-xs leading-5 text-slate-600 break-words sm:text-sm sm:leading-6">
          {service.description}
        </p>

        {/* Structured Meta Box (Responsive on phone & tablet) */}
        {!compact ? (
          <div className="mt-3.5 grid grid-cols-2 gap-2 rounded-xl border border-slate-100 bg-slate-50/80 p-2 text-xs sm:mt-4 sm:p-2.5">
            <div className="flex min-w-0 items-center gap-1.5 text-slate-600">
              <FileText
                className="h-3.5 w-3.5 shrink-0 text-brand-600"
                aria-hidden="true"
              />
              <span className="truncate text-[11px] font-medium sm:text-xs">
                {s.documents.replace(
                  "{n}",
                  String(service.requiredDocuments?.length ?? 0),
                )}
              </span>
            </div>

            <div className="flex min-w-0 items-center gap-1.5 text-slate-600">
              <Clock
                className="h-3.5 w-3.5 shrink-0 text-amber-600"
                aria-hidden="true"
              />
              <span className="truncate text-[11px] font-medium sm:text-xs">
                {service.processingTime ?? "—"}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer Link & Fee */}
      <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-line/80 pt-3 sm:mt-4">
        <Link
          href={servicePath}
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-brand-700 transition-colors group-hover:text-brand-800 sm:text-sm"
        >
          {c.viewService}
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 sm:h-4 sm:w-4"
            aria-hidden="true"
          />
        </Link>

        {service.fee ? (
          <span className="inline-flex min-w-0 max-w-[120px] items-center gap-1 truncate text-[11px] font-medium text-slate-500 sm:max-w-[140px] sm:text-xs" title={service.fee}>
            <Banknote className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span className="truncate">{service.fee}</span>
          </span>
        ) : null}
      </div>
    </article>
  );
}

export default ServiceCard;
