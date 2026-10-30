"use client";

import { useMemo, useState } from "react";
import { Search, SearchX, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { SERVICES, getServiceDepartments } from "@/lib/data/services";
import { CATEGORIES } from "@/lib/data/categories";
import { ServiceCard } from "@/components/services/ServiceCard";
import { EmptyState, SkeletonCard } from "@/components/ui/States";
import { Select } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { COMMON } from "@/lib/i18n/common";

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
    showFilters: "ফিল্টার",
    hideFilters: "লুকান",
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
    showFilters: "Filters",
    hideFilters: "Hide",
  },
};

/**
 * Client-side services explorer:
 * 100% responsive on Mobile Phone, iPad/Tablet, Laptop, and Large Desktop.
 */
export function ServicesExplorer({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const c = t(COMMON);
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("all");
  const [department, setDepartment] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const departments = useMemo(() => getServiceDepartments(), []);

  function update<T>(setter: (v: T) => void, value: T) {
    setter(value);
    setLoading(true);
    window.setTimeout(() => setLoading(false), 320);
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = SERVICES.filter((s) => {
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q);
      const matchesCategory = category === "all" || s.category === category;
      const matchesDept = department === "all" || s.department === department;
      const matchesAvail =
        availability === "all" ||
        (availability === "online" && s.isOnline) ||
        (availability === "office" && s.requiresOfficeVisit);
      return matchesQuery && matchesCategory && matchesDept && matchesAvail;
    });
    return [...list].sort((a, b) => {
      if (sort === "popular") return b.popularity - a.popularity;
      if (sort === "az") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });
  }, [query, category, department, availability, sort]);

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
    <div className="w-full min-w-0 max-w-full">
      {/* =========================================================================
          PHONE & IPAD/TABLET TOP SEARCH & FILTER BAR (< 1024px)
          Always visible so users can search directly from any mobile/tablet device.
          ========================================================================= */}
      <div className="mb-4 block w-full lg:hidden">
        <div className="flex items-center gap-2">
          {/* Mobile search bar */}
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <label htmlFor="svc-search-mobile" className="sr-only">
              {s.searchLabel}
            </label>
            <input
              id="svc-search-mobile"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={s.searchPlaceholder}
              className="h-10 sm:h-11 w-full rounded-xl border border-line bg-white pl-8 sm:pl-9 pr-8 text-xs sm:text-sm text-slate-900 shadow-xs transition-all placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600"
                aria-label={s.clearAll}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>

          {/* Filter toggle button */}
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            aria-controls="mobile-service-filters"
            className={cn(
              "inline-flex h-10 sm:h-11 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-xs sm:text-sm font-bold shadow-xs transition-all",
              filtersOpen || activeFilterCount > 0
                ? "border-brand-600 bg-brand-50 text-brand-700"
                : "border-line bg-white text-slate-700 hover:border-brand-300",
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-600" aria-hidden="true" />
            <span className="inline">{s.filters}</span>
            {activeFilterCount > 0 ? (
              <span className="inline-flex h-4 min-w-4 sm:h-5 sm:min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] sm:text-xs font-bold text-white">
                {activeFilterCount}
              </span>
            ) : null}
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-slate-400 transition-transform duration-200",
                filtersOpen && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Collapsible filter options on Phone & iPad */}
        {filtersOpen ? (
          <div
            id="mobile-service-filters"
            className="mt-2.5 rounded-2xl border border-line bg-white p-3.5 shadow-card sm:p-5"
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-line/60">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {s.filters}
              </span>
              {hasFilters ? (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs font-bold text-flag-600 hover:text-flag-700"
                >
                  {s.clearAll}
                </button>
              ) : null}
            </div>

            {/* iPad: 3 columns, Phone: 1 column */}
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3.5">
              <div>
                <label
                  htmlFor="mobile-svc-dept"
                  className="mb-1 block text-xs font-bold text-slate-600"
                >
                  {s.department}
                </label>
                <Select
                  id="mobile-svc-dept"
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

              <div>
                <label
                  htmlFor="mobile-svc-avail"
                  className="mb-1 block text-xs font-bold text-slate-600"
                >
                  {s.availability}
                </label>
                <Select
                  id="mobile-svc-avail"
                  value={availability}
                  onChange={(e) => update(setAvailability, e.target.value)}
                >
                  <option value="all">{s.allServices}</option>
                  <option value="online">{s.onlineAvailable}</option>
                  <option value="office">{s.officeVisitRequired}</option>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="mobile-svc-sort"
                  className="mb-1 block text-xs font-bold text-slate-600"
                >
                  {s.sortBy}
                </label>
                <Select
                  id="mobile-svc-sort"
                  value={sort}
                  onChange={(e) => update(setSort, e.target.value as SortKey)}
                >
                  <option value="popular">{s.mostPopular}</option>
                  <option value="az">{s.nameAz}</option>
                  <option value="za">{s.nameZa}</option>
                </Select>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* =========================================================================
          MAIN EXPLORER LAYOUT:
          - Phone & iPad: flex-col (100% width, no track-expansion bug)
          - Desktop/Laptop (>= 1024px): 2-column with sticky sidebar
          ========================================================================= */}
      <div className="flex flex-col lg:grid lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)] 2xl:grid-cols-[300px_minmax(0,1fr)] gap-5 lg:gap-6 xl:gap-8 lg:items-start w-full min-w-0 max-w-full">
        {/* Desktop Sticky Sidebar (Visible on Laptop and Desktop only) */}
        <aside
          aria-label={s.filters}
          className="hidden rounded-2xl border border-line bg-white p-5 shadow-card lg:sticky lg:top-24 xl:top-28 lg:block"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <SlidersHorizontal className="h-4 w-4 text-brand-600" aria-hidden="true" />
              {s.filters}
            </h2>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-bold text-flag-600 hover:text-flag-700"
              >
                {s.clearAll}
              </button>
            ) : null}
          </div>

          <div className="relative mt-4">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <label htmlFor="svc-search" className="sr-only">
              {s.searchLabel}
            </label>
            <input
              id="svc-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={s.searchPlaceholder}
              className="h-11 w-full rounded-xl border border-line bg-white pl-9 pr-8 text-sm transition-all placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600"
                aria-label={s.clearAll}
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
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

        {/* Results Area */}
        <div className="w-full min-w-0 max-w-full">
          {/* Category Pills: Safely clipped horizontally to prevent blowout */}
          <div className="w-full max-w-full overflow-hidden pb-1">
            <div
              className="scrollbar-none flex w-full gap-2 overflow-x-auto pb-1.5 scroll-smooth touch-pan-x"
              role="group"
              aria-label={s.categoryFilter}
            >
              <button
                type="button"
                aria-pressed={category === "all"}
                onClick={() => update(setCategory, "all")}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all sm:px-4 sm:py-2 sm:text-sm",
                  category === "all"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "border border-line bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700",
                )}
              >
                {s.allCategories}
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={category === cat.slug}
                  onClick={() => update(setCategory, cat.slug)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all sm:px-4 sm:py-2 sm:text-sm",
                    category === cat.slug
                      ? "bg-brand-600 text-white shadow-sm"
                      : "border border-line bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700",
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results count status */}
          <div className="mt-2 flex items-center justify-between">
            <p
              className="text-xs sm:text-sm text-slate-500"
              role="status"
              aria-live="polite"
            >
              {s.showing
                .replace("{shown}", String(results.length))
                .replace("{total}", String(SERVICES.length))}
            </p>
          </div>

          {/* Responsive Card Grid:
              - Mobile (< 640px): 1 column (w-full cards)
              - Tablet / iPad (640px - 1023px): 2 columns
              - iPad Landscape / Small Laptop (1024px - 1279px): 2 columns + sidebar
              - Standard Laptop & Desktop (1280px - 1759px): 3 columns + sidebar
              - Ultra-wide (>= 1760px): 4 columns + sidebar
          */}
          <div className="mt-3.5 sm:mt-4 w-full">
            {loading ? (
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 min-[1760px]:grid-cols-4 sm:gap-5 w-full">
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
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 min-[1760px]:grid-cols-4 sm:gap-5 w-full">
                {results.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesExplorer;
