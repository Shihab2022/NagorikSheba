"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
  showItemCount?: boolean;
}

const STRINGS = {
  bn: {
    prev: "পূর্ববর্তী",
    next: "পরবর্তী",
    showing: "{start}–{end} দেখানো হচ্ছে, মোট {total} টির মধ্যে",
  },
  en: {
    prev: "Previous",
    next: "Next",
    showing: "Showing {start}–{end} of {total}",
  },
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 12,
  className,
  showItemCount = true,
}: PaginationProps) {
  const { t } = useTranslation();
  const s = t(STRINGS);

  if (totalPages <= 1) return null;

  const startItem = totalItems !== undefined ? (currentPage - 1) * itemsPerPage + 1 : undefined;
  const endItem = totalItems !== undefined ? Math.min(currentPage * itemsPerPage, totalItems) : undefined;

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-6 sm:flex-row",
        className,
      )}
    >
      {/* Item count summary */}
      {showItemCount && totalItems !== undefined && startItem !== undefined && endItem !== undefined ? (
        <p className="text-xs font-bold text-slate-500">
          {s.showing
            .replace("{start}", String(startItem))
            .replace("{end}", String(endItem))
            .replace("{total}", String(totalItems))}
        </p>
      ) : (
        <div />
      )}

      {/* Pagination controls */}
      <nav aria-label="Pagination Navigation" className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label={s.prev}
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold transition-all",
            currentPage <= 1
              ? "cursor-not-allowed opacity-40 text-slate-400 border-slate-100"
              : "text-slate-700 hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-800 cursor-pointer shadow-xs",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{s.prev}</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex h-9 w-8 items-center justify-center text-slate-400"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              );
            }

            const isActive = p === currentPage;

            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-9 min-w-9 items-center justify-center rounded-xl px-2.5 text-xs font-black transition-all cursor-pointer",
                  isActive
                    ? "bg-brand-600 text-white shadow-sm shadow-brand-600/30 font-black scale-105"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:bg-brand-50/60 hover:text-brand-700",
                )}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label={s.next}
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold transition-all",
            currentPage >= totalPages
              ? "cursor-not-allowed opacity-40 text-slate-400 border-slate-100"
              : "text-slate-700 hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-800 cursor-pointer shadow-xs",
          )}
        >
          <span className="hidden sm:inline">{s.next}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}

export default Pagination;
