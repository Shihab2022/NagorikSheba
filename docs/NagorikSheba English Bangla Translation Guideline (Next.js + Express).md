# NagorikSheba: English/Bangla Translation Guideline (Next.js + Express)

Implementation brief for Antigravity. Follow the steps in order and respect the rules and acceptance criteria.

## 1. Goal

Add a free, site-wide English and Bangla (bn) language switch to the Next.js app using the **Google Translate website widget**. The widget translates the rendered page (including data fetched from the Express API) in the browser. No translation JSON files and no paid API.

## 2. Constraints

- Only two languages: `en` (default, source language) and `bn`.
- Do **not** install i18next, react-i18next, or any translation npm package. The only external dependency is Google's script loaded at runtime.
- Do **not** use Google's default dropdown UI. Build our own switcher and hide Google's UI.
- The Express backend needs no translation logic (see section 8).
- The app must work normally in English if the Google script is blocked or fails to load.
- First detect whether the project uses the **App Router** (`app/`) or **Pages Router** (`pages/`) and place files accordingly. Detect whether the project uses TypeScript and match it.

## 3. Files to create

```
src/features/translate/
  GoogleTranslateProvider.tsx   // client component: loads script, holds state
  useGoogleTranslate.ts         // hook to read/change language
  LanguageSwitcher.tsx          // our own EN | বাংলা toggle
  NoTranslate.tsx               // wrapper for text that must not be translated
  translate.css                 // hides Google UI
```

Adjust the base path to the project's existing structure (`src/` or root).

## 4. Provider

`GoogleTranslateProvider.tsx` must be a client component (`"use client"` at the top).

```tsx
"use client";
import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "bn";
export const TranslateContext = createContext<{
  lang: Lang;
  changeLanguage: (l: Lang) => void;
} | null>(null);

const readLang = (): Lang =>
  /(?:^|;\s*)googtrans=\/en\/bn/.test(document.cookie) ? "bn" : "en";

function writeCookie(lang: Lang) {
  const host = window.location.hostname;
  const domains = host === "localhost" ? [""] : ["", `; domain=${host}`, `; domain=.${host}`];
  const past = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  domains.forEach((d) => {
    document.cookie =
      lang === "bn"
        ? `googtrans=/en/bn; path=/${d}`
        : `googtrans=; ${past}; path=/${d}`;
  });
}

export default function GoogleTranslateProvider({ children }: { children: ReactNode }) {
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
```

`useGoogleTranslate.ts`:

```ts
"use client";
import { useContext } from "react";
import { TranslateContext } from "./GoogleTranslateProvider";

export const useGoogleTranslate = () => {
  const ctx = useContext(TranslateContext);
  if (!ctx) throw new Error("useGoogleTranslate must be used inside GoogleTranslateProvider");
  return ctx;
};
```

## 5. Switcher and NoTranslate wrapper

```tsx
// LanguageSwitcher.tsx
"use client";
import { useGoogleTranslate } from "./useGoogleTranslate";

export default function LanguageSwitcher() {
  const { lang, changeLanguage } = useGoogleTranslate();
  return (
    <div className="notranslate" translate="no">
      <button aria-pressed={lang === "en"} onClick={() => lang !== "en" && changeLanguage("en")}>EN</button>
      <button aria-pressed={lang === "bn"} onClick={() => lang !== "bn" && changeLanguage("bn")}>বাংলা</button>
    </div>
  );
}
```

Style the buttons with the project's existing styling system (Tailwind/daisyUI if present).

```tsx
// NoTranslate.tsx
import type { ReactNode } from "react";
export default function NoTranslate({ children }: { children: ReactNode }) {
  return <span className="notranslate" translate="no">{children}</span>;
}
```

## 6. CSS (hide Google's UI)

Import `translate.css` globally.

```css
.gt-hidden { position: absolute; left: -9999px; top: 0; }
body > .skiptranslate { display: none !important; }
iframe.goog-te-banner-frame { display: none !important; }
body { top: 0 !important; }
.goog-tooltip, .goog-tooltip:hover { display: none !important; }
.goog-text-highlight { background: none !important; box-shadow: none !important; }
```

## 7. Wiring into Next.js

- **App Router:** wrap `{children}` with `<GoogleTranslateProvider>` in the root `app/layout.tsx` (it is a client component imported into a server layout, which is allowed). Add `suppressHydrationWarning` to `<html>` and `<body>`, because Google modifies attributes on them.
- **Pages Router:** wrap `<Component />` in `pages/_app.tsx`.
- Put `<LanguageSwitcher />` in the main navbar **and** in the mobile menu.
- Do **not** set `translate="no"` on `<html>` or `<body>`. That disables the whole feature.
- Keep `<html lang="en">`. Do not change it dynamically.
- If a Content-Security-Policy is configured, allow `translate.google.com`, `translate.googleapis.com`, `www.gstatic.com`, and `fonts.googleapis.com`.
- Add a Bangla-capable font with `next/font/google` (for example `Noto_Sans_Bengali` with subsets `["bengali", "latin"]`) and include it in the body font stack so Bangla text does not fall back to an ugly system font.

## 8. Express backend rules (no translation code needed)

- Do not translate anything on the server and do not add a translation library.
- Return **stable codes and enums** for statuses, categories, and errors (for example `"code": "INVALID_CARD"`), not only English sentences. The frontend can map known codes to display text later if quality matters.
- Keep raw values (ISO dates, numbers, currency codes) in API responses. Format them on the client with `Intl` using locale `bn-BD` when Bangla is active, since Google does not convert digits or date formats reliably.

## 9. What must NOT be translated (add `notranslate` / `<NoTranslate>`)

- Brand name "NagorikSheba"
- Personal names, usernames, and user-entered text
- ID and reference numbers (for example application or tracking IDs), phone numbers, and amounts or currency codes
- Email addresses, code snippets, language names in the switcher
- Any text where a wrong machine translation has legal or payment impact

For Next.js, apply this in the shared components (navbar logo, name and ID displays) so every page gets it by default.

## 10. Known limits (do not try to fix; just keep in mind)

- Text inside iframes (embedded third-party widgets, payment forms, players) is not translated.
- Video subtitles are not translated by this tool; they need separate `.vtt` files.
- Text in images or canvas is not translated.
- `placeholder` and `title` attributes may be missed; do not attempt hacks.
- Search engines index only the English page.
- The server always renders English first, so a brief English flash before Bangla appears is expected.

## 11. Coding rules for the whole team

- Wrap text in elements (`<span>{label}</span>`) instead of mixing loose text nodes with sibling JSX.
- Never read `document.cookie` or `window` during render. Only inside `useEffect` or event handlers.
- Mount `#google_translate_element` exactly once (inside the provider only).
- Never build sentences by concatenating translated fragments; keep full sentences in one element.

## 12. Acceptance criteria

1. Language toggle is visible on desktop and mobile; default is English.
2. Clicking বাংলা translates the current page, including data loaded from Express.
3. Navigating to other routes (client-side navigation) keeps Bangla active and translates new content.
4. Refreshing the page keeps the selected language.
5. Clicking EN restores the original English with nothing left translated.
6. No Google banner, tooltip, or default dropdown is visible.
7. Brand name, personal names, ID numbers, and amounts stay untranslated.
8. No `removeChild`, `insertBefore`, or hydration errors in the browser console during switching and navigation.
9. With the Google script blocked (DevTools network blocking), the app still works in English.
10. `next build` passes with no type or lint errors.

## 13. Deliverables

- The five files in section 3, wired into the layout and navbar.
- Brand, name, and ID display components updated with `notranslate`.
- A short note in the README describing how to mark text as untranslatable and the limits in section 10.
