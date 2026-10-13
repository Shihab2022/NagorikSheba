"use client";

import { useMemo, useState } from "react";
import { Search, SearchX, SlidersHorizontal, ChevronDown } from "lucide-react";
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
 * online filter and sorting with a short simulated loading state.
 */
export function ServicesExplorer({ initialQuery = "" }: { initialQuery?: string }) {
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
    category !== "all" || department !== "all" || availability !== "all" || query !== "";

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
    <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
      {/* Filters: collapsible panel on mobile, sticky sidebar on desktop */}
      <div className="lg:sticky lg:top-28">
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          aria-controls="service-filters"
          className="flex w-full items-center justify-between gap-2 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-card transition-colors hover:border-brand-300 lg:hidden"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-brand-600" aria-hidden="true" />
            {s.filters}
            {activeFilterCount > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs font-bold text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-slate-400 transition-transform duration-200",
              filtersOpen && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>

        <aside
          id="service-filters"
          aria-label={s.filters}
          className={cn(
            "mt-3 rounded-2xl border border-line bg-white p-5 shadow-card lg:mt-0 lg:block",
            filtersOpen ? "block" : "hidden",
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="hidden items-center gap-2 text-sm font-bold text-slate-900 lg:flex">
              <SlidersHorizontal className="h-4 w-4 text-brand-600" aria-hidden="true" />
              {s.filters}
            </h2>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-bold text-flag-600 hover:text-flag-700 lg:ml-auto"
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
            className="h-11 w-full rounded-xl border border-line bg-white pl-9 pr-3 text-sm transition-all placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
          />
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
      <div>
        <div
          className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-2"
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
          {CATEGORIES.map((cat) => (
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

        <p className="mt-3 text-sm text-slate-500" role="status" aria-live="polite">
          {s.showing
            .replace("{shown}", String(results.length))
            .replace("{total}", String(SERVICES.length))}
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
