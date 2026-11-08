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
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";

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
  const categoryLabel = service.categoryName || service.department;
  const servicePath = `/services/${service.slug}`;
  const docCount = service.documentsCount ?? service.requiredDocuments?.length ?? 0;

  return (
    <article className="group relative flex h-full min-w-0 flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift hover:ring-1 hover:ring-brand-100">
      {/* Clickable full-card link */}
      <Link
        href={servicePath}
        className="absolute inset-0 z-0 rounded-2xl"
        aria-label={service.name}
        tabIndex={-1}
      />

      <div className="relative z-10 flex items-start gap-4">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-6">
          <Icon name={service.icon || "FileText"} className="h-6 w-6" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone={service.isOnline ? "soft-green" : "soft-red"}>
              {service.isOnline ? (
                <MonitorSmartphone
                  className="h-3 w-3 shrink-0"
                  aria-hidden="true"
                />
              ) : (
                <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
              )}

              {service.isOnline ? "Online Service" : "Office Service"}
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

      <div className="relative z-10 mt-4 border-t border-line pt-3">
        <span className="block truncate text-xs font-semibold uppercase tracking-wide text-slate-400">
          {categoryLabel}
        </span>
      </div>

      {!compact ? (
        <dl className="relative z-10 mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
          <div className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
            <FileText
              className="h-3.5 w-3.5 shrink-0 text-brand-600"
              aria-hidden="true"
            />

            <dt className="sr-only">Required documents</dt>

            <dd className="min-w-0 truncate font-medium">
              {docCount} documents
            </dd>
          </div>

          <div className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
            <Clock
              className="h-3.5 w-3.5 shrink-0 text-brand-600"
              aria-hidden="true"
            />

            <dt className="sr-only">Estimated process</dt>

            <dd className="min-w-0 truncate font-medium">
              {service.processingTime ?? "—"}
            </dd>
          </div>
        </dl>
      ) : null}

      {/* View service link */}
      <Link
        href={servicePath}
        className="relative z-10 mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700"
      >
        View Service

        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </article>
  );
}

export default ServiceCard;
