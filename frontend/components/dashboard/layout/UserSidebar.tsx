"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Bookmark,
  Bot,
  Building2,
  CreditCard,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageSearch,
  Search,
  Shield,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation, type Dict } from "@/lib/i18n";
import { logout } from "@/service/auth";

type NavItem = {
  href: string;
  label: Dict<string>;
  icon: LucideIcon;
  badge?: string;
};

const MAIN_ITEMS: NavItem[] = [
  { href: "/dashboard", label: { bn: "ড্যাশবোর্ড", en: "Dashboard" }, icon: LayoutDashboard },
  { href: "/dashboard/applications", label: { bn: "আমার আবেদন", en: "My Applications" }, icon: PackageSearch },
  { href: "/services", label: { bn: "সকল সেবা", en: "All Services" }, icon: Bookmark },
  { href: "/documents", label: { bn: "ডকুমেন্ট চেকলিস্ট", en: "Documents" }, icon: FileText },
  { href: "/fees", label: { bn: "সরকারি ফি", en: "Govt Fees" }, icon: CreditCard },
];

const DISCOVERY_ITEMS: NavItem[] = [
  { href: "/search", label: { bn: "সেবা খুঁজুন", en: "Search Services" }, icon: Search },
  { href: "/government-offices", label: { bn: "সরকারি অফিস", en: "Govt Offices" }, icon: Building2 },
  { href: "/notices", label: { bn: "নোটিশ বোর্ড", en: "Notices" }, icon: Bell },
  { href: "/ai-assistant", label: { bn: "এআই সহকারী", en: "AI Assistant" }, icon: Bot, badge: "AI" },
  { href: "/faq", label: { bn: "সাহায্য ও প্রশ্ন", en: "Help & FAQ" }, icon: HelpCircle },
];

const STRINGS = {
  bn: {
    menu: "ড্যাশবোর্ড মেনু",
    mainSection: "প্রধান মেনু",
    servicesSection: "সেবা ও তথ্য",
    accountSection: "অ্যাকাউন্ট",
    citizen: "নাগরিক",
    adminBadge: "অ্যাডমিন",
    adminConsole: "অ্যাডমিন কনসোল",
    logout: "লগআউট",
  },
  en: {
    menu: "Dashboard Menu",
    mainSection: "Main Menu",
    servicesSection: "Services & Info",
    accountSection: "Account",
    citizen: "Citizen",
    adminBadge: "Admin",
    adminConsole: "Admin Console",
    logout: "Log Out",
  },
};

export function UserSidebar({
  user,
}: {
  user?: { name?: string; email?: string; role?: string } | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const s = t(STRINGS);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  const renderNavLinks = (items: NavItem[]) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all",
                active
                  ? "bg-brand-700 text-white shadow-sm"
                  : "text-slate-600 hover:bg-brand-50/70 hover:text-brand-800",
              )}
            >
              <span className="flex items-center gap-2.5">
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    active ? "text-white" : "text-slate-400 group-hover:text-brand-700",
                  )}
                />
                <span>{t(item.label)}</span>
              </span>
              {item.badge && (
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[10px] font-extrabold uppercase",
                    active
                      ? "bg-white/20 text-white"
                      : "bg-brand-100 text-brand-800 group-hover:bg-brand-200",
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-6">
        {/* User Card */}
        <div className="rounded-2xl border border-line bg-canvas/60 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm font-bold text-sm">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : <UserRound className="h-5 w-5" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black text-slate-900">{user?.name || "Citizen"}</p>
              <p className="truncate text-[11px] text-slate-400">{user?.email || "Signed In"}</p>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase",
                isAdmin ? "bg-flag-100 text-flag-700" : "bg-emerald-100 text-emerald-800",
              )}
            >
              {isAdmin ? s.adminBadge : s.citizen}
            </span>
          </div>

          {isAdmin && (
            <div className="mt-3 pt-3 border-t border-line">
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-900 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition-colors hover:bg-brand-800"
              >
                <Shield className="h-3.5 w-3.5 text-flag-400" />
                <span>{s.adminConsole}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Main Section */}
        <div>
          <p className="mb-2 px-3 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
            {s.mainSection}
          </p>
          {renderNavLinks(MAIN_ITEMS)}
        </div>

        {/* Explore Section */}
        <div>
          <p className="mb-2 px-3 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
            {s.servicesSection}
          </p>
          {renderNavLinks(DISCOVERY_ITEMS)}
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="border-t border-line pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-flag-600 transition-colors hover:bg-flag-50 cursor-pointer"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>{s.logout}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Trigger */}
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-line bg-white p-3 shadow-card lg:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-800">
            <LayoutDashboard className="h-4 w-4" />
          </span>
          <span className="text-xs font-black text-slate-800">{s.menu}</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-canvas px-3 text-xs font-bold text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-800 cursor-pointer"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span>{mobileOpen ? "বন্ধ করুন" : "মেনু দেখুন"}</span>
        </button>
      </div>

      {/* Mobile Backdrop and Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-72 bg-white p-5 shadow-2xl overflow-y-auto">
            <div className="mb-4 flex items-center justify-between pb-3 border-b border-line">
              <span className="text-sm font-black text-slate-900">{s.menu}</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden w-64 shrink-0 rounded-2xl border border-line bg-white p-5 shadow-card lg:block sticky top-[88px] max-h-[calc(100vh-108px)] overflow-y-auto">
        {sidebarContent}
      </aside>
    </>
  );
}

export default UserSidebar;
