"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { FileSearch, LayoutDashboard, LogIn, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation, type Dict } from "@/lib/i18n";
import { COMMON } from "@/lib/i18n/common";

type NavLink = { label: Dict<string>; href: string };

const STRINGS = {
  bn: {
    menu: "মেনু",
    closeMenu: "মেনু বন্ধ করুন",
    dashboard: "ড্যাশবোর্ড",
    documentChecklist: "ডকুমেন্ট চেকলিস্ট",
  },
  en: {
    menu: "Menu",
    closeMenu: "Close menu",
    dashboard: "Dashboard",
    documentChecklist: "Document Checklist",
  },
};

/**
 * Slide-in drawer navigation for mobile & tablet.
 * Closes on Escape, backdrop click and route change (see Navbar).
 */
export function MobileMenu({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
}) {
  const pathname = usePathname();
  const { lang, setLang, t } = useTranslation();
  const c = t(COMMON);
  const s = t(STRINGS);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      className={cn(
        "fixed inset-0 z-[60] xl:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-slate-900/50 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cn(
          "absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-brand-800 shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <span className="text-sm font-bold uppercase tracking-widest text-brand-200">
            {s.menu}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={s.closeMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
          <ul className="space-y-1">
            {links.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-semibold transition-colors",
                      active
                        ? "bg-white/10 text-white"
                        : "text-brand-50/85 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <span>{t(link.label)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 space-y-1 border-t border-white/10 pt-4">
            <Link
              href="/search"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-brand-50/85 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Search className="h-[18px] w-[18px]" aria-hidden="true" />
              {c.searchServices}
            </Link>
            <Link
              href="/dashboard"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-brand-50/85 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LayoutDashboard
                className="h-[18px] w-[18px]"
                aria-hidden="true"
              />
              {s.dashboard}
            </Link>
            <Link
              href="/documents"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-brand-50/85 transition-colors hover:bg-white/5 hover:text-white"
            >
              <FileSearch className="h-[18px] w-[18px]" aria-hidden="true" />
              {s.documentChecklist}
            </Link>
          </div>
        </nav>

        <div className="space-y-3 border-t border-white/10 px-5 py-5">
          <div
            className="flex items-center justify-between gap-2 text-sm font-semibold text-brand-100"
            role="group"
            aria-label={c.language}
          >
            <span>{c.language}:</span>
            <span className="flex items-center rounded-lg bg-white/10 p-0.5 text-xs font-bold">
              <button
                type="button"
                aria-pressed={lang === "bn"}
                onClick={() => setLang("bn")}
                className={cn(
                  "rounded-md px-2.5 py-1.5 transition-colors",
                  lang === "bn"
                    ? "bg-white text-brand-800"
                    : "text-brand-100 hover:text-white",
                )}
              >
                {c.bengali}
              </button>
              <button
                type="button"
                aria-pressed={lang === "en"}
                onClick={() => setLang("en")}
                className={cn(
                  "rounded-md px-2.5 py-1.5 transition-colors",
                  lang === "en"
                    ? "bg-white text-brand-800"
                    : "text-brand-100 hover:text-white",
                )}
              >
                EN
              </button>
            </span>
          </div>
          <Link
            href="/login"
            onClick={onClose}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            {c.login}
          </Link>
          <Link
            href="/register"
            onClick={onClose}
            className="flex h-11 w-full items-center justify-center rounded-xl border border-white/25 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            {c.createAccount}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
