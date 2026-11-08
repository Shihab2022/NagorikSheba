"use client";

import { useGoogleTranslate } from "./useGoogleTranslate";
import { cn } from "@/lib/utils";

export type LanguageSwitcherProps = {
  className?: string;
  variant?: "navbar" | "mobile" | "default";
};

export default function LanguageSwitcher({
  className,
  variant = "navbar",
}: LanguageSwitcherProps) {
  const { lang, changeLanguage } = useGoogleTranslate();

  if (variant === "mobile") {
    return (
      <div
        className={cn(
          "notranslate flex items-center gap-1 rounded-lg bg-slate-100 p-1 text-xs font-semibold",
          className,
        )}
        translate="no"
        role="group"
        aria-label="Language selection"
      >
        <button
          type="button"
          aria-pressed={lang === "en"}
          onClick={() => lang !== "en" && changeLanguage("en")}
          className={cn(
            "rounded-md px-3 py-1 transition-all",
            lang === "en"
              ? "bg-white text-brand-800 shadow-sm font-bold"
              : "text-slate-600 hover:text-slate-900",
          )}
        >
          EN
        </button>
        <button
          type="button"
          aria-pressed={lang === "bn"}
          onClick={() => lang !== "bn" && changeLanguage("bn")}
          className={cn(
            "rounded-md px-3 py-1 transition-all",
            lang === "bn"
              ? "bg-white text-brand-800 shadow-sm font-bold"
              : "text-slate-600 hover:text-slate-900",
          )}
        >
          বাংলা
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "notranslate flex items-center rounded-lg bg-white/10 p-0.5 text-xs font-bold",
        className,
      )}
      translate="no"
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        aria-pressed={lang === "en"}
        onClick={() => lang !== "en" && changeLanguage("en")}
        className={cn(
          "rounded-md px-2.5 py-1 transition-all",
          lang === "en"
            ? "bg-white text-brand-800 shadow-sm"
            : "text-white/80 hover:text-white",
        )}
      >
        EN
      </button>
      <button
        type="button"
        aria-pressed={lang === "bn"}
        onClick={() => lang !== "bn" && changeLanguage("bn")}
        className={cn(
          "rounded-md px-2.5 py-1 transition-all",
          lang === "bn"
            ? "bg-white text-brand-800 shadow-sm"
            : "text-white/80 hover:text-white",
        )}
      >
        বাংলা
      </button>
    </div>
  );
}

export { LanguageSwitcher };
