"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock,
  FileText,
  MonitorSmartphone,
  MapPin,
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
  },
  en: {
    onlineService: "Online Service",
    officeService: "Office Service",
    requiredDocuments: "Required documents",
    estimatedProcess: "Estimated process",
    documents: "{n} documents",
  },
};

/**
 * Service card used on home, category, search and services pages.
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
    <article className="group relative flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift hover:ring-1 hover:ring-brand-100">
      <div className="flex items-start gap-4">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-6">
          <Icon name={service.icon} className="h-6 w-6" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone={service.isOnline ? "soft-green" : "soft-red"}>
              {service.isOnline ? (
                <MonitorSmartphone
                  className="h-3 w-3"
                  aria-hidden="true"
                />
              ) : (
                <MapPin className="h-3 w-3" aria-hidden="true" />
              )}

              {service.isOnline ? s.onlineService : s.officeService}
            </Badge>
          </div>

          <h3 className="mt-2 text-base font-bold text-slate-900 transition-colors group-hover:text-brand-700">
            <Link
              href={servicePath}
              className="hover:text-brand-700"
            >
              {service.name}
            </Link>
          </h3>

          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
            {service.description}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-line pt-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {category?.name ?? service.department}
        </span>
      </div>

      {!compact ? (
        <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <FileText
              className="h-3.5 w-3.5 text-brand-600"
              aria-hidden="true"
            />

            <dt className="sr-only">{s.requiredDocuments}</dt>

            <dd className="font-medium">
              {s.documents.replace(
                "{n}",
                String(service.requiredDocuments?.length ?? 0),
              )}
            </dd>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock
              className="h-3.5 w-3.5 text-brand-600"
              aria-hidden="true"
            />

            <dt className="sr-only">{s.estimatedProcess}</dt>

            <dd className="truncate font-medium">
              {service.processingTime ?? "—"}
            </dd>
          </div>
        </dl>
      ) : null}

      {/* Share and Copy Link buttons */}
      {/* <div className="relative z-10 mt-4 flex flex-wrap items-center gap-2">
        <ShareButton
          url={servicePath}
          title={service.name}
          text={service.description}
        />

        <CopyLinkButton url={servicePath} />
      </div> */}

      {/* View service link */}
      <Link
        href={servicePath}
        className="relative z-0 mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700"
      >
        {c.viewService}

        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </article>
  );
}

export default ServiceCard;
