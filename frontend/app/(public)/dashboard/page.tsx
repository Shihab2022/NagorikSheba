import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Info } from "lucide-react";
import { getMe } from "@/service/auth";
import { SERVICES } from "@/lib/data/services";
import { T } from "@/components/ui/T";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { UserSidebar } from "@/components/dashboard/layout/UserSidebar";
import {
  QuickActions,
  AdminAccessBanner,
  ApplicationsCard,
  SavedServicesCard,
  RecentSearchesCard,
  NotificationsCard,
} from "@/components/dashboard/user";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your NagorikSheba citizen dashboard.",
};

export default async function DashboardPage() {
  const meRes = await getMe();
  const user = meRes.success ? meRes.data : null;
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const saved = SERVICES.slice(0, 4);

  return (
    <DashboardShell
      sidebar={<UserSidebar user={user} />}
    >
      {/* Sleek Breadcrumb */}
      <nav aria-label="Breadcrumb" className="-mt-2 mb-1">
        <ol className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <li>
            <Link href="/" className="hover:text-brand-700 transition-colors">
              <T bn="হোম" en="Home" />
            </Link>
          </li>
          <li>
            <ChevronRight className="h-3 w-3 text-slate-300" />
          </li>
          <li className="text-slate-700 font-bold">
            <T bn="ড্যাশবোর্ড" en="Dashboard" />
          </li>
        </ol>
      </nav>

      {/* Admin Notice Banner if logged in user is Administrator */}
      {isAdmin && <AdminAccessBanner />}

      {/* Modern Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-800/40 bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 p-6 sm:p-8 text-white shadow-md">
        {/* Ambient background decoration */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-brand-400/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 text-[11px] font-black text-emerald-200 tracking-wider uppercase">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <T bn="নাগরিক ড্যাশবোর্ড" en="Citizen Portal" />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-black text-emerald-300">
                <CheckCircle2 className="h-3 w-3" />
                <T bn="যাচাইকৃত প্রোফাইল" en="Verified Citizen" />
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                {user?.name ? (
                  <>
                    Welcome back, <span className="notranslate" translate="no">{user.name}</span>!
                  </>
                ) : (
                  "Welcome, Citizen!"
                )}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-medium">
                <T
                  bn="সংরক্ষিত সেবা, প্রয়োজনীয় কাগজপত্র, ফি যাচাই ও আবেদনের প্রতিটি ধাপ — সব এক জায়গায় পর্যবেক্ষণ করুন।"
                  en="Access services, check fees, prepare required documents, and track your applications in one place."
                />
              </p>
            </div>
          </div>

          {/* Key Metric Counters */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <div className="flex-1 sm:flex-initial rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 text-center min-w-[100px]">
              <p className="text-xl sm:text-2xl font-black text-white">0</p>
              <p className="text-[11px] font-bold text-emerald-200 mt-0.5">
                <T bn="সক্রিয় আবেদন" en="Active Apps" />
              </p>
            </div>
            <div className="flex-1 sm:flex-initial rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 text-center min-w-[100px]">
              <p className="text-xl sm:text-2xl font-black text-white">{saved.length}</p>
              <p className="text-[11px] font-bold text-emerald-200 mt-0.5">
                <T bn="সংরক্ষিত সেবা" en="Saved Services" />
              </p>
            </div>
            <div className="flex-1 sm:flex-initial rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 text-center min-w-[100px]">
              <p className="text-xl sm:text-2xl font-black text-white">100+</p>
              <p className="text-[11px] font-bold text-emerald-200 mt-0.5">
                <T bn="উপলব্ধ সেবা" en="Available" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Slim Info Strip */}
      <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-600">
        <Info className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
        <p className="text-xs text-slate-500">
          <strong className="font-bold text-slate-700">
            <T bn="নাগরিক পরামর্শ:" en="Citizen Guide:" />
          </strong>{" "}
          <T
            bn="সরকারি সেবার ফি এবং প্রয়োজনীয় ডকুমেন্ট সর্বদা অফিসিয়াল কর্তৃপক্ষের নির্দেশনা অনুযায়ী যাচাই করুন।"
            en="Always verify fees, required documents and procedure steps with official authority portals."
          />
        </p>
      </div>

      {/* Quick Action Shortcuts */}
      <section aria-labelledby="dash-quick">
        <div className="flex items-center justify-between mb-3">
          <h2 id="dash-quick" className="text-xs font-black tracking-wider text-slate-500 uppercase">
            <T bn="দ্রুত সেবা ও কার্যক্রম" en="Quick Actions & Services" />
          </h2>
        </div>
        <QuickActions />
      </section>

      {/* Main Grid: Left Column for Applications & Saved Services, Right Column for Searches & Notifications */}
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <ApplicationsCard />
          <SavedServicesCard services={saved} />
        </div>

        <aside className="space-y-6">
          <RecentSearchesCard />
          <NotificationsCard />
        </aside>
      </div>
    </DashboardShell>
  );
}
