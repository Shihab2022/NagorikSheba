"use client";

import type { TaxFormState, AssessmentYear, TaxpayerCategory, LocationMinTax } from "../lib/types";
import { formatBDT } from "../lib/tax-engine";
import {
  TAXPAYER_CATEGORY_OPTIONS,
  MIN_TAX_OPTIONS,
} from "../lib/tax-config";
import { Input, Select } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type Props = {
  form: TaxFormState;
  taxFreeThreshold: number;
  onChange: (patch: Partial<TaxFormState>) => void;
  onFocus: (key: string) => void;
};

export function TaxpayerProfileForm({ form, taxFreeThreshold, onChange, onFocus }: Props) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow">
            ১
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900">করদাতার প্রোফাইল ও করবর্ষ</h2>
            <p className="text-xs text-slate-500">এই তথ্যগুলো আপনার PDF রিপোর্টে স্বয়ংক্রিয়ভাবে যুক্ত হবে</p>
          </div>
        </div>

        <div className="inline-flex self-start rounded-xl border border-line bg-slate-50 p-1 sm:self-auto">
          {(["2025-26", "2026-27"] as AssessmentYear[]).map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => onChange({ assessmentYear: yr })}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                form.assessmentYear === yr
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-brand-700",
              )}
            >
              করবর্ষ {yr === "2025-26" ? "২০২৫-২৬" : "২০২৬-২৭"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">করদাতার নাম</label>
          <Input
            value={form.taxpayerName}
            onChange={(e) => onChange({ taxpayerName: e.target.value })}
            onFocus={() => onFocus("taxpayerName")}
            placeholder="আপনার নাম লিখুন"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">ই-টিআইএন নম্বর (12-Digit e-TIN)</label>
          <Input
            value={form.taxpayerTin}
            onChange={(e) => onChange({ taxpayerTin: e.target.value })}
            onFocus={() => onFocus("taxpayerTin")}
            placeholder="যেমন: 5894-2103-8841"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">করদাতার শ্রেণি</label>
          <Select
            value={form.taxpayerCategory}
            onChange={(e) => onChange({ taxpayerCategory: e.target.value as TaxpayerCategory })}
            onFocus={() => onFocus("taxpayerCategory")}
          >
            {TAXPAYER_CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label.bn}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">এলাকা ও ন্যূনতম কর</label>
          <Select
            value={form.taxpayerLocation}
            onChange={(e) => onChange({ taxpayerLocation: Number(e.target.value) as LocationMinTax })}
            onFocus={() => onFocus("taxpayerLocation")}
          >
            {MIN_TAX_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label.bn}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">কর অঞ্চল ও সার্কেল</label>
          <Input
            value={form.taxpayerZone}
            onChange={(e) => onChange({ taxpayerZone: e.target.value })}
            onFocus={() => onFocus("taxpayerZone")}
            placeholder="যেমন: Tax Zone-04, Dhaka"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">স্বাক্ষর টেক্সট (PDF)</label>
          <Input
            value={form.signatureText}
            onChange={(e) => onChange({ signatureText: e.target.value })}
            onFocus={() => onFocus("signatureText")}
            placeholder="PDF-এ স্বাক্ষরের নাম"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">সময়মতো রিটার্ন জমা?</label>
          <Select
            value={form.filedOnTime ? "yes" : "no"}
            onChange={(e) => onChange({ filedOnTime: e.target.value === "yes" })}
            onFocus={() => onFocus("filedOnTime")}
          >
            <option value="yes">হ্যাঁ — নির্ধারিত সময়ে (Rebate প্রযোজ্য)</option>
            <option value="no">না — Late Filing (Rebate বাতিল)</option>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">প্রতিবন্ধী সন্তান সংখ্যা</label>
          <Input
            type="number"
            min={0}
            max={5}
            value={form.disabledChildCount}
            onChange={(e) => onChange({ disabledChildCount: Math.max(0, Number(e.target.value) || 0) })}
            onFocus={() => onFocus("disabledChild")}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end border-t border-line pt-3">
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
          আপনার করমুক্ত সীমা: {formatBDT(taxFreeThreshold)}
        </span>
      </div>
    </div>
  );
}
