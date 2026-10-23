import React from "react";
import { T } from "@/components/ui/T";

export interface CategoryStatsProps {
  totalCategories: number;
  totalServices: number;
}

export function CategoryStats({ totalCategories, totalServices }: CategoryStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-line bg-white p-4 shadow-card">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <T bn="মোট ক্যাটাগরি" en="Total Categories" />
        </p>
        <p className="mt-1 text-2xl font-black text-slate-900">{totalCategories}</p>
      </div>

      <div className="rounded-xl border border-line bg-white p-4 shadow-card">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <T bn="সংযুক্ত সেবা" en="Linked Services" />
        </p>
        <p className="mt-1 text-2xl font-black text-brand-700">{totalServices}</p>
      </div>

      <div className="col-span-2 sm:col-span-1 rounded-xl border border-line bg-white p-4 shadow-card">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <T bn="সক্রিয় অবস্থা" en="Active Status" />
        </p>
        <p className="mt-1 text-2xl font-black text-emerald-600">Active</p>
      </div>
    </div>
  );
}

export default CategoryStats;
