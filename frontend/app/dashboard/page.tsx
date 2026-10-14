import type { Metadata } from "next";
import Link from "next/link";
import { Bell, Bookmark, History } from "lucide-react";
import { SERVICES } from "@/lib/data/services";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { DemoNote } from "@/components/ui/States";
import { ServiceCard } from "@/components/services/ServiceCard";
import { T } from "@/components/ui/T";
import { DashQuick } from "./DashQuick";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Dashboard", description: "Your NagorikSheba citizen dashboard." };

export default function DashboardPage() {
  const saved = SERVICES.slice(0, 3);
  return (
    <>
      <TranslatedPageHeader
        title={{ bn: "ফিরে আসায় স্বাগতম!", en: "Welcome back!" }}
        description={{
          bn: "সংরক্ষিত সেবা, আবেদন ও সাম্প্রতিক কার্যক্রম — সব এক জায়গায়।",
          en: "Your saved services, applications and recent activity — all in one place.",
        }}
        breadcrumbs={[{ label: { bn: "হোম", en: "Home" }, href: "/" }, { label: { bn: "ড্যাশবোর্ড", en: "Dashboard" } }]}
      />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6"><DemoNote /></div>
        <section aria-labelledby="dash-quick">
          <h2 id="dash-quick" className="text-sm font-extrabold tracking-wide text-slate-500 uppercase"><T bn="দ্রুত কাজ" en="Quick Actions" /></h2>
          <DashQuick />
        </section>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            <section aria-labelledby="dash-apps">
              <div className="flex items-center justify-between">
                <h2 id="dash-apps" className="text-lg font-extrabold text-slate-900"><T bn="আমার আবেদন" en="My Applications" /></h2>
                <Link href="/application-tracker" className="text-sm font-bold text-brand-700 hover:text-brand-800"><T bn="ট্র্যাক করুন" en="Track one" /></Link>
              </div>
              <div className="mt-3 rounded-2xl border border-dashed border-line bg-white p-6 text-center">
                <Icon name="ScrollText" className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm font-bold text-slate-700"><T bn="এখনো কোনো আবেদন নেই" en="No applications yet" /></p>
                <p className="mt-1 text-xs text-slate-400"><T bn="ট্র্যাক করা আবেদন এখানে দেখা যাবে।" en="Applications you track will appear here once accounts are connected." /></p>
              </div>
            </section>
            <section aria-labelledby="dash-saved">
              <div className="flex items-center justify-between">
                <h2 id="dash-saved" className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
                  <Bookmark className="h-5 w-5 text-brand-600" aria-hidden="true" /> <T bn="সংরক্ষিত সেবা" en="Saved Services" />
                </h2>
                <Link href="/services" className="text-sm font-bold text-brand-700 hover:text-brand-800"><T bn="সব দেখুন" en="Browse all" /></Link>
              </div>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {saved.map((s) => (<ServiceCard key={s.id} service={s} />))}
              </div>
            </section>
          </div>
          <aside className="space-y-5">
            <section aria-labelledby="dash-recent" className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <h2 id="dash-recent" className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <History className="h-[18px] w-[18px] text-brand-600" aria-hidden="true" /> <T bn="সাম্প্রতিক অনুসন্ধান" en="Recent Searches" />
              </h2>
              <ul className="mt-3 space-y-2">
                {["passport renewal", "NID correction", "land mutation"].map((t) => (
                  <li key={t}>
                    <Link href={`/search?q=${encodeURIComponent(t)}`} className="block truncate rounded-xl bg-canvas px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:text-brand-700">{t}</Link>
                  </li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="dash-notif" className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <h2 id="dash-notif" className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <Bell className="h-[18px] w-[18px] text-brand-600" aria-hidden="true" /> <T bn="বিজ্ঞপ্তি" en="Notifications" />
              </h2>
              <ul className="mt-3 space-y-2.5 text-sm leading-6 text-slate-500">
                <li className="rounded-xl bg-brand-50/70 px-3.5 py-2.5"><strong className="font-bold text-slate-800"><T bn="কর রিমাইন্ডার:" en="Tax filing reminder:" /></strong> <T bn="ই-রিটার্ন সময়সীমা ঘনিয়ে আসছে।" en="e-Return deadline is approaching." /></li>
                <li className="rounded-xl bg-canvas px-3.5 py-2.5"><T bn="নতুন নোটিশ: BRTA পরীক্ষার সময়সূচি হালনাগাদ।" en="New notice: BRTA test schedule updated." /></li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
