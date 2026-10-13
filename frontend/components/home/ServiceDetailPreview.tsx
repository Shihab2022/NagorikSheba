"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Check,
  Clock,
  ExternalLink,
  Hourglass,
  ShieldCheck,
} from "lucide-react";
import { getServiceBySlug } from "@/lib/data/services";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { useTranslation, type Dict } from "@/lib/i18n";

const FACTS: Dict<string>[] = [
  { bn: "যোগ্যতা", en: "Eligibility" },
  { bn: "প্রয়োজনীয় ডকুমেন্ট", en: "Required Documents" },
  { bn: "সরকারি ফি", en: "Government Fee" },
  { bn: "আবেদন প্রক্রিয়া", en: "Application Process" },
];

const TIPS = [
  {
    icon: ShieldCheck,
    title: { bn: "নির্দেশনা, বিকল্প নয়", en: "Guidance, not a replacement" },
    text: {
      bn: "একসেবা কেবল নির্দেশনা ও সরকারি সিস্টেমের লিংক দেয় — আমরা নিজেরা আবেদন প্রক্রিয়া করি না।",
      en: "EkSheba provides guidance and links to official government systems — we never process applications ourselves.",
    },
  },
  {
    icon: Clock,
    title: { bn: "সবসময় পূর্বেই জানুন", en: "Always know what to expect" },
    text: {
      bn: "প্রক্রিয়াকরণের সময় ও অফিসের প্রয়োজনীয়তা আগে থেকেই দেখানো হয়, যাতে আবেদনের আগে পরিকল্পনা করতে পারেন।",
      en: "Processing time and office requirements are shown upfront so you can plan before you apply.",
    },
  },
  {
    icon: ExternalLink,
    title: { bn: "যাচাইকৃত অফিসিয়াল লিংক", en: "Verified official links" },
    text: {
      bn: "প্রতিটি সেবায় অফিসিয়াল উৎস ও সর্বশেষ যাচাইয়ের তারিখ থাকে, যেন তথ্য কোথা থেকে এল তা জানা যায়।",
      en: "Every service carries an Official Source and a Last Verified date so you know where the information came from.",
    },
  },
];

const STRINGS = {
  bn: {
    eyebrow: "প্রতিটি সেবা পাতায় যা থাকে",
    title: "প্রতিটি সেবায় পাবেন সম্পূর্ণ তথ্য",
    description:
      "যোগ্যতা, ডকুমেন্ট, ফি, প্রক্রিয়াকরণের সময়, ধাপে ধাপে প্রক্রিয়া ও অফিসিয়াল লিংক — সবকিছু এক জায়গায় সাজানো।",
    badge: "পরিচয় ও ডকুমেন্ট",
    nidServices: "→ NID সেবা",
    processing: "প্রক্রিয়াকরণ",
    authority: "কর্তৃপক্ষ",
    steps: "ধাপসমূহ",
    visitOfficial: "অফিসিয়াল সেবা দেখুন",
  },
  en: {
    eyebrow: "Inside every service page",
    title: "Complete information on every service",
    description:
      "Eligibility, documents, fees, processing time, step-by-step process and the official link — organized in one place.",
    badge: "Identity & Documents",
    nidServices: "→ NID Services",
    processing: "Processing",
    authority: "Authority",
    steps: "Steps",
    visitOfficial: "Visit Official Service",
  },
};

/** Teaser showing what every service detail page contains. */
export function ServiceDetailPreview() {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const service = getServiceBySlug("nid-correction");
  if (!service) return null;
  const steps = service.steps?.slice(0, 5) ?? [];

  return (
    <section aria-labelledby="preview-heading" className="relative overflow-hidden bg-brand-800">
      <div className="pattern-dots absolute inset-0 opacity-30" aria-hidden="true" />
      <div
        className="absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-flag-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading
            id="preview-heading"
            tone="white"
            eyebrow={s.eyebrow}
            title={s.title}
            description={s.description}
            align="left"
            className="max-w-2xl"
          />
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <Reveal>
            <div className="rounded-3xl border border-white/10 bg-white shadow-2xl">
              <div className="flex items-center gap-4 border-b border-line p-5 sm:p-6">
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <Icon name={service.icon} className="h-7 w-7" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="soft-green">{s.badge}</Badge>
                    <span className="text-xs font-medium text-slate-400">{s.nidServices}</span>
                  </div>
                  <h3 className="mt-1.5 text-xl font-extrabold text-slate-900">
                    {service.name}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
                {FACTS.map((label) => (
                  <div key={label.en} className="bg-white px-4 py-4 text-center">
                    <Check
                      className="mx-auto h-5 w-5 text-brand-600"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                    <p className="mt-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                      {t(label)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 p-5 sm:p-6">
                <div className="flex items-center justify-between rounded-xl bg-canvas px-4 py-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <Hourglass className="h-4 w-4 text-brand-600" aria-hidden="true" />
                    {s.processing}
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {service.processingTime}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-canvas px-4 py-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <Building2 className="h-4 w-4 text-brand-600" aria-hidden="true" />
                    {s.authority}
                  </span>
                  <span className="text-right text-sm font-bold text-slate-900">
                    {service.authority}
                  </span>
                </div>

                <div className="pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {s.steps}
                  </p>
                  <ol className="mt-3 grid gap-2 sm:grid-cols-2">
                    {steps.map((step, i) => (
                      <li
                        key={step}
                        className="flex items-start gap-2.5 rounded-xl border border-line px-3 py-2.5"
                      >
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-[11px] font-extrabold text-white">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-xs font-medium leading-5 text-slate-600">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="border-t border-line p-5 sm:p-6">
                <Link
                  href={`/services/${service.slug}`}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white transition-all hover:bg-brand-700 hover:shadow-md"
                >
                  {s.visitOfficial}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Reveal>
          {/* Explanation column */}
          <Reveal delay={120} className="space-y-4">
            {TIPS.map((item) => (
              <div
                key={item.title.en}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-flag-500 text-white">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">{t(item.title)}</h3>
                  <p className="mt-1 text-sm leading-6 text-brand-100/80">{t(item.text)}</p>
                </div>
              </div>
            ))}
          </Reveal>

        </div>
      </div>
    </section>
  );
}

export default ServiceDetailPreview;
