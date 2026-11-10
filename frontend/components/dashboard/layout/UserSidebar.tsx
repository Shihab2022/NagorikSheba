"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Bookmark,
  Bot,
  Building2,
  Calculator,
  CreditCard,
  FileText,
  FolderArchive,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageSearch,
  Search,
  Shield,
  UserRound,
  X,
  CheckCircle2,
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
  { href: "/dashboard/files", label: { bn: "আমার ফাইল ও গ্যালারি", en: "My Files & Gallery" }, icon: FolderArchive },
  { href: "/dashboard/tax-calculator", label: { bn: "আয়কর ক্যালকুলেটর", en: "Tax Calculator" }, icon: Calculator },
  { href: "/dashboard/services", label: { bn: "সকল সেবা", en: "All Services" }, icon: Bookmark },
  { href: "/dashboard/documents", label: { bn: "ডকুমেন্ট চেকলিস্ট", en: "Documents" }, icon: FileText },
  { href: "/dashboard/fees", label: { bn: "সরকারি ফি", en: "Govt Fees" }, icon: CreditCard },
];

const DISCOVERY_ITEMS: NavItem[] = [
  { href: "/dashboard/search", label: { bn: "সেবা খুঁজুন", en: "Search Services" }, icon: Search },
  { href: "/dashboard/government-offices", label: { bn: "সরকারি অফিস", en: "Govt Offices" }, icon: Building2 },
  { href: "/dashboard/notices", label: { bn: "নোটিশ বোর্ড", en: "Notices" }, icon: Bell },
  { href: "/dashboard/ai-assistant", label: { bn: "এআই সহকারী", en: "AI Assistant" }, icon: Bot, badge: "AI" },
  { href: "/dashboard/faq", label: { bn: "সাহায্য ও প্রশ্ন", en: "Help & FAQ" }, icon: HelpCircle },
];

const STRINGS = {
  bn: {
    menu: "ড্যাশবোর্ড মেনু",
    mainSection: "প্রধান মেনু",
    servicesSection: "সেবা ও তথ্য",
    accountSection: "অ্যাকাউন্ট",
    citizen: "নাগরিক",
    verified: "যাচাইকৃত",
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
    verified: "Verified",
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
    <ul className="space-y-1.5">
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href + "/")) ||
          (item.href === "/dashboard/tax-calculator" &&
            (pathname === "/income-tax-calculator" ||
              pathname === "/dashboard/income-tax-calculator"));
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200",
                active
                  ? "bg-brand-600 text-white shadow-sm shadow-brand-600/30 font-extrabold"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
              )}
            >
              <span className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    active ? "text-white" : "text-slate-400 group-hover:text-brand-600",
                  )}
                />
                <span>{t(item.label)}</span>
              </span>
              {item.badge && (
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[10px] font-black tracking-wide uppercase",
                    active
                      ? "bg-white/20 text-white"
                      : "bg-indigo-50 text-indigo-700 border border-indigo-100",
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
        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/70 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white shadow-sm font-black text-sm tracking-wider">
                {user?.name ? (
                  user.name
                    .split(" ")
                    .map((n) => n[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                ) : (
                  <UserRound className="h-5 w-5" />
                )}
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 ring-1 ring-emerald-500/20" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="notranslate truncate text-sm font-black text-slate-900 leading-snug" translate="no" title={user?.name || "Citizen"}>
                  {user?.name || "Citizen"}
                </p>
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden="true" />
              </div>
              <p className="notranslate truncate text-[11px] text-slate-400 mt-0.5" translate="no" title={user?.email || ""}>
                {user?.email || "citizen@nagoriksheba.gov"}
              </p>

              <div className="mt-2.5 flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase",
                    isAdmin
                      ? "bg-flag-50 text-flag-700 border border-flag-200"
                      : "bg-emerald-50 text-emerald-800 border border-emerald-200",
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {isAdmin ? s.adminBadge : s.citizen}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {s.verified}
                </span>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="mt-3.5 pt-3 border-t border-slate-100">
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-brand-700"
              >
                <Shield className="h-3.5 w-3.5 text-flag-400" />
                <span>{s.adminConsole}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Main Section */}
        <div>
          <p className="mb-2 px-3 text-[10px] font-black tracking-wider text-slate-400 uppercase">
            {s.mainSection}
          </p>
          {renderNavLinks(MAIN_ITEMS)}
        </div>

        {/* Explore Section */}
        <div>
          <p className="mb-2 px-3 text-[10px] font-black tracking-wider text-slate-400 uppercase">
            {s.servicesSection}
          </p>
          {renderNavLinks(DISCOVERY_ITEMS)}
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="border-t border-slate-100 pt-4 mt-6">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:bg-flag-50 hover:text-flag-700 cursor-pointer"
        >
          <LogOut className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-flag-600" />
          <span>{s.logout}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Trigger */}
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-line bg-white p-3 shadow-card lg:hidden">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 font-bold text-xs">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : <LayoutDashboard className="h-4 w-4" />}
          </span>
          <div>
            <p className="text-xs font-black text-slate-800 leading-none">{user?.name || "Citizen"}</p>
            <span className="text-[10px] text-slate-400">{s.menu}</span>
          </div>
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
              <span className="text-sm font-black text-slate-900">
                {s.menu}
              </span>
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
      <aside className="hidden w-72 shrink-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card lg:block sticky top-24 self-start z-30 max-h-[calc(100vh-7rem)] overflow-y-auto">
        {sidebarContent}
      </aside>
    </>
  );
}

export default UserSidebar;

