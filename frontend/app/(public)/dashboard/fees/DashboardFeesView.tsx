"use client";

import Link from "next/link";
import { ArrowRight, BadgeAlert, ExternalLink } from "lucide-react";
import type { GovernmentService } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";

export function DashboardFeesView({ services = [] }: { services?: GovernmentService[] }) {
  if (services.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-white p-12 text-center text-slate-500">
        No fee information found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((svc) => (
          <article
            key={svc.id}
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-brand-200 sm:p-6"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-transform group-hover:scale-105">
              <Icon name={svc.icon} className="h-[22px] w-[22px]" />
            </span>
            <h2 className="mt-3 text-base font-extrabold text-slate-900">{svc.name}</h2>
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-brand-700">
              {svc.fee ?? "—"}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-400">
              Processing: {svc.processingTime ?? "Varies"}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
              <Link
                href={`/dashboard/services/${svc.slug}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800"
              >
                Details <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              {svc.officialUrl ? (
                <a
                  href={svc.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-brand-700"
                >
                  Official <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
        <BadgeAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="text-xs leading-5 font-medium text-amber-900">
          Fees may change. Always verify the latest fee from the official government source before paying.
        </p>
      </div>
    </div>
  );
}

export default DashboardFeesView;
