"use client";

import Link from "next/link";
import { ArrowLeft, Home, Search, Compass, FileText, HelpCircle, ShieldAlert } from "lucide-react";
import { T } from "@/components/ui/T";
import { useTranslation } from "@/lib/i18n";

const POPULAR_LINKS = [
  {
    href: "/services/epassport-new",
    label: { bn: "ই-পাসপোর্ট আবেদন", en: "e-Passport Application" },
    icon: Compass,
  },
  {
    href: "/services/nid-correction",
    label: { bn: "জাতীয় পরিচয়পত্র সংশোধন", en: "NID Card Correction" },
    icon: FileText,
  },
  {
    href: "/services/birth-registration",
    label: { bn: "জন্ম নিবন্ধন", en: "Birth Registration" },
    icon: Compass,
  },
  {
    href: "/faq",
    label: { bn: "সাধারণ জিজ্ঞাসা (FAQ)", en: "Frequently Asked Questions" },
    icon: HelpCircle,
  },
];

export default function NotFound() {
  const { lang } = useTranslation();

  return (
    <div className="relative min-h-[75vh] flex items-center justify-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8 bg-gradient-to-b from-canvas/40 via-white to-canvas/20">
      {/* Decorative background glow */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center -z-10"
        aria-hidden="true"
      >
        <div className="h-96 w-96 rounded-full bg-brand-50/70 blur-3xl opacity-60" />
        <div className="h-72 w-72 rounded-full bg-emerald-50/50 blur-2xl opacity-40 ml-40 mt-20" />
      </div>

      <div className="mx-auto w-full max-w-2xl text-center">
        {/* Badge & 404 Visual */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold uppercase tracking-wider mb-6">
          <ShieldAlert className="h-4 w-4 text-brand-600" />
          <span>Error 404</span>
        </div>

        <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight text-brand-900 font-mono">
          404
        </h1>

        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          <T bn="পাতাটি খুঁজে পাওয়া যায়নি" en="Page Not Found" />
        </h2>

        <p className="mt-3 text-base text-slate-600 max-w-md mx-auto leading-relaxed">
          <T
            bn="দুঃখিত, আপনি যে পাতাটি খুঁজছেন তা মুছে ফেলা হয়েছে, স্থানান্তর করা হয়েছে অথবা ভুল ঠিকানায় প্রবেশ করেছেন।"
            en="Sorry, the page you are looking for doesn't exist, has been moved, or the link may be mistyped."
          />
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-700 transition-all hover:shadow focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            <Home className="h-4 w-4" />
            <T bn="হোমপেজে যান" en="Go to Homepage" />
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            <Compass className="h-4 w-4 text-brand-600" />
            <T bn="সকল সেবা ব্রাউজ করুন" en="Browse All Services" />
          </Link>

          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            <Search className="h-4 w-4 text-slate-400" />
            <T bn="অনুসন্ধান করুন" en="Search Services" />
          </Link>
        </div>

        {/* Popular / Helpful Quick Links */}
        <div className="mt-12 pt-8 border-t border-line/80">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            <T bn="প্রয়োজনীয় কিছু দ্রুত লিংক:" en="Quick helpful links:" />
          </p>

          <div className="grid gap-2.5 sm:grid-cols-2 text-left">
            {POPULAR_LINKS.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className="group flex items-center justify-between p-3 rounded-xl border border-line/60 bg-white hover:border-brand-300 hover:bg-brand-50/30 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-500 group-hover:bg-brand-100 group-hover:text-brand-700 transition-colors shrink-0">
                      <IconComponent className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-brand-800 truncate transition-colors">
                      <T bn={item.label.bn} en={item.label.en} />
                    </span>
                  </div>
                  <span className="text-slate-300 group-hover:text-brand-500 text-xs font-bold transition-transform group-hover:translate-x-0.5 ml-2">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
