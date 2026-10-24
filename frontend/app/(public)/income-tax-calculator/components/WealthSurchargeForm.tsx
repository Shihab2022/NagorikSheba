"use client";

import type { TaxFormState, TaxCalculationResult } from "../lib/types";
import { formatBDT } from "../lib/tax-engine";
import { WEALTH_SURCHARGE_OPTIONS } from "../lib/tax-config";
import { Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

type Props = {
  form: TaxFormState;
  result: TaxCalculationResult;
  onChange: (patch: Partial<TaxFormState>) => void;
  onFocus: (key: string) => void;
};

export function WealthSurchargeForm({ form, result, onChange, onFocus }: Props) {
  const hasSurcharge = result.effectiveSurchargePct > 0;

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow">
            ৪
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900">নিট সম্পদ ও সারচার্জ</h2>
            <p className="text-xs text-slate-500">নিট সম্পদ ৪ কোটি টাকার বেশি হলে, একাধিক গাড়ি বা ৮,০০০ বর্গফুটের বেশি প্রপার্টি থাকলে সারচার্জ প্রযোজ্য</p>
          </div>
        </div>

        <Badge tone={hasSurcharge ? "soft-amber" : "soft-green"}>
          {hasSurcharge
            ? `${result.effectiveSurchargePct}% Surcharge (${formatBDT(result.surchargeAmount)})`
            : "Surcharge Free (0%)"}
        </Badge>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">মোট নিট সম্পদ (Net Wealth)</label>
          <Select
            value={form.wealthSurchargePct}
            onChange={(e) => onChange({ wealthSurchargePct: Number(e.target.value) })}
            onFocus={() => onFocus("wealthSlab")}
          >
            {WEALTH_SURCHARGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label.bn}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">একাধিক মোটর গাড়ি?</label>
          <Select
            value={form.ownsMultiCar ? "yes" : "no"}
            onChange={(e) => onChange({ ownsMultiCar: e.target.value === "yes" })}
            onFocus={() => onFocus("multiCar")}
          >
            <option value="no">না (No)</option>
            <option value="yes">হ্যাঁ — ১টির বেশি গাড়ি (10% Surcharge)</option>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">৮,০০০ বর্গফুটের বেশি প্রপার্টি?</label>
          <Select
            value={form.ownsLargeProperty ? "yes" : "no"}
            onChange={(e) => onChange({ ownsLargeProperty: e.target.value === "yes" })}
            onFocus={() => onFocus("largeProperty")}
          >
            <option value="no">না (No)</option>
            <option value="yes">হ্যাঁ — {">"}8,000 Sq.Ft (10% Surcharge)</option>
          </Select>
        </div>
      </div>
    </div>
  );
}
