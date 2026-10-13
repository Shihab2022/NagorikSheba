"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Coins } from "lucide-react";
import { getServiceBySlug } from "@/lib/data/services";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslation, type Dict } from "@/lib/i18n";
import { COMMON } from "@/lib/i18n/common";

const FEE_ITEMS: { slug: string; label: Dict<string>; note: Dict<string> }[] = [
  {
    slug: "epassport-new",
    label: { bn: "পাসপোর্ট", en: "Passport" },
    note: { bn: "শুরুর মূল্য", en: "Starting from" },
  },
  {
    slug: "driving-license",
    label: { bn: "ড্রাইভিং লাইসেন্স", en: "Driving License" },
    note: { bn: "একটি ক্যাটাগরি", en: "One category" },
  },
  {
    slug: "land-mutation",
    label: { bn: "জমির নামজারি", en: "Land Mutation" },
    note: { bn: "জমির মূল্য অনুযায়ী", en: "Based on land value" },
  },
  {
    slug: "birth-registration",
    label: { bn: "জন্ম নিবন্ধন", en: "Birth Registration" },
    note: { bn: "৬০ দিনের মধ্যে", en: "Within 60 days" },
  },
];

const STRINGS = {
  bn: {
    eyebrow: "ফি নির্দেশিকা",
    title: "সরকারি ফি সম্পর্কে জানুন",
    description:
      "জনপ্রিয় সেবার আনুমানিক সরকারি ফি — পরিশোধের আগে সর্বদা নিশ্চিত করুন।",
    feesMayChange: "ফি পরিবর্তিত হতে পারে।",
    verifyLatest:
      "সর্বশেষ ফি সর্বদা সরকারি উৎস থেকে যাচাই করুন।",
    seeFullGuide: "সম্পূর্ণ ফি নির্দেশিকা দেখুন →",
  },
  en: {
    eyebrow: "Fee guide",
    title: "Know About Government Fees",
    description:
      "Indicative government fees for popular services — always confirm before paying.",
    feesMayChange: "Fees may change.",
    verifyLatest:
      "Always verify the latest fee from the official government source.",
    seeFullGuide: "See the full fee guide →",
  },
};

/** Government fee examples with the mandatory verification disclaimer. */
export function FeesSection() {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const c = t(COMMON);
  const items = FEE_ITEMS.map((item) => ({
    ...item,
    service: getServiceBySlug(item.slug),
  })).filter((item) => item.service);

  return (
    <section aria-labelledby="fees-heading" className="bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading
            id="fees-heading"
            eyebrow={s.eyebrow}
            title={s.title}
            description={s.description}
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.slug} delay={i * 70} className="h-full">
              <Link
                href={`/services/${item.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-transform group-hover:-translate-y-1">
                    <Icon name={item.service!.icon} className="h-5 w-5" />
                  </span>
                  <Coins className="h-5 w-5 text-flag-500 transition-transform group-hover:scale-110" aria-hidden="true" />
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t(item.label)}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-400">{t(item.note)}</p>
                <p className="mt-2 text-lg font-extrabold leading-6 text-slate-900 group-hover:text-brand-700">
                  {item.service!.fee}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
                  {c.viewDetails}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-flag-200 bg-flag-50 p-5">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-flag-500 text-white">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="text-sm leading-6 text-flag-800">
              <strong className="font-bold">{s.feesMayChange}</strong> {s.verifyLatest}{" "}
              <Link
                href="/fees"
                className="font-bold underline decoration-flag-400 underline-offset-2 hover:text-flag-900"
              >
                {s.seeFullGuide}
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default FeesSection;
