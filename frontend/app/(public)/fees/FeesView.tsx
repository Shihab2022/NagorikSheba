"use client";

import Link from "next/link";
import { ArrowRight, BadgeAlert, ExternalLink } from "lucide-react";
import { SERVICES } from "@/lib/data/services";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { DemoNote } from "@/components/ui/States";
import { useTranslation } from "@/lib/i18n";

const STRINGS = {
  bn: {
    title: "সরকারি ফি সম্পর্কে জানুন",
    description: "এক নজরে আনুমানিক ফি — আবেদনের আগে বাজেট তৈরি করতে পারেন।",
    home: "হোম",
    fees: "ফি",
    processing: "প্রক্রিয়াকরণ",
    varies: "বিভিন্ন",
    details: "বিস্তারিত",
    official: "অফিসিয়াল",
    feesMayChange:
      "ফি পরিবর্তিত হতে পারে। পরিশোধের আগে সর্বশেষ ফি সর্বদা সরকারি উৎস থেকে যাচাই করুন।",
  },
  en: {
    title: "Know About Government Fees",
    description: "Indicative fees at a glance — so you can budget before you apply.",
    home: "Home",
    fees: "Fees",
    processing: "Processing",
    varies: "Varies",
    details: "Details",
    official: "Official",
    feesMayChange:
      "Fees may change. Always verify the latest fee from the official government source before paying.",
  },
};

export function FeesView() {
  const { t } = useTranslation();
  const s = t(STRINGS);
  return (
    <>
      <PageHeader
        title={s.title}
        description={s.description}
        breadcrumbs={[{ label: s.home, href: "/" }, { label: s.fees }]}
      />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6"><DemoNote /></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.slice(0, 12).map((svc) => (
            <article key={svc.id} className="group rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover sm:p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-transform group-hover:scale-105">
                <Icon name={svc.icon} className="h-[22px] w-[22px]" />
              </span>
              <h2 className="mt-3 text-base font-extrabold text-slate-900">{svc.name}</h2>
              <p className="mt-1 text-2xl font-extrabold tracking-tight text-brand-700">{svc.fee ?? "—"}</p>
              <p className="mt-1 text-xs font-medium text-slate-400">{s.processing}: {svc.processingTime ?? s.varies}</p>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                <Link href={`/services/${svc.slug}`} className="inline-flex items-center gap-1 text-sm font-bold text-brand-700 hover:text-brand-800">
                  {s.details} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                {svc.officialUrl ? (
                  <a href={svc.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-brand-700">
                    {s.official} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <BadgeAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
          <p className="text-sm leading-6 font-medium text-amber-900">
            {s.feesMayChange}
          </p>
        </div>
      </div>
    </>
  );
}

export default FeesView;
