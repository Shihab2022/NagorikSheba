"use client";

import type { TaxFormState, RebateMode, TaxCalculationResult } from "../lib/types";
import { formatBDT } from "../lib/tax-engine";
import { Input, Select } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { Info, TriangleAlert } from "lucide-react";

type Props = {
  form: TaxFormState;
  result: TaxCalculationResult;
  onChange: (patch: Partial<TaxFormState>) => void;
  onFocus: (key: string) => void;
};

const INV_FIELDS = [
  { key: "invDps" as const, label: "ডিপিএস (DPS / মাসিক সঞ্চয়)", cap: "সর্বোচ্চ ১.২০ লাখ", focusKey: "invDps" },
  { key: "invSanchay" as const, label: "সঞ্চয়পত্র (Sanchaypatra)", cap: "সর্বোচ্চ ৫ লাখ", focusKey: "invSanchay" },
  { key: "invLip" as const, label: "জীবন বীমা প্রিমিয়াম (LIP)", cap: "অনুমোদিত", focusKey: "invLip" },
  { key: "invPf" as const, label: "প্রভিডেন্ট ফান্ড (PF)", cap: "১০০% যোগ্য", focusKey: "invPf" },
  { key: "invStock" as const, label: "শেয়ার বাজার / মিউচুয়াল ফান্ড", cap: "অনুমোদিত", focusKey: "invStock" },
  { key: "invZakat" as const, label: "যাকাত / ট্রেজারি বন্ড", cap: "অনুমোদিত", focusKey: "invZakat" },
] as const;

export function InvestmentRebateForm({ form, result, onChange, onFocus }: Props) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-brand-600 text-sm font-bold text-white shadow">
            ৩
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900">অনুমোদিত বিনিয়োগ ও কর রেয়াত</h2>
            <p className="text-xs text-slate-500">ডিপিএস, সঞ্চয়পত্র, প্রভিডেন্ট ফান্ড বা শেয়ার বাজারে বিনিয়োগ করলে কর ছাড় পাওয়া যায়</p>
          </div>
        </div>

        <Select
          value={form.rebateMode}
          onChange={(e) => onChange({ rebateMode: e.target.value as RebateMode })}
          className="h-10 max-w-xs text-xs"
        >
          <option value="nbr_strict">NBR ৩-ধাপ নিয়ম (৩% / ১৫%)</option>
          <option value="flat_15">সরাসরি ১৫% বিনিয়োগ রেয়াত</option>
        </Select>
      </div>

      {!form.filedOnTime && (
        <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-flag-200 bg-flag-50 p-3.5 text-xs text-flag-700">
          <TriangleAlert className="h-4 w-4 shrink-0 text-flag-500" />
          <span>
            <strong>সতর্কবার্তা (Late Filing):</strong> আপনি প্রোফাইলে নির্ধারিত সময়ের পরে রিটার্ন জমা নির্বাচন করেছেন।
            আয়কর আইন অনুযায়ী নির্ধারিত সময়ের পর রিটার্ন দিলে বিনিয়োগ রেয়াত পাওয়া যায় না।
          </span>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {INV_FIELDS.map((field) => (
          <div key={field.key}>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">{field.label}</span>
              <span className="font-semibold text-amber-600">{field.cap}</span>
            </div>
            <Input
              type="number"
              min={0}
              value={form[field.key] || ""}
              onChange={(e) => onChange({ [field.key]: Number(e.target.value) || 0 })}
              onFocus={() => onFocus(field.focusKey)}
              placeholder="0"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-line bg-slate-50 p-3.5">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-brand-700">
          <Info className="h-3.5 w-3.5" />
          কর রেয়াত (Tax Rebate) কিভাবে হিসাব হলো?
        </div>
        <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
          <div className="rounded-lg border border-line bg-white p-2">
            <span className="block text-[11px] text-slate-500">(ক) করযোগ্য আয়ের ৩%:</span>
            <span className="font-bold text-slate-900">{formatBDT(result.rebateCheckA)}</span>
          </div>
          <div className="rounded-lg border border-line bg-white p-2">
            <span className="block text-[11px] text-slate-500">(খ) যোগ্য বিনিয়োগের ১৫%:</span>
            <span className="font-bold text-slate-900">{formatBDT(result.rebateCheckB)}</span>
          </div>
          <div className="rounded-lg border border-line bg-white p-2">
            <span className="block text-[11px] text-slate-500">প্রাপ্ত চূড়ান্ত কর রেয়াত:</span>
            <span className="font-bold text-amber-600">{formatBDT(result.finalRebate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
