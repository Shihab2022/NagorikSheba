"use client";
import Link from "next/link";
import { Building2, Clock, Coins, ShieldCheck } from "lucide-react";
import type { GovernmentService } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/data/categories";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { useTranslation } from "@/lib/i18n";

const STRINGS = {
  bn: {
    home: "হোম",
    services: "সেবা",
    service: "সেবা",
    fee: "ফি ও সময়",
    online: "অনলাইন সেবা",
    officeOnly: "শুধু অফিস",
    varies: "বিভিন্ন",
    feeApplies: "ফি প্রযোজ্য",
  },
  en: {
    home: "Home",
    services: "Services",
    service: "Service",
    fee: "Fees & timing",
    online: "Online Service",
    officeOnly: "Office Only",
    varies: "Varies",
    feeApplies: "Fee applies",
  },
};

export function SvcHeader({
  service,
}: {
  service: GovernmentService;
}) {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const category = getCategoryBySlug(service.category);

  return (
    <header className="relative overflow-hidden border-b border-line bg-canvas">
      <div className="pattern-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-100/70 blur-2xl"
        aria-hidden="true"
      />
      <span
        className="absolute right-10 top-10 h-8 w-8 rounded-full bg-flag-500/70"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
            <li>
              <Link href="/" className="hover:text-brand-700">
                {s.home}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/services" className="hover:text-brand-700">
                {s.services}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/categories/${service.category}`}
                className="hover:text-brand-700"
              >
                {category?.name ?? s.service}
              </Link>
            </li>
          </ol>
        </nav>
        <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
          <div className="flex min-w-0 items-start gap-4 sm:gap-5">
            <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-card sm:h-16 sm:w-16">
              <Icon name={service.icon || "FileText"} className="h-7 w-7 sm:h-8 sm:w-8" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={service.isOnline ? "soft-green" : "soft-red"}>
                  {service.isOnline ? s.online : s.officeOnly}
                </Badge>
                <Badge tone="outline">{category?.name}</Badge>
                <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500 ring-1 ring-line">
                  <ShieldCheck
                    className="h-3 w-3 text-brand-600"
                    aria-hidden="true"
                  />
                  {service.authority ?? service.department}
                </span>
              </div>
              <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {service.name}
              </h1>
              <p className="mt-2 max-w-2xl text-[15px] leading-7 text-slate-600">
                {service.longDescription ?? service.description}
              </p>
              <dl className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Building2
                    className="h-4 w-4 text-brand-600"
                    aria-hidden="true"
                  />
                  <dd>{service.department}</dd>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock
                    className="h-4 w-4 text-brand-600"
                    aria-hidden="true"
                  />
                  <dd>{service.processingTime ?? s.varies}</dd>
                </div>
                <div className="flex items-center gap-1.5">
                  <Coins
                    className="h-4 w-4 text-brand-600"
                    aria-hidden="true"
                  />
                  <dd>{service.fee ?? s.feeApplies}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
