"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Calendar,
  Building,
  Globe,
  Bell,
  Search,
  X,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { NoticeItem } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
}

export interface CategoryFilterItem {
  id: string;
  name: string;
  slug: string;
  noticeCount?: number;
  notice_count?: number;
}

interface CategoryNoticesExplorerProps {
  category: CategorySummary;
  items: NoticeItem[];
  allCategories: CategoryFilterItem[];
  page: number;
  totalPages: number;
  total: number;
  basePath?: string;
  isDashboard?: boolean;
}

const STRINGS = {
  bn: {
    allNotices: "সকল নোটিশ",
    noticesSuffix: "নোটিশসমূহ",
    defaultDesc: "অফিসিয়াল সরকারি নোটিশ, প্রজ্ঞাপন এবং নির্দেশিকা।",
    noticeSingle: "টি নোটিশ",
    noticePlural: "টি নোটিশ",
    categoryLabel: "ক্যাটাগরি:",
    searchPlaceholder: "এই ক্যাটাগরির নোটিশ বা শিরোনাম খুঁজুন...",
    noNoticesTitle: "এখনও কোনো নোটিশ প্রকাশিত হয়নি",
    noNoticesDesc: "এই ক্যাটাগরির জন্য সরকারি কোনো সক্রিয় ঘোষণা বা নোটিশ পাওয়া যায়নি।",
    noSearchMatch: "কোনো নোটিশ খুঁজে পাওয়া যায়নি।",
    clearSearch: "অনুসন্ধান মুছুন",
    viewOfficial: "মূল নোটিশ দেখুন",
    details: "বিস্তারিত",
    hideDetails: "সংক্ষেপ করুন",
    source: "উৎস:",
    publishedOn: "প্রকাশের তারিখ:",
    previous: "পূর্ববর্তী",
    next: "পরবর্তী",
    pageOf: "পৃষ্ঠা {current} / {total}",
    verifiedOfficial: "যাচাইকৃত সরকারি উৎস",
  },
  en: {
    allNotices: "All Notices",
    noticesSuffix: "Notices",
    defaultDesc: "Official government notices, circulars, and gazettes.",
    noticeSingle: "Notice",
    noticePlural: "Notices",
    categoryLabel: "Category:",
    searchPlaceholder: "Search notices or keywords in this category...",
    noNoticesTitle: "No notices published yet",
    noNoticesDesc: "There are currently no active public announcements scraped or added for this category.",
    noSearchMatch: "No matching notices found.",
    clearSearch: "Clear search",
    viewOfficial: "View Official Notice",
    details: "Details",
    hideDetails: "Hide details",
    source: "Source:",
    publishedOn: "Published:",
    previous: "Previous",
    next: "Next",
    pageOf: "Page {current} of {total}",
    verifiedOfficial: "Verified official source",
  },
};

function getHostname(urlStr: string): string {
  try {
    return new URL(urlStr).hostname;
  } catch {
    return "Official Portal";
  }
}

function formatDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Dhaka",
    });
  } catch {
    return null;
  }
}

export function CategoryNoticesExplorer({
  category,
  items = [],
  allCategories = [],
  page = 1,
  totalPages = 1,
  total = 0,
  basePath = "/notices",
  isDashboard = false,
}: CategoryNoticesExplorerProps) {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  const cleanBasePath = basePath.replace(/\/+$/, "");

  // Client-side quick filter
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((n) => {
      const titleMatch = (n.title || "").toLowerCase().includes(q);
      const sourceMatch = (n.sourceName || "").toLowerCase().includes(q);
      return titleMatch || sourceMatch;
    });
  }, [items, searchQuery]);

  return (
    <div className={cn("w-full space-y-6", !isDashboard && "min-h-screen bg-canvas/30 pb-16")}>
      {/* Category Hero / Header */}
      <section className={cn("rounded-2xl border border-line bg-white shadow-card", !isDashboard && "p-6 sm:p-8")}>
        <div className={cn(isDashboard ? "p-5 sm:p-6" : "")}>
          <div className="mb-4">
            <Link
              href={cleanBasePath}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-700 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {s.allNotices}
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 border border-brand-100">
                <Icon name={category.icon || "Folder"} className="h-6 w-6 sm:h-7 sm:w-7" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {category.name} {s.noticesSuffix}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl line-clamp-2">
                  {category.description || s.defaultDesc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold text-slate-700 border border-slate-200">
                <Bell className="h-3.5 w-3.5 text-brand-600" />
                {total} {total === 1 ? s.noticeSingle : s.noticePlural}
              </span>
            </div>
          </div>

          {/* Dynamic Category Filter Chips */}
          {allCategories.length > 0 && (
            <div className="mt-6 pt-4 border-t border-line/60 overflow-x-auto no-scrollbar flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider mr-1">
                {s.categoryLabel}
              </span>
              {allCategories.map((cat) => {
                const isActive = cat.slug === category.slug;
                const count = cat.noticeCount ?? cat.notice_count ?? 0;
                return (
                  <Link
                    key={cat.id}
                    href={`${cleanBasePath}/${cat.slug}`}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shrink-0 transition-all border",
                      isActive
                        ? "bg-brand-700 text-white border-brand-700 shadow-sm"
                        : "bg-white text-slate-600 border-line hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50/50"
                    )}
                  >
                    <span>{cat.name}</span>
                    {count > 0 && (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                          isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Filter / Search Bar */}
      {items.length > 0 && (
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={s.searchPlaceholder}
            className="h-11 w-full rounded-xl border border-line bg-white pr-10 pl-11 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              aria-label={s.clearSearch}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Notices List */}
      <main className="w-full">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-line bg-white p-12 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Bell className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-800">{s.noNoticesTitle}</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
              {s.noNoticesDesc}
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white p-10 text-center shadow-card">
            <p className="text-sm font-semibold text-slate-700">{s.noSearchMatch}</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:underline"
            >
              {s.clearSearch}
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredItems.map((notice, idx) => {
              const hostname = getHostname(notice.url);
              const isExpanded = expandedId === notice.id;

              return (
                <Reveal key={notice.id} delay={(idx % 6) * 30}>
                  <article className="group relative rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-200 hover:border-brand-200 hover:shadow-lift">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-100">
                            <Building className="h-3 w-3" />
                            {notice.sourceName || "Government Portal"}
                          </span>

                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-100">
                            <Globe className="h-3 w-3 text-slate-400" />
                            {hostname}
                          </span>

                          {notice.publishedAt && formatDate(notice.publishedAt) && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                              <Calendar className="h-3 w-3 text-slate-400" />
                              {formatDate(notice.publishedAt)}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                          <a
                            href={notice.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="focus:outline-none focus:underline"
                          >
                            {notice.title}
                          </a>
                        </h2>

                        {/* Toggleable Details Drawer / In-place Details */}
                        {isExpanded && (
                          <div className="mt-3 rounded-xl border border-line bg-slate-50/70 p-3.5 text-xs text-slate-600 space-y-1.5 animate-in fade-in duration-200">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-700">{s.source}</span>
                              <span>{notice.sourceName || "Government Portal"} ({hostname})</span>
                            </div>
                            {notice.publishedAt && formatDate(notice.publishedAt) && (
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-700">{s.publishedOn}</span>
                                <span>{formatDate(notice.publishedAt)}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold pt-1">
                              <FileText className="h-3.5 w-3.5" />
                              <span>{s.verifiedOfficial}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0 pt-1">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : notice.id)}
                          className="inline-flex items-center gap-1 rounded-xl border border-line bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          {isExpanded ? s.hideDetails : s.details}
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>

                        <a
                          href={notice.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-brand-50 px-3.5 py-2 text-xs font-bold text-brand-700 hover:bg-brand-100 hover:border-brand-200 transition-all shadow-sm"
                        >
                          {s.viewOfficial}
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && !searchQuery && (
              <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
                <div>
                  {page > 1 ? (
                    <Link
                      href={`${cleanBasePath}/${category.slug}?page=${page - 1}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-brand-300 hover:text-brand-700 shadow-sm"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      {s.previous}
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-line/40 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-300 cursor-not-allowed">
                      <ArrowLeft className="h-3.5 w-3.5" />
                      {s.previous}
                    </span>
                  )}
                </div>

                <span className="text-xs font-medium text-slate-500">
                  {s.pageOf.replace("{current}", String(page)).replace("{total}", String(totalPages))}
                </span>

                <div>
                  {page < totalPages ? (
                    <Link
                      href={`${cleanBasePath}/${category.slug}?page=${page + 1}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-brand-300 hover:text-brand-700 shadow-sm"
                    >
                      {s.next}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-line/40 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-300 cursor-not-allowed">
                      {s.next}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
