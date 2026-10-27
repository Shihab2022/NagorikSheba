"use client";
import Link from "next/link";
import { SearchX } from "lucide-react";
import type { GovernmentService, ServiceCategory } from "@/lib/types";
import { ServiceCard } from "@/components/services/ServiceCard";
import { EmptyState } from "@/components/ui/States";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslation } from "@/lib/i18n";

const STRINGS = {
  bn: {
    listed: "টি সেবা তালিকাভুক্ত",
    expected: "পূর্ণ ডিরেক্টরিতে প্রত্যাশিত",
    browseAll: "সব সেবা দেখুন →",
    noServices: "কোনো সেবা পাওয়া যায়নি।",
    tryFilters: "অনুসন্ধান বা ফিল্টার বদলে দেখুন।",
    back: "সেবায় ফিরুন",
  },
  en: {
    listed: "services listed in this category ·",
    expected: "expected in the full directory",
    browseAll: "Browse all services →",
    noServices: "No services found.",
    tryFilters: "Try changing your search or filters.",
    back: "Back to services",
  },
};

export function CatDetailBody({
  category,
  services,
}: {
  category: ServiceCategory;
  services: GovernmentService[];
}) {
  const { t } = useTranslation();
  const s = t(STRINGS);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500" role="status">
          <strong className="text-slate-800">{services.length}</strong> {s.listed}
        </p>
        <Link
          href="/services"
          className="text-sm font-bold text-brand-700 hover:text-brand-800"
        >
          {s.browseAll}
        </Link>
      </div>
      {services.length === 0 ? (
        <EmptyState
          title={s.noServices}
          description={s.tryFilters}
          icon={<SearchX className="h-7 w-7" aria-hidden="true" />}
          action={
            <Link
              href="/services"
              className="inline-flex h-10 items-center rounded-xl bg-brand-600 px-4 text-sm font-bold text-white"
            >
              {s.back}
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={(i % 3) * 60} className="h-full">
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
