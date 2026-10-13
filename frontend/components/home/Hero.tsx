"use client";

import Link from "next/link";
import { ArrowRight, Check, Clock, FileText, Search, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslation, type Dict } from "@/lib/i18n";
import { COMMON } from "@/lib/i18n/common";

const CHECKLIST = [
  { icon: FileText, label: { bn: "প্রয়োজনীয় কাগজপত্র", en: "Required Documents" } },
  { icon: ShieldCheck, label: { bn: "যোগ্যতা", en: "Eligibility" } },
  { icon: Check, label: { bn: "সরকারি ফি", en: "Government Fee" } },
  { icon: Clock, label: { bn: "আবেদন প্রক্রিয়া", en: "Application Process" } },
] satisfies { icon: typeof FileText; label: Dict<string> }[];

const STATS = [
  { value: "120+", label: { bn: "সেবা", en: "Services" } },
  { value: "64", label: { bn: "জেলা", en: "Districts" } },
  { value: "10", label: { bn: "অফিসের ধরন", en: "Office types" } },
] satisfies { value: string; label: Dict<string> }[];

const STRINGS = {
  bn: {
    badge: "নাগরিক সেবার সহজ পথ",
    titleTop: "সরকারি সেবা খুঁজুন,",
    titleMid: "সহজেই বুঝুন,",
    titleEnd: "দ্রুত করুন।",
    subtitle:
      "প্রয়োজনীয় সরকারি সেবা খুঁজুন, প্রক্রিয়া বুঝুন এবং অফিসিয়াল সেবায় পৌঁছে যান।",
    howItWorks: "কীভাবে কাজ করে?",
    cardTitle: "আপনি কোন সেবা খুঁজছেন?",
    example: "পাসপোর্ট নবায়ন",
    guidance:
      "শুধুমাত্র নির্দেশনা — আবেদন জমা দেওয়া হয় সরকারি সরকারি পোর্টালে।",
    officialLinks: "অফিসিয়াল লিংক",
    lastVerified: "সর্বশেষ যাচাই: অক্টোবর ২০২৬",
  },
  en: {
    badge: "The easy path to citizen services",
    titleTop: "Find government services,",
    titleMid: "understand easily,",
    titleEnd: "act fast.",
    subtitle:
      "Find the government service you need, understand the process, and access the official service.",
    howItWorks: "How does it work?",
    cardTitle: "What service are you looking for?",
    example: "Passport Renewal",
    guidance:
      "Guidance only — applications are submitted on official government portals.",
    officialLinks: "Official links",
    lastVerified: "Last verified Oct 2026",
  },
};

export function Hero() {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const c = t(COMMON);
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-brand-700 text-white"
    >
      {/* Abstract Bangladesh-inspired backdrop: grid, discs, soft shapes */}
      <div className="pattern-grid absolute inset-0 opacity-30" aria-hidden="true" />
      <div
        className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-brand-600/60 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute right-[6%] top-10 h-40 w-40 rounded-full bg-flag-500/20 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="absolute right-[18%] bottom-16 h-7 w-7 rounded-full bg-flag-500 shadow-lg"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        {/* Left column */}
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-brand-50 backdrop-blur">
              <span aria-hidden="true">🇧🇩</span>
              {s.badge}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1
              id="hero-heading"
              className="mt-6 text-3xl font-extrabold leading-[1.2] tracking-tight sm:text-4xl lg:text-5xl xl:text-[3.4rem]"
            >
              {s.titleTop}
              <br />
              <span className="text-brand-100">{s.titleMid}</span>{" "}
              <span className="relative inline-block">
                {s.titleEnd}
                <span
                  className="absolute -bottom-1.5 left-0 h-1.5 w-full rounded-full bg-flag-500/80"
                  aria-hidden="true"
                />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-6 max-w-xl text-base leading-7 text-brand-50/85 sm:text-lg">
              {s.subtitle}
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/services"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-base font-bold text-brand-800 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {c.searchServices}
                <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {s.howItWorks}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={260}>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {STATS.map((stat) => (
                <div key={stat.value}>
                  <dt className="sr-only">{t(stat.label)}</dt>
                  <dd className="text-2xl font-extrabold text-white">{stat.value}</dd>
                  <dd className="mt-0.5 text-xs font-medium uppercase tracking-wider text-brand-200">
                    {t(stat.label)}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
        {/* Right column — Government Service Navigator Card */}
        <Reveal delay={120} className="relative">
          <div className="relative rounded-3xl border border-white/15 bg-white p-5 text-slate-900 shadow-2xl sm:p-7">
            <span
              className="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-flag-500 shadow-lg"
              aria-hidden="true"
            />

            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Search className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900 sm:text-base">
                  {s.cardTitle}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-line bg-canvas px-4 py-3.5">
              <span className="text-[15px] font-semibold text-slate-800">{s.example}</span>
              <span
                className="ms-1 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-brand-600"
                aria-hidden="true"
              />
            </div>

            <ul className="mt-5 space-y-3">
              {CHECKLIST.map((item) => (
                <li key={item.label.en} className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-slate-700">{t(item.label)}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/services/passport-renewal"
              className="group mt-6 flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-700 hover:shadow-lg"
            >
              {c.viewService}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>

            <p className="mt-3 text-center text-[11px] leading-4 text-slate-400">
              {s.guidance}
            </p>
          </div>

          <div className="absolute -bottom-4 -left-3 hidden rounded-xl border border-line bg-white px-3.5 py-2.5 shadow-lg sm:flex sm:items-center sm:gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-xs font-bold text-slate-700">
              {s.officialLinks}
              <span className="block font-medium text-slate-400">{s.lastVerified}</span>
            </span>
          </div>
        </Reveal>

      </div>
    </section>
  );
}

export default Hero;
