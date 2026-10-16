"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Building2,
  Database,
  ExternalLink,
  FileCheck,
  FolderPlus,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageSearch,
  Plus,
  PlusCircle,
  Shield,
  UserRound,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation, type Dict } from "@/lib/i18n";
import { logout } from "@/service/auth";

type NavItem = {
  href: string;
  label: Dict<string>;
  icon: any;
  badge?: string;
  createHref?: string;
  createLabel?: Dict<string>;
};

const ADMIN_ITEMS: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: { bn: "ড্যাশবোর্ড ওভারভিউ", en: "Overview" },
    icon: LayoutDashboard,
  },
  {
    href: "/admin/services",
    label: { bn: "সেবা ব্যবস্থাপনা", en: "Manage Services" },
    icon: Layers,
    createHref: "/admin/services?action=create",
    createLabel: { bn: "নতুন সেবা", en: "New Service" },
  },
  {
    href: "/admin/categories",
    label: { bn: "ক্যাটাগরি ব্যবস্থাপনা", en: "Manage Categories" },
    icon: Database,
    createHref: "/admin/categories?action=create",
    createLabel: { bn: "নতুন ক্যাটাগরি", en: "New Category" },
  },
  {
    href: "/government-offices",
    label: { bn: "সরকারি অফিস", en: "Govt Offices" },
    icon: Building2,
  },
  {
    href: "/notices",
    label: { bn: "নোটিশ বোর্ড", en: "Notice Board" },
    icon: Bell,
  },
  {
    href: "/application-tracker",
    label: { bn: "আবেদন ট্র্যাকিং", en: "Applications" },
    icon: PackageSearch,
  },
];

const PLATFORM_ITEMS: NavItem[] = [
  { href: "/dashboard", label: { bn: "নাগরিক ড্যাশবোর্ড", en: "Citizen Portal" }, icon: UserRound },
  { href: "/", label: { bn: "মূল ওয়েবসাইট", en: "Public Site" }, icon: ExternalLink },
  { href: "/services", label: { bn: "পাবলিক সেবা তালিকা", en: "Public Services" }, icon: Layers },
];

const STRINGS = {
  bn: {
    menu: "অ্যাডমিন মেনু",
    adminSection: "প্রশাসনিক নিয়ন্ত্রণ",
    quickActions: "দ্রুত তৈরি করুন",
    createService: "নতুন সেবা যুক্ত করুন",
    createCategory: "নতুন ক্যাটাগরি যুক্ত করুন",
    platformSection: "প্ল্যাটফর্ম শর্টকাট",
    role: "অ্যাডমিনিস্ট্রেটর",
    logout: "লগআউট",
  },
  en: {
    menu: "Admin Menu",
    adminSection: "Administration",
    quickActions: "Quick Actions",
    createService: "Add New Service",
    createCategory: "Add New Category",
    platformSection: "Platform Shortcuts",
    role: "Administrator",
    logout: "Log Out",
  },
};

export function AdminSidebar({
  admin,
  categoriesCount,
  servicesCount,
}: {
  admin?: { name?: string; email?: string; role?: string } | null;
  categoriesCount?: number;
  servicesCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const s = t(STRINGS);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  const renderNavLinks = (items: NavItem[]) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const active = pathname === item.href;
        const count =
          item.href === "/admin/categories"
            ? categoriesCount
            : item.href === "/admin/services"
            ? servicesCount
            : undefined;

        return (
          <li key={item.href} className="group relative">
            <div
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all",
                active
                  ? "bg-brand-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-brand-50/70 hover:text-brand-800"
              )}
            >
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex flex-1 items-center gap-2.5 min-w-0"
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    active ? "text-flag-400" : "text-slate-400 group-hover:text-brand-700"
                  )}
                />
                <span className="truncate">{t(item.label)}</span>
              </Link>

              <div className="flex items-center gap-1.5 shrink-0">
                {count !== undefined && (
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-[10px] font-extrabold tracking-tight",
                      active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {count}
                  </span>
                )}
                {item.createHref && (
                  <Link
                    href={item.createHref}
                    onClick={() => setMobileOpen(false)}
                    title={item.createLabel ? t(item.createLabel) : "Create"}
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-md transition-colors",
                      active
                        ? "bg-white/20 text-white hover:bg-white/30"
                        : "text-slate-400 hover:bg-brand-100 hover:text-brand-800"
                    )}
                  >
                    <Plus className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-5">
        {/* Admin Profile Card */}
        <div className="rounded-2xl border border-brand-900/10 bg-gradient-to-br from-brand-900 via-brand-900 to-brand-800 p-4 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-flag-300 ring-1 ring-white/20">
              <Shield className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black text-white">{admin?.name || "Admin"}</p>
              <p className="truncate text-[11px] text-brand-100/80">{admin?.email || "admin@system"}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-white/10 text-[10px]">
            <span className="font-semibold text-brand-200">{s.role}</span>
            <span className="rounded-full bg-flag-500/20 px-2 py-0.5 font-black text-flag-300 ring-1 ring-flag-400/30">
              {admin?.role || "ADMIN"}
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="rounded-xl border border-line bg-canvas/60 p-3 space-y-2">
          <p className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
            {s.quickActions}
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            <Link
              href="/admin/services?action=create"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between rounded-lg bg-brand-700 px-2.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-brand-800"
            >
              <span className="flex items-center gap-1.5 truncate">
                <PlusCircle className="h-3.5 w-3.5 text-flag-300 shrink-0" />
                <span className="truncate">{s.createService}</span>
              </span>
              <span className="text-[10px] opacity-75 font-mono">+New</span>
            </Link>

            <Link
              href="/admin/categories?action=create"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between rounded-lg border border-brand-200 bg-white px-2.5 py-1.5 text-xs font-bold text-brand-800 shadow-2xs transition hover:bg-brand-50"
            >
              <span className="flex items-center gap-1.5 truncate">
                <FolderPlus className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                <span className="truncate">{s.createCategory}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">+New</span>
            </Link>
          </div>
        </div>

        {/* Administration Navigation */}
        <div>
          <p className="mb-2 px-3 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
            {s.adminSection}
          </p>
          {renderNavLinks(ADMIN_ITEMS)}
        </div>

        {/* Platform Shortcuts */}
        <div>
          <p className="mb-2 px-3 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
            {s.platformSection}
          </p>
          {renderNavLinks(PLATFORM_ITEMS)}
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="border-t border-line pt-4 mt-6">
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
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-900 text-white">
            <Shield className="h-4 w-4 text-flag-400" />
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

export default AdminSidebar;
