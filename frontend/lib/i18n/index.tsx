"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Lightweight i18n for NagorikSheba — no external dependencies.
 * Exactly two languages are supported: Bangla (bn) and English (en),
 * with Bangla as the default.
 */
export type Lang = "bn" | "en";

export const LANGS: readonly Lang[] = ["bn", "en"] as const;
export const DEFAULT_LANG: Lang = "bn";
const STORAGE_KEY = "nagoriksheba.lang";

/**
 * A localized bundle — every entry exists in both languages, so the
 * TypeScript compiler catches any missing translation at the usage site.
 */
export type Dict<T = string> = Record<Lang, T>;

type I18nValue = {
  /** Currently selected language ("bn" by default). */
  lang: Lang;
  /** Switch the language. */
  setLang: (lang: Lang) => void;
  /** Swap between Bangla and English. */
  toggleLang: () => void;
  /** Resolve a `{ bn, en }` bundle to the active language's value. */
  t: <T>(dict: Dict<T>) => T;
};

const I18nContext = createContext<I18nValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Hydrate the stored preference after mount — the server always renders the default.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "bn" || stored === "en") {
        setTimeout(() => setLangState(stored), 0);
      }
    } catch {
      /* storage unavailable — keep the default */
    }
  }, []);

  // Keep <html lang> and the persisted preference in sync with the state.
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* storage unavailable — ignore */
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggleLang = useCallback(
    () => setLangState((current) => (current === "bn" ? "en" : "bn")),
    [],
  );
  const t = useCallback(<T,>(dict: Dict<T>): T => dict[lang], [lang]);

  const value = useMemo<I18nValue>(
    () => ({ lang, setLang, toggleLang, t }),
    [lang, setLang, toggleLang, t],
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
