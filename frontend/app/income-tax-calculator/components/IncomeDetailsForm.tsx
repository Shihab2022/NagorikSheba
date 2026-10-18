"use client";

import type { TaxFormState, SalaryMode, TaxCalculationResult } from "../lib/types";
import { formatBDT } from "../lib/tax-engine";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { Building, Briefcase, TrendingUp, Receipt } from "lucide-react";

type Props = {
  form: TaxFormState;
  result: TaxCalculationResult;
  onChange: (patch: Partial<TaxFormState>) => void;
  onFocus: (key: string) => void;
};

export function IncomeDetailsForm({ form, result, onChange, onFocus }: Props) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow">
            ২
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900">বার্ষিক আয়ের বিবরণী</h2>
            <p className="text-xs text-slate-500">বেতন খাতের ১/৩ অংশ এবং বাড়ি ভাড়ার ২৫% রক্ষণাবেক্ষণ খরচ স্বয়ংক্রিয়ভাবে বাদ যাবে</p>
          </div>
        </div>

        <div className="inline-flex self-start rounded-xl border border-line bg-slate-50 p-1 sm:self-auto">
          {(["simple", "detailed"] as SalaryMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onChange({ salaryMode: mode })}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                form.salaryMode === mode
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-brand-700",
              )}
            >
              {mode === "simple" ? "একক বার্ষিক বেতন" : "বিস্তারিত বেতন ভাতা"}
            </button>
          ))}
        </div>
      </div>

      {form.salaryMode === "simple" && (
        <div className="mt-5 rounded-xl border border-line bg-slate-50 p-4">
          <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <label className="text-sm font-semibold text-slate-700">
              চাকরি বা বেতন খাতে মোট বার্ষিক আয়
            </label>
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
              ১/৩ অংশ করমুক্ত: {formatBDT(result.salaryExemption)}
            </span>
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-bold text-brand-600">
              ৳
            </span>
            <Input
              type="number"
              min={0}
              step={5000}
              value={form.grossSalary || ""}
              onChange={(e) => onChange({ grossSalary: Number(e.target.value) || 0 })}
              onFocus={() => onFocus("grossSalary")}
              className="pl-9 font-bold"
              placeholder="0"
            />
          </div>
          <input
            type="range"
            min={0}
            max={5000000}
            step={10000}
            value={Math.min(5000000, form.grossSalary)}
            onChange={(e) => onChange({ grossSalary: Number(e.target.value) })}
            className="mt-3 w-full cursor-pointer accent-brand-600"
          />
          <div className="mt-1 flex justify-between text-[11px] text-slate-400">
            <span>৳ ০</span>
            <span>৳ ১০ লাখ</span>
            <span>৳ ২৫ লাখ</span>
            <span>৳ ৫০ লাখ+</span>
          </div>
        </div>
      )}

      {form.salaryMode === "detailed" && (
        <div className="mt-5 space-y-3 rounded-xl border border-line bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">বার্ষিক মোট প্রাপ্ত বেতন ও ভাতাসমূহ লিখুন (১২ মাসের যোগফল):</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { label: "মূল বেতন (Annual Basic)", key: "salBasic" as const, val: form.salBasic },
              { label: "বাড়ি ভাড়া ভাতা (House Rent)", key: "salRent" as const, val: form.salRent },
              { label: "চিকিৎসা ও যাতায়াত (Medical & Conveyance)", key: "salMedical" as const, val: form.salMedical },
              { label: "উৎসব বোনাস ও অন্যান্য (Festival & Others)", key: "salBonus" as const, val: form.salBonus },
            ].map((field) => (
              <div key={field.key} className="space-y-1">
                <label className="block text-xs font-medium text-slate-600">{field.label}</label>
                <Input
                  type="number"
                  min={0}
                  value={field.val || ""}
                  onChange={(e) => onChange({ [field.key]: Number(e.target.value) || 0 })}
                  onFocus={() => onFocus("grossSalary")}
                  placeholder="0"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
              মোট: {formatBDT(result.effectiveGrossSalary)} · ১/৩ করমুক্ত: {formatBDT(result.salaryExemption)}
            </span>
          </div>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <IncomeField
          icon={<Building className="h-4 w-4" />}
          label="বাড়ি ভাড়া হতে বার্ষিক আয়"
          hint={`২৫% মেরামত বাদ: ${formatBDT(result.houseRepairDeduction)}`}
          value={form.incomeHouseRent}
          onInput={(v) => onChange({ incomeHouseRent: v })}
          onFocus={() => onFocus("incomeHouseRent")}
        />
        <IncomeField
          icon={<Briefcase className="h-4 w-4" />}
          label="ব্যবসা বা পেশা হতে নিট আয়"
          value={form.incomeBusiness}
          onInput={(v) => onChange({ incomeBusiness: v })}
          onFocus={() => onFocus("incomeBusiness")}
        />
        <IncomeField
          icon={<TrendingUp className="h-4 w-4" />}
          label="ব্যাংক মুনাফা / সঞ্চয়পত্র ও অন্যান্য"
          value={form.incomeOther}
          onInput={(v) => onChange({ incomeOther: v })}
          onFocus={() => onFocus("incomeOther")}
        />
        <IncomeField
          icon={<Receipt className="h-4 w-4" />}
          label="উৎসে কর্তিত কর (AIT / TDS)"
          value={form.aitPaid}
          onInput={(v) => onChange({ aitPaid: v })}
          onFocus={() => onFocus("aitPaid")}
          accent="amber"
        />
      </div>
    </div>
  );
}

function IncomeField({
  icon,
  label,
  hint,
  value,
  onInput,
  onFocus,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  value: number;
  onInput: (v: number) => void;
  onFocus: () => void;
  accent?: "amber";
}) {
  return (
    <div className="rounded-xl border border-line bg-slate-50/50 p-3.5">
      <div className="mb-1.5 flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <span className={cn("text-brand-600", accent === "amber" && "text-amber-600")}>{icon}</span>
          {label}
        </label>
        {hint && <span className="text-[10px] text-brand-600">{hint}</span>}
      </div>
      <Input
        type="number"
        min={0}
        value={value || ""}
        onChange={(e) => onInput(Number(e.target.value) || 0)}
        onFocus={onFocus}
        placeholder="0"
      />
    </div>
  );
}
