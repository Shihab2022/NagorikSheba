"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useGoogleTranslate } from "@/features/translate/useGoogleTranslate";
import type { Lang as GTLang } from "@/features/translate/GoogleTranslateProvider";

export type Lang = GTLang;

export const LANGS: readonly Lang[] = ["en", "bn"] as const;
export const DEFAULT_LANG: Lang = "en";

/**
 * A localized bundle — every entry exists in both languages.
 */
export type Dict<T = string> = Record<Lang, T>;

type I18nValue = {
  /** Currently selected language ("en" by default). */
  lang: Lang;
  /** Switch the language. */
  setLang: (lang: Lang) => void;
  /** Swap between Bangla and English. */
  toggleLang: () => void;
  /**
   * Resolve a `{ bn, en }` bundle. Returns the English source text so the
   * DOM is rendered consistently for Google Translate without hydration or
   * DOM reconciliation mismatches.
   */
  t: <T>(dict: Dict<T>) => T;
};

const I18nContext = createContext<I18nValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  let gtLang: Lang = "en";
  let changeLanguage: (l: Lang) => void = () => {};

  try {
    const gt = useGoogleTranslate();
    gtLang = gt.lang;
    changeLanguage = gt.changeLanguage;
  } catch {
    // If mounted outside GoogleTranslateProvider, fallback gracefully
  }

  const toggleLang = useCallback(
    () => changeLanguage(gtLang === "bn" ? "en" : "bn"),
    [changeLanguage, gtLang],
  );

  const t = useCallback(<T,>(dict: Dict<T>): T => dict.en, []);

  const value = useMemo<I18nValue>(
    () => ({
      lang: gtLang,
      setLang: changeLanguage,
      toggleLang,
      t,
    }),
    [gtLang, changeLanguage, toggleLang, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** Access the active language and the `t()` translator. */
export function useTranslation(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within <LanguageProvider>");
  }
  return ctx;
}
