"use client";

import Link from "next/link";
import { AlertCircle, HeartHandshake } from "lucide-react";
import Logo, { LogoMark } from "@/components/ui/Logo";
import { useTranslation, type Dict } from "@/lib/i18n";

const COLUMNS: {
  title: Dict<string>;
  links: { label: Dict<string>; href: string }[];
}[] = [
  {
    title: { bn: "সেবা", en: "Services" },
    links: [
      { href: "/categories", label: { bn: "ক্যাটাগরি", en: "Categories" } },
      {
        href: "/government-offices",
        label: { bn: "সরকারি অফিস", en: "Government Offices" },
      },
      { href: "/notices", label: { bn: "নোটিশ", en: "Notices" } },
      {
        href: "/application-tracker",
        label: { bn: "আবেদন ট্র্যাকিং", en: "Application Tracking" },
      },
      {
        href: "/ai-assistant",
        label: { bn: "এআই সহকারী", en: "AI Assistant" },
      },
    ],
  },
  {
    title: { bn: "রিসোর্স", en: "Resources" },
    links: [
      {
        href: "/how-it-works",
        label: { bn: "কীভাবে কাজ করে", en: "How It Works" },
      },
      { href: "/faq", label: { bn: "সাধারণ জিজ্ঞাসা", en: "FAQ" } },
      { href: "/documents", label: { bn: "ডকুমেন্ট", en: "Documents" } },
      { href: "/fees", label: { bn: "ফি", en: "Fees" } },
      { href: "/contact", label: { bn: "সাহায্য", en: "Help" } },
    ],
  },
  {
    title: { bn: "প্রতিষ্ঠান", en: "Company" },
    links: [
      { href: "/about", label: { bn: "আমাদের কথা", en: "About" } },
      { href: "/contact", label: { bn: "যোগাযোগ", en: "Contact" } },
      {
        href: "/about",
        label: { bn: "প্রাইভেসি পলিসি", en: "Privacy Policy" },
      },
      { href: "/about", label: { bn: "শর্তাবলি", en: "Terms" } },
    ],
  },
];

const STRINGS = {
  bn: {
    tagline: "বাংলাদেশের সরকারি সেবার এক ঠিকানা",
    about:
      "সরকারি সেবা আবিষ্কার করুন, যোগ্যতা, ডকুমেন্ট, ফি ও ধাপে ধাপে প্রক্রিয়া বুঝুন — তারপর অফিসিয়াল পোর্টালে পৌঁছে যান।",

    rights: "© ২০২৬ Nagorik Sheba । সর্বস্বত্ব সংরক্ষিত।",
    madeWith: "তৈরি করা হয়েছে",
    madeFor: "বাংলাদেশের নাগরিকদের জন্য",
  },
  en: {
    tagline: "Bangladesh Government Services, One Place",
    about:
      "Discover government services, understand eligibility, documents, fees and step-by-step procedures — then reach the official portal.",

    rights: "© 2026 Nagorik Sheba. All rights reserved.",
    madeWith: "Made with",
    madeFor: "for the citizens of Bangladesh",
  },
};

export function Footer() {
  const { t } = useTranslation();
  const s = t(STRINGS);
  return (
    <footer className="relative overflow-hidden bg-brand-800 text-brand-50">
      {/* subtle dot grid + red disc accent */}
      <div
        className="pattern-dots absolute inset-0 opacity-40"
        aria-hidden="true"
      />
      <div
        className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-flag-500/10 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <Logo tone="light" />
            </div>
            <p className="mt-4 text-sm leading-6 text-brand-100/85">
              {s.tagline}
            </p>
            <p className="mt-3 text-sm leading-6 text-brand-100/70">
              {s.about}
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <nav key={col.title.en} aria-label={t(col.title)}>
              <h2 className="text-sm font-bold uppercase tracking-widest text-white">
                {t(col.title)}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label.en}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 rounded text-sm text-brand-100/80 transition-colors hover:text-white"
                    >
                      <span
                        className="h-1 w-1 rounded-full bg-flag-500 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Important disclaimer */}

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-brand-100/70 sm:flex-row">
          <p>{s.rights}</p>
          <p className="flex items-center gap-1.5">
            {s.madeWith}
            <HeartHandshake
              className="h-4 w-4 text-flag-500"
              aria-hidden="true"
            />
            {s.madeFor}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
