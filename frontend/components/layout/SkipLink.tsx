"use client";

import { useTranslation, type Dict } from "@/lib/i18n";

const STRINGS = {
  bn: "মূল কন্টেন্টে যান",
  en: "Skip to main content",
} satisfies Dict<string>;

/** Accessibility skip link — translated with the active language. */
export function SkipLink() {
  const { t } = useTranslation();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-brand-800 focus:shadow-lg"
    >
      {t(STRINGS)}
    </a>
  );
}

export default SkipLink;
