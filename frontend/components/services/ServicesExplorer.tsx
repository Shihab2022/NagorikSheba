"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  RotateCcw,
  Search,
  SearchX,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ServiceCard } from "@/components/services/ServiceCard";
import { EmptyState } from "@/components/ui/States";
import { CustomLoader } from "@/components/ui/CustomLoader";
import { Select } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { cn } from "@/lib/utils";
import type { GovernmentService, ServiceCategory } from "@/lib/types";

type SortKey = "popular" | "az" | "za";

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

  // Local state for immediate typing responsiveness
  const [searchInput, setSearchInput] = useState(initialQuery);

  const activeCategory = searchParams.get("category") || initialCategory || "all";
  const activeDept = searchParams.get("department") || initialDepartment || "all";
  const activeAvail = searchParams.get("availability") || initialAvailability || "all";
  const activeSort = (searchParams.get("sort") as SortKey) || initialSort || "popular";

  // Slider navigation & desktop scroll support
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, initialCategories]);

  // Auto-scroll active category into view
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const activePill = el.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (activePill) {
      activePill.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeCategory]);

  const scroll = (direction: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    const distance = 260;
    el.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  // Convert mouse wheel vertical scroll into horizontal slider movement on desktop
  const handleWheel = (e: React.WheelEvent) => {
    const el = sliderRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && el.scrollWidth > el.clientWidth) {
      el.scrollLeft += e.deltaY;
    }
  };

  // Drag-to-scroll support for desktop mouse
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    const el = sliderRef.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftStart.current = el.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const el = sliderRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    el.scrollLeft = scrollLeftStart.current - walk;
  };

  const onMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  // Derive department options
  const deptList = useMemo(() => {
    if (departments.length > 0) return departments;
    const depts = new Set<string>();
    initialServices.forEach((s) => {
      if (s.department) depts.add(s.department);
    });
    return Array.from(depts).sort((a, b) => a.localeCompare(b));
  }, [departments, initialServices]);

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset pagination to page 1 whenever filters or search change
    if (!("page" in updates)) {
      params.delete("page");
    }

    startTransition(() => {
      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(targetUrl, { scroll: false });
    });
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateFilters({ q: searchInput.trim() || null });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    updateFilters({ q: null });
  };

  const handleCategorySelect = (slug: string) => {
    updateFilters({ category: slug === "all" ? null : slug });
  };

  const handleDepartmentChange = (dept: string) => {
    updateFilters({ department: dept === "all" ? null : dept });
  };

  const handleAvailabilityChange = (avail: string) => {
    updateFilters({ availability: avail === "all" ? null : avail });
  };

  const handleSortChange = (sort: SortKey) => {
    updateFilters({ sort: sort === "popular" ? null : sort });
  };

  const handleResetAll = () => {
    setSearchInput("");
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(newPage));
    }

    startTransition(() => {
      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(targetUrl, { scroll: true });
    });
  };

  const hasFilters = Boolean(
    searchParams.get("q") ||
      (searchParams.get("category") && searchParams.get("category") !== "all") ||
      (searchParams.get("department") && searchParams.get("department") !== "all") ||
      (searchParams.get("availability") && searchParams.get("availability") !== "all") ||
      (searchParams.get("sort") && searchParams.get("sort") !== "popular"),
  );

  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.limit));

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="space-y-4 rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
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
              placeholder="Search by service name or description…"
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9.5 pr-8 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            {searchInput ? (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
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
              <option value="all">All departments</option>
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
              <option value="all">All services</option>
              <option value="online">Online available</option>
              <option value="office">Office visit required</option>
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
              <option value="popular">Most popular</option>
              <option value="az">Name: A – Z</option>
              <option value="za">Name: Z – A</option>
            </Select>

            {hasFilters && (
              <button
                type="button"
                onClick={handleResetAll}
                title="Clear all"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-flag-200 hover:bg-flag-50 hover:text-flag-700 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        {/* Row 2: Category Pills Slider with Desktop Left/Right Controls & Drag-to-Scroll */}
        <div className="relative border-t border-slate-100 pt-3">
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <div className="absolute left-0 top-3 bottom-0 z-10 flex items-center pr-3 bg-gradient-to-r from-white via-white/95 to-transparent">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll categories left"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-transform hover:scale-105 hover:border-brand-300 hover:text-brand-700 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Right Arrow Button */}
          {canScrollRight && (
            <div className="absolute right-0 top-3 bottom-0 z-10 flex items-center pl-3 bg-gradient-to-l from-white via-white/95 to-transparent">
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll categories right"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-transform hover:scale-105 hover:border-brand-300 hover:text-brand-700 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          <div
            ref={sliderRef}
            onWheel={handleWheel}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUpOrLeave}
            onMouseLeave={onMouseUpOrLeave}
            className="scrollbar-none flex w-full gap-2 overflow-x-auto pb-1 scroll-smooth select-none cursor-grab active:cursor-grabbing"
            role="group"
            aria-label="Filter by category"
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
              All Categories
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
            Showing {initialServices.length} of {pagination.total} services
          </p>

          {isPending && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 animate-pulse">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading from server…
            </span>
          )}
        </div>

        {totalPages > 1 && (
          <p className="text-xs font-bold text-slate-400">
            Page {pagination.page} of {totalPages}
          </p>
        )}
      </div>

      {/* Services Grid (Server Paginated Slice) */}
      <div className="relative min-h-[280px]">
        {isPending && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-xs">
            <CustomLoader
              size="md"
              message="Filtering services..."
              subMessage="Please wait a moment"
            />
          </div>
        )}

        {initialServices.length === 0 ? (
          <EmptyState
            title="No services found"
            description="Try adjusting your search or filter terms to find what you need."
            icon={<SearchX className="h-7 w-7 text-slate-300" aria-hidden="true" />}
            action={
              <button
                type="button"
                onClick={handleResetAll}
                className="inline-flex h-9 items-center rounded-xl bg-brand-600 px-4 text-xs font-bold text-white transition-colors hover:bg-brand-700 shadow-sm cursor-pointer"
              >
                Reset filters
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
