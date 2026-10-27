"use client";

import { useMemo, useState } from "react";
import { Search, SearchX, SlidersHorizontal, ChevronDown } from "lucide-react";
import { ServiceCard } from "@/components/services/ServiceCard";
import { EmptyState, SkeletonCard } from "@/components/ui/States";
import { Select } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { COMMON } from "@/lib/i18n/common";
import type { GovernmentService, ServiceCategory } from "@/lib/types";

type SortKey = "popular" | "az" | "za";

const STRINGS = {
  bn: {
    filters: "ফিল্টার",
    clearAll: "সব মুছুন",
    searchLabel: "সেবা অনুসন্ধান করুন",
    searchPlaceholder: "সেবা অনুসন্ধান করুন…",
    department: "বিভাগ",
    allDepartments: "সব বিভাগ",
    availability: "প্রাপ্যতা",
    allServices: "সব সেবা",
    onlineAvailable: "অনলাইনে পাওয়া যায়",
    officeVisitRequired: "অফিসে যেতে হবে",
    sortBy: "সাজান",
    mostPopular: "সর্বাধিক জনপ্রিয়",
    nameAz: "নাম: A – Z",
    nameZa: "নাম: Z – A",
    categoryFilter: "বিভাগ অনুযায়ী ফিল্টার",
    allCategories: "সব ক্যাটাগরি",
    showing: "{shown} টি দেখানো হচ্ছে, মোট {total} টি সেবার মধ্যে",
    resetFilters: "ফিল্টার রিসেট",
  },
  en: {
    filters: "Filters",
    clearAll: "Clear all",
    searchLabel: "Search services",
    searchPlaceholder: "Search services…",
    department: "Department",
    allDepartments: "All departments",
    availability: "Availability",
    allServices: "All services",
    onlineAvailable: "Online available",
    officeVisitRequired: "Office visit required",
    sortBy: "Sort by",
    mostPopular: "Most popular",
    nameAz: "Name: A – Z",
    nameZa: "Name: Z – A",
    categoryFilter: "Filter by category",
    allCategories: "All Categories",
    showing: "Showing {shown} of {total} services",
    resetFilters: "Reset filters",
  },
};

/**
 * Client-side services explorer: search, category chips, department,
 * online filter and sorting with live backend data.
 */
export function ServicesExplorer({
  initialQuery = "",
  initialCategory = "all",
  initialServices = [],
  initialCategories = [],
}: {
  initialQuery?: string;
  initialCategory?: string;
  initialServices?: GovernmentService[];
  initialCategories?: ServiceCategory[];
}) {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const c = t(COMMON);
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory || "all");
  const [department, setDepartment] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const departments = useMemo(() => {
    return Array.from(new Set(initialServices.map((x) => x.department))).filter(Boolean).sort();
  }, [initialServices]);

  function update<T>(setter: (v: T) => void, value: T) {
    setter(value);
    setLoading(true);
    window.setTimeout(() => setLoading(false), 200);
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = initialServices.filter((svc) => {
      const matchesQuery =
        !q ||
        svc.name.toLowerCase().includes(q) ||
        svc.description.toLowerCase().includes(q) ||
        svc.department.toLowerCase().includes(q);
      const matchesCategory = category === "all" || svc.category === category;
      const matchesDept = department === "all" || svc.department === department;
      const matchesAvail =
        availability === "all" ||
        (availability === "online" && svc.isOnline) ||
        (availability === "office" && svc.requiresOfficeVisit);
      return matchesQuery && matchesCategory && matchesDept && matchesAvail;
    });
    return [...list].sort((a, b) => {
      if (sort === "popular") return b.popularity - a.popularity;
      if (sort === "az") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });
  }, [query, category, department, availability, sort, initialServices]);

  const hasFilters =
    category !== "all" ||
    department !== "all" ||
    availability !== "all" ||
    query !== "";

  const activeFilterCount =
    (category !== "all" ? 1 : 0) +
    (department !== "all" ? 1 : 0) +
    (availability !== "all" ? 1 : 0) +
    (query.trim() !== "" ? 1 : 0);

  function clearAll() {
    setQuery("");
    setCategory("all");
    setDepartment("all");
    setAvailability("all");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
      {/* Mobile filter toggle */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          aria-expanded={filtersOpen}
          aria-controls="services-filter-drawer"
          className="flex w-full items-center justify-between rounded-2xl border border-line bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-brand-600" aria-hidden="true" />
            {s.filters}
            {activeFilterCount > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-[11px] font-bold text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </span>
          <ChevronDown
            className={cn("h-4 w-4 text-slate-400 transition-transform", filtersOpen && "rotate-180")}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Sidebar Filters */}
      <div
        id="services-filter-drawer"
        className={cn(
          "rounded-2xl border border-line bg-white p-5 shadow-card lg:block",
          filtersOpen ? "block" : "hidden",
        )}
      >
        <aside aria-label={s.filters}>
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <SlidersHorizontal className="h-4 w-4 text-brand-600" aria-hidden="true" />
              {s.filters}
            </h2>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-semibold text-brand-700 hover:underline"
              >
                {s.clearAll}
              </button>
            ) : null}
          </div>

          <div className="mt-4">
            <label
              htmlFor="svc-search"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              {s.searchLabel}
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="svc-search"
                type="search"
                value={query}
                onChange={(e) => update(setQuery, e.target.value)}
                placeholder={s.searchPlaceholder}
                className="h-10 w-full rounded-xl border border-line bg-canvas pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="svc-dept"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              {s.department}
            </label>
            <Select
              id="svc-dept"
              value={department}
              onChange={(e) => update(setDepartment, e.target.value)}
            >
              <option value="all">{s.allDepartments}</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </div>

          <div className="mt-4">
            <label
              htmlFor="svc-avail"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              {s.availability}
            </label>
            <Select
              id="svc-avail"
              value={availability}
              onChange={(e) => update(setAvailability, e.target.value)}
            >
              <option value="all">{s.allServices}</option>
              <option value="online">{s.onlineAvailable}</option>
              <option value="office">{s.officeVisitRequired}</option>
            </Select>
          </div>

          <div className="mt-4">
            <label
              htmlFor="svc-sort"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              {s.sortBy}
            </label>
            <Select
              id="svc-sort"
              value={sort}
              onChange={(e) => update(setSort, e.target.value as SortKey)}
            >
              <option value="popular">{s.mostPopular}</option>
              <option value="az">{s.nameAz}</option>
              <option value="za">{s.nameZa}</option>
            </Select>
          </div>
        </aside>
      </div>

      {/* Results */}
      <div className="min-w-0">
        <div
          className="scrollbar-none flex w-full gap-2 overflow-x-auto pb-2 scroll-smooth"
          role="group"
          aria-label={s.categoryFilter}
        >
          <button
            type="button"
            aria-pressed={category === "all"}
            onClick={() => update(setCategory, "all")}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all sm:text-sm",
              category === "all"
                ? "bg-brand-600 text-white shadow-sm"
                : "border border-line bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700",
            )}
          >
            {s.allCategories}
          </button>
          {initialCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              aria-pressed={category === cat.slug}
              onClick={() => update(setCategory, cat.slug)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all sm:text-sm",
                category === cat.slug
                  ? "bg-brand-600 text-white shadow-sm"
                  : "border border-line bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <p
          className="mt-3 text-sm text-slate-500"
          role="status"
          aria-live="polite"
        >
          {s.showing
            .replace("{shown}", String(results.length))
            .replace("{total}", String(initialServices.length))}
        </p>

        <div className="mt-4">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              title={c.noServices}
              description={c.tryFilters}
              icon={<SearchX className="h-7 w-7" aria-hidden="true" />}
              action={
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex h-10 items-center rounded-xl bg-brand-600 px-4 text-sm font-bold text-white transition-colors hover:bg-brand-700"
                >
                  {s.resetFilters}
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServicesExplorer;
