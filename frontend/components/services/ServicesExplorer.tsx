"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  RotateCcw,
  Search,
  SearchX,
  X,
  Loader2,
} from "lucide-react";
import { ServiceCard } from "@/components/services/ServiceCard";
import { EmptyState, SkeletonCard } from "@/components/ui/States";
import { CustomLoader } from "@/components/ui/CustomLoader";
import { Select } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
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
    searchPlaceholder: "সেবার নাম বা বিবরণ লিখে খুঁজুন…",
    department: "বিভাগ",
    allDepartments: "সব বিভাগ",
    availability: "প্রাপ্যতা",
    allServices: "সব ধরনের সেবা",
    onlineAvailable: "অনলাইনে উপলব্ধ",
    officeVisitRequired: "অফিসে উপস্থিত হতে হবে",
    sortBy: "সাজান",
    mostPopular: "সর্বাধিক জনপ্রিয়",
    nameAz: "নাম: ক – ঁ (A – Z)",
    nameZa: "নাম: ঁ – ক (Z – A)",
    categoryFilter: "ক্যাটাগরি অনুযায়ী ফিল্টার",
    allCategories: "সকল ক্যাটাগরি",
    showing: "{shown} টি দেখানো হচ্ছে, মোট {total} টি সেবার মধ্যে",
    resetFilters: "ফিল্টার রিসেট",
    serverLoading: "লোড হচ্ছে…",
  },
  en: {
    filters: "Filters",
    clearAll: "Clear all",
    searchLabel: "Search services",
    searchPlaceholder: "Search by service name or description…",
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
    serverLoading: "Loading from server…",
  },
};

export interface ServicesExplorerProps {
  initialServices?: GovernmentService[];
  initialCategories?: ServiceCategory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  initialQuery?: string;
  initialCategory?: string;
  initialDepartment?: string;
  initialAvailability?: string;
  initialSort?: SortKey;
  departments?: string[];
}

/**
 * High-performance Server-Controlled Services Explorer:
 * - Controlled purely via Server Components and URL query params.
 * - Fast loading: ONLY the current page's slice (e.g. 12 items) is transmitted.
 * - Interactive toolbar filters update the URL search params seamlessly.
 */
export function ServicesExplorer({
  initialServices = [],
  initialCategories = [],
  pagination,
  initialQuery = "",
  initialCategory = "all",
  initialDepartment = "all",
  initialAvailability = "all",
  initialSort = "popular",
  departments = [],
}: ServicesExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { t } = useTranslation();
  const s = t(STRINGS);
  const c = t(COMMON);

  // Local state for immediate typing responsiveness
  const [searchInput, setSearchInput] = useState(initialQuery);

  const activeCategory = searchParams.get("category") || initialCategory || "all";
  const activeDept = searchParams.get("department") || initialDepartment || "all";
  const activeAvail = searchParams.get("availability") || initialAvailability || "all";
  const activeSort = (searchParams.get("sort") as SortKey) || initialSort || "popular";

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  // Department options from list or categories
  const deptList = useMemo(() => {
    if (departments.length > 0) return departments;
    return Array.from(new Set(initialServices.map((x) => x.department))).filter(Boolean).sort();
  }, [departments, initialServices]);

  // Helper to push URL query updates to server
  const updateUrl = (updates: Record<string, string | number | undefined | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        value === "all" ||
        (key === "page" && Number(value) === 1)
      ) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${nextParams.toString()}`, { scroll: false });
    });
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateUrl({ q: searchInput.trim(), page: 1 });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    updateUrl({ q: "", page: 1 });
  };

  const handleCategorySelect = (slug: string) => {
    updateUrl({ category: slug, page: 1 });
  };

  const handleDepartmentChange = (dept: string) => {
    updateUrl({ department: dept, page: 1 });
  };

  const handleAvailabilityChange = (avail: string) => {
    updateUrl({ availability: avail, page: 1 });
  };

  const handleSortChange = (newSort: SortKey) => {
    updateUrl({ sort: newSort, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handleResetAll = () => {
    setSearchInput("");
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const hasFilters =
    activeCategory !== "all" ||
    activeDept !== "all" ||
    activeAvail !== "all" ||
    Boolean(searchParams.get("q"));

  return (
    <div className="space-y-6">
      {/* Top Filter Toolbar Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-sm space-y-4">
        {/* Row 1: Search Form + Dropdowns */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search Box */}
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="svc-search"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onBlur={() => {
                if (searchInput !== (searchParams.get("q") || "")) {
                  handleSearchSubmit();
                }
              }}
              placeholder={s.searchPlaceholder}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9.5 pr-8 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            {searchInput ? (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>

          {/* Department Filter */}
          <div>
            <Select
              id="svc-dept"
              value={activeDept}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className="h-10 text-xs font-semibold rounded-xl border-slate-200 bg-slate-50/70"
            >
              <option value="all">{s.allDepartments}</option>
              {deptList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </div>

          {/* Availability Filter */}
          <div>
            <Select
              id="svc-avail"
              value={activeAvail}
              onChange={(e) => handleAvailabilityChange(e.target.value)}
              className="h-10 text-xs font-semibold rounded-xl border-slate-200 bg-slate-50/70"
            >
              <option value="all">{s.allServices}</option>
              <option value="online">{s.onlineAvailable}</option>
              <option value="office">{s.officeVisitRequired}</option>
            </Select>
          </div>

          {/* Sort By & Reset Action */}
          <div className="flex items-center gap-2">
            <Select
              id="svc-sort"
              value={activeSort}
              onChange={(e) => handleSortChange(e.target.value as SortKey)}
              className="h-10 text-xs font-semibold rounded-xl border-slate-200 bg-slate-50/70 flex-1"
            >
              <option value="popular">{s.mostPopular}</option>
              <option value="az">{s.nameAz}</option>
              <option value="za">{s.nameZa}</option>
            </Select>

            {hasFilters && (
              <button
                type="button"
                onClick={handleResetAll}
                title={s.clearAll}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-flag-200 hover:bg-flag-50 hover:text-flag-700 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        {/* Row 2: Category Pills Slider */}
        <div className="border-t border-slate-100 pt-3">
          <div
            className="scrollbar-none flex w-full gap-2 overflow-x-auto pb-1 scroll-smooth"
            role="group"
            aria-label={s.categoryFilter}
          >
            <button
              type="button"
              aria-pressed={activeCategory === "all"}
              onClick={() => handleCategorySelect("all")}
              className={cn(
                "shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer",
                activeCategory === "all"
                  ? "bg-brand-600 text-white shadow-sm shadow-brand-600/30 font-black"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:bg-slate-50 hover:text-brand-800",
              )}
            >
              {s.allCategories}
            </button>

            {initialCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                aria-pressed={activeCategory === cat.slug}
                onClick={() => handleCategorySelect(cat.slug)}
                className={cn(
                  "shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer",
                  activeCategory === cat.slug
                    ? "bg-brand-600 text-white shadow-sm shadow-brand-600/30 font-black"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:bg-slate-50 hover:text-brand-800",
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Meta Bar: Server status and Showing count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold text-slate-500" role="status" aria-live="polite">
            {s.showing
              .replace("{shown}", String(initialServices.length))
              .replace("{total}", String(pagination.total))}
          </p>

          {isPending && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 animate-pulse">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {s.serverLoading}
            </span>
          )}
        </div>

        {totalPages > 1 && (
          <p className="text-xs font-bold text-slate-400">
            পৃষ্ঠা {pagination.page} / {totalPages}
          </p>
        )}
      </div>

      {/* Services Grid (Server Paginated Slice) */}
      <div className="relative min-h-[280px]">
        {isPending && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-xs">
            <CustomLoader
              size="md"
              message="সেবা তালিকা ফিল্টার হচ্ছে..."
              subMessage="অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন"
            />
          </div>
        )}

        {initialServices.length === 0 ? (
          <EmptyState
            title={c.noServices}
            description={c.tryFilters}
            icon={<SearchX className="h-7 w-7 text-slate-300" aria-hidden="true" />}
            action={
              <button
                type="button"
                onClick={handleResetAll}
                className="inline-flex h-9 items-center rounded-xl bg-brand-600 px-4 text-xs font-bold text-white transition-colors hover:bg-brand-700 shadow-sm cursor-pointer"
              >
                {s.resetFilters}
              </button>
            }
          />
        ) : (
          <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200", isPending ? "opacity-30 pointer-events-none" : "opacity-100")}>
            {initialServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>

      {/* Server Pagination Control */}
      <Pagination
        currentPage={pagination.page}
        totalPages={totalPages}
        totalItems={pagination.total}
        itemsPerPage={pagination.limit}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default ServicesExplorer;
