"use client";

import type { TaxCalculationResult } from "../lib/types";
import { formatBDT } from "../lib/tax-engine";
import { cn } from "@/lib/utils";

const SLAB_COLORS = [
  "bg-brand-500",
  "bg-brand-400",
  "bg-brand-300",
  "bg-amber-400",
  "bg-amber-500",
  "bg-flag-400",
  "bg-flag-500",
] as const;

const ALL_RATES = [0, 5, 10, 15, 20, 25, 30];

type Props = {
  result: TaxCalculationResult;
};

export function SlabBreakdownTable({ result }: Props) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow">
            ৫
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900">ধাপভিত্তিক করের বিস্তারিত হিসাব</h2>
            <p className="text-xs text-slate-500">আপনার করযোগ্য আয় কিভাবে প্রতিটি স্ল্যাবে ভাগ হয়েছে দেখুন</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-line bg-slate-50 p-3.5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Exceeded Slab Multiplier Matrix
          </span>
          <span className="text-xs font-bold text-brand-700">
            সর্বোচ্চ স্ল্যাব: {result.highestSlabRate}%
          </span>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {ALL_RATES.map((rate) => {
            const active =
              rate <= result.highestSlabRate &&
              (result.totalTaxableIncome > 0 || rate === 0);
            return (
              <div
                key={rate}
                className={cn(
                  "rounded-lg border py-1.5 text-xs font-extrabold transition-all duration-200",
                  active
                    ? "border-brand-300 bg-gradient-to-b from-brand-500 to-brand-700 text-white shadow-sm"
                    : "border-line bg-white text-slate-300",
                )}
              >
                {rate}%
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-line text-xs uppercase text-slate-500">
              <th className="px-3 py-2.5">আয়ের ধাপ (Slab)</th>
              <th className="px-3 py-2.5 text-center">করের হার</th>
              <th className="px-3 py-2.5 text-right">আপনার এই ধাপের আয়</th>
              <th className="px-3 py-2.5 text-right">প্রদেয় কর</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-sm">
            {result.slabResults.map((row, i) => {
              const isActive = row.allocated > 0;
              return (
                <tr
                  key={i}
                  className={cn(
                    "transition-colors",
                    isActive ? "bg-white" : "bg-slate-50/50 opacity-50",
                    isActive && "hover:bg-brand-50/30",
                  )}
                >
                  <td className="px-3 py-2.5 font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          SLAB_COLORS[i] ?? "bg-slate-300",
                        )}
                      />
                      {row.label}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className="inline-block rounded-md border border-line bg-slate-50 px-2 py-0.5 text-xs font-bold text-slate-700">
                      {row.rate}%
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right text-slate-600">
                    {formatBDT(row.allocated)}
                  </td>
                  <td
                    className={cn(
                      "px-3 py-2.5 text-right font-bold",
                      row.tax > 0 ? "text-brand-700" : "text-slate-400",
                    )}
                  >
                    {formatBDT(row.tax)}
                  </td>
                </tr>
              );
            })}

            <tr className="border-t-2 border-brand-200 bg-brand-50 font-bold text-slate-900">
              <td colSpan={3} className="px-3 py-3">
                স্ল্যাব অনুযায়ী মোট গ্রস কর (Total Gross Tax)
              </td>
              <td className="px-3 py-3 text-right text-base text-brand-700">
                {formatBDT(result.grossTax)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
