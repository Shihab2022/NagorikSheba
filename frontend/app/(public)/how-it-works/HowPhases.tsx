"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { useTranslation, type Dict } from "@/lib/i18n";
const PHASES: { step: string; title: Dict<string>; bn: string; description: Dict<string>; icon: string; href: string; cta: Dict<string> }[] = [
  { step: "01", title: { bn: "খুঁজুন", en: "Discover" }, bn: "সেবা খুঁজুন",
    description: { bn: "ক্যাটাগরি অনুযায়ী শত শত সরকারি সেবা খুঁজুন — NID, পাসপোর্ট, ভূমি, করসহ।", en: "Search or browse hundreds of government services organized by category — from NID and passports to land and tax." },
    icon: "LayoutGrid", href: "/services", cta: { bn: "সেবা দেখুন", en: "Browse services" } },
  { step: "02", title: { bn: "বুঝুন", en: "Understand" }, bn: "যোগ্যতা ও প্রয়োজনীয় কাগজপত্র দেখুন",
    description: { bn: "প্রতিটি সেবা পাতায় যোগ্যতা, ডকুমেন্ট, ফি সহজ ভাষায় ব্যাখ্যা করা।", en: "Every service page explains eligibility, required documents, fees and processing time in simple language." },
    icon: "BookOpen", href: "/documents", cta: { bn: "ডকুমেন্ট চেকলিস্ট", en: "Document checklists" } },
  { step: "03", title: { bn: "প্রস্তুতি", en: "Prepare" }, bn: "ধাপে ধাপে প্রক্রিয়া অনুসরণ করুন",
    description: { bn: "স্পষ্ট ধাপ অনুসরণ করুন, অফিস বা পোর্টালে যাওয়ার আগেই সব কাগজ তৈরি রাখুন।", en: "Follow a clear numbered procedure and prepare every document before you visit an office or portal." },
    icon: "ScrollText", href: "/fees", cta: { bn: "ফি নির্দেশিকা", en: "Check fee guide" } },
  { step: "04", title: { bn: "আবেদন", en: "Apply" }, bn: "অফিসিয়াল সেবায় আবেদন করুন",
    description: { bn: "অফিসিয়াল লিংকে সরকারি পোর্টালে আবেদন করুন বা প্রস্তুতি নিয়ে সঠিক অফিসে যান।", en: "Use the official source link to apply on the government portal, or visit the right office with everything ready." },
    icon: "Building2", href: "/government-offices", cta: { bn: "অফিস খুঁজুন", en: "Find offices" } },
  { step: "05", title: { bn: "ট্র্যাক", en: "Track" }, bn: "আপনার আবেদন ট্র্যাক করুন",
    description: { bn: "আবেদন আইডি নিরাপদে রাখুন, সেবা না পাওয়া পর্যন্ত অফিসিয়াল চ্যানেলে ফলোআপ করুন।", en: "Keep your application ID safe and follow up through the official channel until your service is delivered." },
    icon: "Clock", href: "/application-tracker", cta: { bn: "আবেদন ট্র্যাক করুন", en: "Track application" } },
];
export function HowPhases() {
  const { t } = useTranslation();
  return (
    <ol className="relative space-y-8 before:absolute before:top-2 before:bottom-2 before:left-[27px] before:w-0.5 before:bg-brand-100 sm:before:left-[31px]">
      {PHASES.map((phase) => (
        <li key={phase.step} className="relative flex gap-5 sm:gap-7">
          <span className="relative z-10 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-base font-extrabold text-white shadow-card sm:h-16 sm:w-16">
            {phase.step}
          </span>
          <div className="flex-1 rounded-2xl border border-line bg-white p-5 shadow-card transition-shadow duration-300 hover:shadow-card-hover sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Icon name={phase.icon} className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                {t(phase.title)} <span className="text-slate-400">·</span>{" "}
                <span className="text-brand-700">{phase.bn}</span>
              </h2>
            </div>
            <p className="mt-3 text-[15px] leading-7 text-slate-600">{t(phase.description)}</p>
            <Link href={phase.href} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800">
              {t(phase.cta)}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}
