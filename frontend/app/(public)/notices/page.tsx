import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bell, Building } from "lucide-react";
import { getAllCategories } from "@/service/category";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Government Notices by Category",
  description:
    "Browse the latest official Bangladesh government notices, updates and announcements categorized by service sector.",
};

export default async function NoticesOverviewPage() {
  const catRes = await getAllCategories().catch(() => ({ success: false, data: [] }));
  const categories = catRes.data || [];

  return (
    <>
      <TranslatedPageHeader
        title={{ bn: "সর্বশেষ সরকারি নোটিশ", en: "Latest Government Notices" }}
        description={{
          bn: "সরকারি বিভাগ ও সংস্থার সর্বশেষ নোটিশ, প্রজ্ঞাপন ও ঘোষণা — ক্যাটাগরি অনুযায়ী সাজানো।",
          en: "Latest official government notices, gazettes and announcements — organized category-wise from official sources.",
        }}
        breadcrumbs={[
          { label: { bn: "হোম", en: "Home" }, href: "/" },
          { label: { bn: "নোটিশ", en: "Notices" } },
        ]}
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Select a Category to View Notices
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Choose a service sector below to see all active announcements scraped directly from ministry portals.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-card">
            <p className="text-sm font-medium text-slate-500">No categories found.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((cat, i) => {
              const noticeCount = cat.noticeCount ?? cat.notice_count ?? 0;
              const newNoticeCount = cat.newNoticeCount ?? cat.new_notice_count ?? 0;

              return (
                <Reveal key={cat.id} as="li" delay={(i % 4) * 50} className="flex h-full flex-col">
                  <Link
                    href={`/notices/${cat.slug}`}
                    className="group flex h-full flex-1 flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-transform duration-300 group-hover:-translate-y-1">
                          <Icon name={cat.icon || "Folder"} className="h-6 w-6" />
                        </span>

                        <div className="flex flex-col items-end gap-1">
                          {newNoticeCount > 0 ? (
                            <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {newNoticeCount} new
                            </span>
                          ) : (
                            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-500">
                              {noticeCount} notices
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                        {cat.description || "Official notices and advisories"}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 group-hover:underline">
                        View notices
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
