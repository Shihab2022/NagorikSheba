"use client";
import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "bn";
export const TranslateContext = createContext<{
  lang: Lang;
  changeLanguage: (l: Lang) => void;
} | null>(null);

const readLang = (): Lang =>
  /(?:^|;\s*)googtrans=\/en\/bn/.test(typeof document !== "undefined" ? document.cookie : "") ? "bn" : "en";

function writeCookie(lang: Lang) {
  if (typeof window === "undefined") return;
  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1" || /^192\.168\./.test(host);
  const domains = isLocal ? [""] : ["", `; domain=${host}`, `; domain=.${host}`];
  const past = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  domains.forEach((d) => {
    document.cookie =
      lang === "bn"
        ? `googtrans=/en/bn; path=/${d}`
        : `googtrans=; ${past}; path=/${d}`;
  });
}

export function GoogleTranslateProvider({ children }: { children: ReactNode }) {
  // Always start as "en" so server and client markup match (no hydration mismatch)
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    setLang(readLang());

    // Prevent React crashes caused by Google rewriting the DOM
    if (!(window as any).__gtPatched) {
      (window as any).__gtPatched = true;
      const rc = Node.prototype.removeChild;
      Node.prototype.removeChild = function <T extends Node>(child: T): T {
        if (child.parentNode !== this) return child;
        return rc.call(this, child) as T;
      };
      const ib = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function <T extends Node>(n: T, ref: Node | null): T {
        if (ref && ref.parentNode !== this) return n;
        return ib.call(this, n, ref) as T;
      };
    }

    // Load the Google script exactly once (guards against React Strict Mode double effects)
    if (document.getElementById("gt-script")) return;
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: "en", includedLanguages: "en,bn", autoDisplay: false },
        "google_translate_element"
      );
    };
    const s = document.createElement("script");
    s.id = "gt-script";
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  const changeLanguage = useCallback((next: Lang) => {
    setLang(next);
    writeCookie(next);
    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (next === "bn" && combo) {
      combo.value = "bn";
      combo.dispatchEvent(new Event("change"));
    } else {
      // Back to English, or widget not ready yet: reload is the most reliable
      window.location.reload();
    }
  }, []);

  return (
    <TranslateContext.Provider value={{ lang, changeLanguage }}>
      <div id="google_translate_element" className="gt-hidden notranslate" />
      {children}
    </TranslateContext.Provider>
  );
}

export default GoogleTranslateProvider;
