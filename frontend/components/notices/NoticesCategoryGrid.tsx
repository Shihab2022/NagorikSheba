"use client";

import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslation } from "@/lib/i18n";

export interface NoticeCategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  noticeCount?: number;
  notice_count?: number;
  newNoticeCount?: number;
  new_notice_count?: number;
}

interface NoticesCategoryGridProps {
  categories: NoticeCategoryItem[];
  basePath?: string;
  showHeader?: boolean;
}

const STRINGS = {
  bn: {
    heading: "ক্যাটাগরি নির্বাচন করুন",
    subheading: "সরকারি দপ্তর ও পোর্টালে প্রকাশিত সর্বশেষ বিজ্ঞপ্তি দেখতে নিচের ক্যাটাগরিগুলো ব্রাউজ করুন।",
    empty: "কোনো ক্যাটাগরি পাওয়া যায়নি।",
    notices: "টি নোটিশ",
    newBadge: "নতুন",
    viewNotices: "নোটিশসমূহ দেখুন",
  },
  en: {
    heading: "Select a Category to View Notices",
    subheading: "Choose a service sector below to see all active announcements scraped directly from ministry portals.",
    empty: "No categories found.",
    notices: "notices",
    newBadge: "new",
    viewNotices: "View notices",
  },
};

export function NoticesCategoryGrid({
  categories = [],
  basePath = "/notices",
  showHeader = true,
}: NoticesCategoryGridProps) {
  const { t } = useTranslation();
  const s = t(STRINGS);

  return (
    <div className="w-full">
      {showHeader && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {s.heading}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {s.subheading}
          </p>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-card">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
            <Bell className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-medium text-slate-500">{s.empty}</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat, i) => {
            const noticeCount = cat.noticeCount ?? cat.notice_count ?? 0;
            const newNoticeCount = cat.newNoticeCount ?? cat.new_notice_count ?? 0;
            const targetHref = `${basePath.replace(/\/+$/, "")}/${cat.slug}`;

            return (
              <Reveal key={cat.id} as="li" delay={(i % 4) * 40} className="flex h-full flex-col">
                <Link
                  href={targetHref}
                  className="group flex h-full flex-1 flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-transform duration-300 group-hover:-translate-y-1">
                        <Icon name={cat.icon || "Folder"} className="h-6 w-6" />
                      </span>

                      <div className="flex flex-col items-end gap-1">
                        {newNoticeCount > 0 ? (
                          <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {newNoticeCount} {s.newBadge}
                          </span>
                        ) : (
                          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-500">
                            {noticeCount} {s.notices}
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
                      {s.viewNotices}
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
  );
}
