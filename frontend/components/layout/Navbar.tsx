
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, Search } from "lucide-react";

import { Logo } from "@/components/ui/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { cn } from "@/lib/utils";
import { useTranslation, type Dict } from "@/lib/i18n";
import { COMMON } from "@/lib/i18n/common";
import { getMe, logout } from "@/service/auth";
import { markHomeNavigationIntent } from "@/lib/home-navigation-intent";

const NAV_LINKS: { label: Dict<string>; href: string }[] = [
  { href: "/services", label: { bn: "সেবা", en: "Services" } },
  {
    href: "/how-it-works",
    label: { bn: "কীভাবে কাজ করে", en: "How It Works" },
  },
  {
    href: "/government-offices",
    label: { bn: "সরকারি অফিস", en: "Government Offices" },
  },
  { href: "/notices", label: { bn: "নোটিশ", en: "Notices" } },
  { href: "/faq", label: { bn: "সাহায্য", en: "Help" } },
];

const STRINGS = {
  bn: {
    openMenu: "মেনু খুলুন",
    closeMenu: "মেনু বন্ধ করুন",
    dashboard: "ড্যাশবোর্ড",
    logout: "লগআউট",
  },
  en: {
    openMenu: "Open menu",
    closeMenu: "Close menu",
    dashboard: "Dashboard",
    logout: "Logout",
  },
};

type NavbarUser = {
  name?: string;
  role?: string;
};

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<NavbarUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const { lang, setLang, t } = useTranslation();
  const c = t(COMMON);
  const s = t(STRINGS);

  // Load the authenticated user when Navbar mounts.
  useEffect(() => {
    let isActive = true;

    async function checkUser() {
      try {
        const res = await getMe();

        if (!isActive) return;

        if (res.success && res.data) {
          setUser(res.data);
        } else {
          setUser(null);
        }
      } catch {
        if (isActive) {
          setUser(null);
        }
      }
    }

    void checkUser();

    return () => {
      isActive = false;
    };
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      await logout();

      setUser(null);
      setOpen(false);

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const dashboardHref =
    user?.role?.toUpperCase() === "ADMIN"
      ? "/admin/dashboard"
      : "/dashboard";

  const isDashboardPage =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/admin/dashboard" ||
    pathname.startsWith("/admin/dashboard/");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-brand-700 transition-shadow duration-300",
        scrolled ? "shadow-lg shadow-brand-900/20" : "",
      )}
    >
      <div
        className="h-[3px] w-full bg-flag-500"
        aria-hidden="true"
      />

      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:h-[72px] lg:px-8"
      >
        {/* Logo: Logo component already renders its own Link. */}
        <Logo
          tone="light"
          href="/"
          onClick={markHomeNavigationIntent}
        />

        {/* Desktop navigation links */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(`${link.href}/`);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-white"
                      : "text-brand-50/80 hover:text-white",
                  )}
                >
                  {t(link.label)}

                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-flag-500 transition-transform duration-250",
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search button */}
          <Link
            href="/search"
            aria-label={c.searchServices}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-50/90 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </Link>

          {/* Language toggle */}
          <div
            className="hidden items-center rounded-lg bg-white/10 p-0.5 text-xs font-bold md:flex"
            role="group"
            aria-label={c.language}
          >
            <button
              type="button"
              aria-pressed={lang === "bn"}
              onClick={() => setLang("bn")}
              className={cn(
                "rounded-md px-2.5 py-1.5 transition-colors",
                lang === "bn"
                  ? "bg-white text-brand-800"
                  : "text-brand-50/80 hover:text-white",
              )}
            >
              বাংলা
            </button>

            <button
              type="button"
              aria-pressed={lang === "en"}
              onClick={() => setLang("en")}
              className={cn(
                "rounded-md px-2.5 py-1.5 transition-colors",
                lang === "en"
                  ? "bg-white text-brand-800"
                  : "text-brand-50/80 hover:text-white",
              )}
            >
              EN
            </button>
          </div>

          {/* Logged-in user buttons */}
          {user ? (
            <div className="hidden items-center gap-2 lg:flex">
              {!isDashboardPage && (
                <Link
                  href={dashboardHref}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 text-sm font-bold text-brand-800 shadow-sm transition-all duration-200 hover:bg-brand-50 hover:shadow-md active:scale-[0.98]"
                >
                  {s.dashboard}
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                title={s.logout}
                aria-label={s.logout}
                className={cn(
                  "group inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/20 px-3.5 text-sm font-semibold text-white",
                  "bg-white/10 shadow-sm backdrop-blur-sm",
                  "transition-all duration-200",
                  "hover:border-red-300/40 hover:bg-red-500 hover:shadow-md hover:shadow-red-950/20",
                  "active:scale-[0.97]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-700",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                )}
              >
                <LogOut
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    !loggingOut && "group-hover:translate-x-0.5",
                  )}
                  aria-hidden="true"
                />

                <span>{loggingOut ? "..." : s.logout}</span>
              </button>
            </div>
          ) : (
            /* Logged-out user buttons */
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 text-sm font-bold text-brand-800 shadow-sm transition-all duration-200 hover:bg-brand-50 hover:shadow-md active:scale-[0.98]"
              >
                {c.login}
              </Link>

              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 text-sm font-bold text-brand-800 shadow-sm transition-all duration-200 hover:bg-brand-50 hover:shadow-md active:scale-[0.98]"
              >
                {lang === "bn" ? "নিবন্ধন" : "Register"}
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? s.closeMenu : s.openMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-50 transition-colors hover:bg-white/10 lg:hidden"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        links={NAV_LINKS}
      />
    </header>
  );
}

export default Navbar;
