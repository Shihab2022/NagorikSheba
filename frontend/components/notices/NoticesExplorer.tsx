"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { NOTICE_CATEGORIES, NOTICES } from "@/lib/data/notices";
import { NoticeCard } from "@/components/notices/NoticeCard";
import { EmptyState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n";
import { COMMON } from "@/lib/i18n/common";

const STRINGS = {
  bn: {
    searchLabel: "নোটিশ অনুসন্ধান করুন",
    searchPlaceholder: "শিরোনাম, বিভাগ দিয়ে নোটিশ খুঁজুন…",
    category: "বিভাগ",
    department: "বিভাগ",
    allDepartments: "সব বিভাগ",
    date: "তারিখ",
    newestFirst: "সর্বশেষ আগে",
    oldestFirst: "সবচেয়ে পুরোনো আগে",
    showing: "দেখানো হচ্ছে {n} টি",
    clearFilters: "ফিল্টার মুছুন",
  },
  en: {
    searchLabel: "Search notices",
    searchPlaceholder: "Search notices by title, department...",
    category: "Category",
    department: "Department",
    allDepartments: "All departments",
    date: "Date",
    newestFirst: "Newest first",
    oldestFirst: "Oldest first",
    showing: "Showing {n}",
    clearFilters: "Clear filters",
  },
};

/** Searchable / filterable notice directory (client-side over mock data). */
export function NoticesExplorer() {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const c = t(COMMON);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const departments = useMemo(
    () => ["all", ...Array.from(new Set(NOTICES.map((n) => n.department)))],
    [],
  );
  const [department, setDepartment] = useState("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = NOTICES.filter((n) => {
      if (category !== "all" && n.category !== category) return false;
      if (department !== "all" && n.department !== department) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.department.toLowerCase().includes(q)
      );
    });
    return [...filtered].sort((a, b) =>
      sort === "newest"
        ? b.publishedAt.localeCompare(a.publishedAt)
        : a.publishedAt.localeCompare(b.publishedAt),
    );
  }, [query, category, department, sort]);

  function reset() {
    setQuery("");
    setCategory("all");
    setDepartment("all");
    setSort("newest");
  }

  return (
    <div>
      {/* Search + filters */}
      <div className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5">
        <label htmlFor="notice-search" className="sr-only">
          {s.searchLabel}
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="notice-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={s.searchPlaceholder}
            className="h-12 w-full rounded-xl border border-line bg-canvas pr-4 pl-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="notice-cat" className="mb-1.5 block text-xs font-bold text-slate-600">
              {s.category}
            </label>
            <select
              id="notice-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm font-medium text-slate-700 focus:border-brand-500 focus:outline-none"
            >
              {NOTICE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {t(c.label)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="notice-dept" className="mb-1.5 block text-xs font-bold text-slate-600">
              {s.department}
            </label>
            <select
              id="notice-dept"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm font-medium text-slate-700 focus:border-brand-500 focus:outline-none"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === "all" ? s.allDepartments : d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="notice-sort" className="mb-1.5 block text-xs font-bold text-slate-600">
              {s.date}
            </label>
            <select
              id="notice-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
              className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm font-medium text-slate-700 focus:border-brand-500 focus:outline-none"
            >
              <option value="newest">{s.newestFirst}</option>
              <option value="oldest">{s.oldestFirst}</option>
            </select>
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500" role="status" aria-live="polite">
        {s.showing.replace("{n}", String(results.length))}
      </p>

      {results.length > 0 ? (
        <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      ) : (
        <EmptyState
          className="mt-4"
          title={c.noNotices}
          description={c.tryFilters}
          action={
            <Button variant="outline" onClick={reset}>
              {s.clearFilters}
            </Button>
          }
        />
      )}
    </div>
  );
}

export default NoticesExplorer;
