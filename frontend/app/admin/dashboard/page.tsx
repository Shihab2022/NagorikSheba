import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Shield,
  Layers,
  Building2,
  Bell,
  Users,
  Settings,
  ExternalLink,
  CheckCircle,
  Database,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { getMe } from "@/service/auth";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { T } from "@/components/ui/T";
import { SERVICES } from "@/lib/data/services";
import { CATEGORIES } from "@/lib/data/categories";
import { OFFICES } from "@/lib/data/offices";
import { NOTICES } from "@/lib/data/notices";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";

import { getAllCategories } from "@/service/category";
import { getAllServices } from "@/service/service";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "NagorikSheba administration and management console.",
};

export default async function AdminDashboardPage() {
  const meRes = await getMe();

  if (!meRes.success || !meRes.data) {
    redirect("/login");
  }

  if (meRes.data.role?.toUpperCase() !== "ADMIN") {
    redirect("/dashboard");
  }

  const admin = meRes.data;

  const [categoriesRes, servicesRes] = await Promise.all([
    getAllCategories().catch(() => ({ data: [] })),
    getAllServices({ limit: 1 }).catch(() => ({ data: [], meta: { total: 0 } })),
  ]);

  const categoriesCount = categoriesRes.data?.length ?? CATEGORIES.length;
  const servicesCount = servicesRes.meta?.total ?? SERVICES.length;

  const STATS = [
    {
      icon: Layers,
      label: { bn: "মোট সেবা", en: "Total Services" },
      value: servicesCount,
      href: "/admin/services",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      icon: Database,
      label: { bn: "সেবা ক্যাটাগরি", en: "Categories" },
      value: categoriesCount,
      href: "/admin/categories",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      icon: Building2,
      label: { bn: "সরকারি অফিস", en: "Govt Offices" },
      value: OFFICES.length,
      href: "/government-offices",
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      icon: Bell,
      label: { bn: "নাগরিক নোটিশ", en: "Active Notices" },
      value: NOTICES.length,
      href: "/notices",
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
  ];

  return (
    <>
      <TranslatedPageHeader
        title={{ bn: "অ্যাডমিন ড্যাশবোর্ড", en: "Admin Dashboard" }}
        description={{
          bn: "নাগরিক সেবা প্ল্যাটফর্মের সামগ্রিক ব্যবস্থাপনা, সেবা পর্যবেক্ষণ ও সিস্টেম নিয়ন্ত্রণ।",
          en: "Platform administration, service oversight, and system management console.",
        }}
        breadcrumbs={[
          { label: { bn: "হোম", en: "Home" }, href: "/" },
          { label: { bn: "অ্যাডমিন ড্যাশবোর্ড", en: "Admin Dashboard" } },
        ]}
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <AdminSidebar
            admin={admin}
            categoriesCount={categoriesCount}
            servicesCount={servicesCount}
          />

          <div className="min-w-0 flex-1 space-y-8">
            {/* Admin Identity Banner */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-line bg-gradient-to-r from-brand-900 to-brand-800 p-6 text-white shadow-card sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-brand-100 ring-1 ring-white/20">
                  <Shield className="h-7 w-7 text-flag-400" aria-hidden="true" />
                </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold sm:text-2xl">{admin.name}</h1>
                <span className="rounded-full bg-flag-500/20 px-2.5 py-0.5 text-xs font-bold tracking-wider text-flag-300 ring-1 ring-flag-400/30">
                  {admin.role}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-brand-100/80">{admin.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-white/20"
            >
              <Users className="h-3.5 w-3.5" />
              <T bn="নাগরিক ড্যাশবোর্ড" en="Citizen Dashboard" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-brand-900 shadow-sm transition-colors hover:bg-brand-50"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <T bn="সাইট দেখুন" en="View Site" />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <section aria-labelledby="admin-stats-heading" className="mb-10">
          <h2 id="admin-stats-heading" className="sr-only">
            <T bn="পরিসংখ্যান" en="Statistics" />
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <Link
                key={i}
                href={stat.href}
                className="group relative overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${stat.color}`}
                  >
                    <stat.icon className="h-5 w-5" />
                  </span>
                  <span className="text-3xl font-black text-slate-900">{stat.value}</span>
                </div>
                <p className="mt-3 text-sm font-bold text-slate-600 transition-colors group-hover:text-brand-700">
                  <T bn={stat.label.bn} en={stat.label.en} />
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Main Content Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Management Sections */}
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-brand-600" />
                  <h2 className="text-lg font-extrabold text-slate-900">
                    <T bn="প্রশাসনিক মডিউল" en="Administrative Modules" />
                  </h2>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  <T bn="সিস্টেম কন্ট্রোল" en="System Control" />
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/admin/services"
                  className="group flex flex-col justify-between rounded-xl border border-line bg-canvas p-4 transition-all hover:border-brand-300 hover:bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 group-hover:text-brand-700">
                        <T bn="সেবা পরিচালনা" en="Services Management" />
                      </h3>
                      <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-600" />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      <T
                        bn="সরকারি সেবাসমূহের তথ্য, ফি ও ধাপ হালনাগাদ করুন।"
                        en="Review, update and verify citizen government services."
                      />
                    </p>
                  </div>
                  <span className="mt-3 text-[11px] font-semibold text-brand-700">
                    {servicesCount} <T bn="টি সেবা প্রস্তুত" en="services available" />
                  </span>
                </Link>

                <Link
                  href="/admin/categories"
                  className="group flex flex-col justify-between rounded-xl border border-line bg-canvas p-4 transition-all hover:border-brand-300 hover:bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 group-hover:text-brand-700">
                        <T bn="ক্যাটাগরি নিয়ন্ত্রণ" en="Categories Overview" />
                      </h3>
                      <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-600" />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      <T
                        bn="সেবা শ্রেণীকরণ ও ক্যাটাগরি তালিকা পরিচালনা।"
                        en="Organize services into citizen-friendly taxonomy categories."
                      />
                    </p>
                  </div>
                  <span className="mt-3 text-[11px] font-semibold text-brand-700">
                    {categoriesCount} <T bn="টি সক্রিয় ক্যাটাগরি" en="active categories" />
                  </span>
                </Link>

                <Link
                  href="/government-offices"
                  className="group flex flex-col justify-between rounded-xl border border-line bg-canvas p-4 transition-all hover:border-brand-300 hover:bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 group-hover:text-brand-700">
                        <T bn="অফিস ডিরেক্টরি" en="Office Directory" />
                      </h3>
                      <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-600" />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      <T
                        bn="মন্ত্রণালয়, অধিদপ্তর ও আঞ্চলিক অফিসসমূহ।"
                        en="Manage ministry, department and regional office directory."
                      />
                    </p>
                  </div>
                  <span className="mt-3 text-[11px] font-semibold text-brand-700">
                    {OFFICES.length} <T bn="টি অফিস তালিকাভুক্ত" en="offices listed" />
                  </span>
                </Link>

                <Link
                  href="/notices"
                  className="group flex flex-col justify-between rounded-xl border border-line bg-canvas p-4 transition-all hover:border-brand-300 hover:bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 group-hover:text-brand-700">
                        <T bn="নোটিশ বোর্ড" en="Notice Board" />
                      </h3>
                      <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-600" />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      <T
                        bn="নাগরিকদের জন্য সরকারি পরিপত্র ও নোটিশ প্রকাশনা।"
                        en="Broadcast official circulars, updates and alerts."
                      />
                    </p>
                  </div>
                  <span className="mt-3 text-[11px] font-semibold text-brand-700">
                    {NOTICES.length} <T bn="টি নোটিশ সক্রিয়" en="active notices" />
                  </span>
                </Link>
              </div>
            </section>

            {/* Recent Services List */}
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <h2 className="text-base font-extrabold text-slate-900">
                  <T bn="সাম্প্রতিক যাচাইকৃত সেবা" en="Recently Verified Services" />
                </h2>
                <Link
                  href="/services"
                  className="text-xs font-bold text-brand-700 hover:text-brand-800"
                >
                  <T bn="সব সেবা দেখুন →" en="View all services →" />
                </Link>
              </div>
              <ul className="mt-4 divide-y divide-line">
                {SERVICES.slice(0, 5).map((s) => (
                  <li key={s.id} className="flex items-center justify-between py-3">
                    <div className="min-w-0 pr-4">
                      <p className="truncate text-sm font-bold text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.department}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="hidden rounded-md bg-canvas px-2 py-1 text-[11px] font-semibold text-slate-600 sm:inline-block">
                        {s.fee}
                      </span>
                      <Link
                        href={`/services/${s.slug}`}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-canvas hover:text-brand-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right Column: System Status */}
          <aside className="space-y-6">
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="flex items-center gap-2 border-b border-line pb-4">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h2 className="text-base font-extrabold text-slate-900">
                  <T bn="সিস্টেম স্ট্যাটাস" en="System Status" />
                </h2>
              </div>
              <div className="mt-4 space-y-3.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">
                    <T bn="ডাটাবেজ" en="Database" />
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                    <CheckCircle className="h-4 w-4" /> PostgreSQL
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">
                    <T bn="অথেনটিকেশন" en="Authentication" />
                  </span>
                  <span className="font-bold text-slate-700">JWT / Local + Google</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">
                    <T bn="ইউজার রোল" en="Current Role" />
                  </span>
                  <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
                    {admin.role}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">
                    <T bn="পাসওয়ার্ড স্ট্যাটাস" en="Password Set" />
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {admin.hasPassword ? "Yes (Local)" : "No (OAuth only)"}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-line bg-brand-50/50 p-6 shadow-card">
              <h2 className="text-base font-extrabold text-brand-900">
                <T bn="প্রশাসনিক নির্দেশনা" en="Administrator Notice" />
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-brand-800/80">
                <T
                  bn="প্রতিটি সরকারি সেবার তথ্য নিয়মিত সরকারি পোর্টাল থেকে যাচাই করুন এবং ফি, সময়সীমা ও আবেদন প্রক্রিয়ার আপডেট নিশ্চিত করুন।"
                  en="Regularly verify service specifications against official government portals to ensure fees, timelines and requirement procedures remain accurate."
                />
              </p>
              <div className="mt-4">
                <Link
                  href="/search"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-800"
                >
                  <T bn="সেবা যাচাই শুরু করুন" en="Inspect Services" />
                </Link>
              </div>
            </section>
          </aside>
        </div>
        </div>
      </div>
    </div>
  </>
);
}
