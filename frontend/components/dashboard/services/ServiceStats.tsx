import React from "react";
import { T } from "@/components/ui/T";

export interface ServiceStatsProps {
  totalCount: number;
  publishedCount: number;
  draftCount: number;
}

export function ServiceStats({
  totalCount,
  publishedCount,
  draftCount,
}: ServiceStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-line bg-white p-4 shadow-card">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <T bn="মোট সেবা" en="Total Services" />
        </p>
        <p className="mt-1 text-2xl font-black text-slate-900">{totalCount}</p>
      </div>

      <div className="rounded-xl border border-line bg-white p-4 shadow-card">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <T bn="প্রকাশিত সেবা" en="Published" />
        </p>
        <p className="mt-1 text-2xl font-black text-emerald-600">{publishedCount}</p>
      </div>

      <div className="col-span-2 sm:col-span-1 rounded-xl border border-line bg-white p-4 shadow-card">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <T bn="খসড়া / ড্রাফট" en="Draft" />
        </p>
        <p className="mt-1 text-2xl font-black text-amber-600">{draftCount}</p>
      </div>
    </div>
  );
}

export default ServiceStats;
