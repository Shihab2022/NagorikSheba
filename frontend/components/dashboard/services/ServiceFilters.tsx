"use client";

import { Search } from "lucide-react";
import { T } from "@/components/ui/T";
import type { CategoryItem } from "@/types/category";

export interface ServiceFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  categories: CategoryItem[];
}

export function ServiceFilters({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  categories,
}: ServiceFiltersProps) {
  return (
    <div className="border-b border-line p-4 bg-slate-50/50 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="সেবার নাম বা সংক্ষিপ্ত বিবরণ দিয়ে খুঁজুন..."
          className="h-10 w-full rounded-xl border border-line bg-white pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="h-10 rounded-xl border border-line bg-white px-3 text-xs font-semibold text-slate-700 focus:border-brand-500 focus:outline-none cursor-pointer"
        >
          <option value="ALL">সকল ক্যাটাগরি</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-10 rounded-xl border border-line bg-white px-3 text-xs font-semibold text-slate-700 focus:border-brand-500 focus:outline-none cursor-pointer"
        >
          <option value="ALL">সকল অবস্থা</option>
          <option value="PUBLISHED">প্রকাশিত (Published)</option>
          <option value="DRAFT">খসড়া (Draft)</option>
        </select>
      </div>
    </div>
  );
}

export default ServiceFilters;
