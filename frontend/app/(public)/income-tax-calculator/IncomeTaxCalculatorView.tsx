"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calculator,
  RotateCcw,
  Sparkles,
  Download,
  FileText,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  TrendingDown,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

import type { TaxFormState } from "./lib/types";
import {
  calculateTax,
  getDefaultFormState,
  getDemoScenario,
  formatBDT,
} from "./lib/tax-engine";
import { TAX_CONFIG } from "./lib/tax-config";

import { TaxpayerProfileForm } from "./components/TaxpayerProfileForm";
import { IncomeDetailsForm } from "./components/IncomeDetailsForm";
import { InvestmentRebateForm } from "./components/InvestmentRebateForm";
import { WealthSurchargeForm } from "./components/WealthSurchargeForm";
import { SlabBreakdownTable } from "./components/SlabBreakdownTable";
import { TaxKpiCards } from "./components/TaxKpiCards";
import { FieldGuide, FIELD_GUIDES } from "./components/FieldGuide";
import { TaxReportPreview } from "./components/TaxReportPreview";

export function IncomeTaxCalculatorView() {
  const { lang } = useTranslation();
  const [form, setForm] = useState<TaxFormState>(getDefaultFormState);
  const [activeTab, setActiveTab] = useState<"calc" | "report">("calc");
  const [focusedKey, setFocusedKey] = useState<string>("default");

  const result = useMemo(() => calculateTax(form), [form]);

  const handleFormChange = (patch: Partial<TaxFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const handleApplyDemo = (type: "mid" | "high") => {
    const demo = getDemoScenario(type);
    setForm((prev) => ({ ...prev, ...demo }));
  };

  const handleReset = () => {
    if (window.confirm("আপনি কি সমস্ত ইনপুট রিসেট করে প্রথম থেকে শুরু করতে চান?")) {
      setForm(getDefaultFormState());
      setFocusedKey("default");
    }
  };

  const guide = FIELD_GUIDES[focusedKey] ?? FIELD_GUIDES.default;
  const config = TAX_CONFIG[form.assessmentYear];
  const effectiveRate =
    result.totalTaxableIncome > 0
      ? ((result.finalNetTaxPayable / result.totalTaxableIncome) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="print:hidden">
        <PageHeader
          breadcrumbs={[
            { label: lang === "bn" ? "মূল পাতা" : "Home", href: "/" },
            { label: lang === "bn" ? "সেবাসমূহ" : "Services", href: "/services" },
            {
              label:
                lang === "bn"
                  ? "বাংলাদেশ আয়কর ক্যালকুলেটর"
                  : "Income Tax Calculator",
            },
          ]}
          title={
            <div className="flex flex-wrap items-center gap-3">
              <span>
                {lang === "bn"
                  ? "বাংলাদেশ আয়কর ক্যালকুলেটর"
                  : "Bangladesh Income Tax Calculator"}
              </span>
              <Badge tone="soft-green">
                করবর্ষ {form.assessmentYear === "2025-26" ? "২০২৫-২৬" : "২০২৬-২৭"}
              </Badge>
            </div>
          }
          description={
            lang === "bn"
              ? "আয়কর আইন ২০২৩ ও অর্থ আইন অনুযায়ী করযোগ্য আয়, স্ল্যাবভিত্তিক কর, অনুমোদিত বিনিয়োগ রেয়াত এবং প্রদেয় নিট করের নির্ভুল হিসাব ও সনদ তৈরি করুন।"
              : "Compute taxable income, progressive tax slabs, investment rebate, surcharge, and net payable tax under Income Tax Act 2023."
          }
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApplyDemo("mid")}
                className="gap-1.5 text-xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>ডেমো ১ (চাকরিজীবী)</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApplyDemo("high")}
                className="gap-1.5 text-xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                <span>ডেমো ২ (উচ্চ আয় ও সারচার্জ)</span>
              </Button>
              <button
                type="button"
                onClick={handleReset}
                title="সমস্ত ইনপুট মুছে নতুন হিসাব শুরু করুন"
                className={cn(
                  "group relative inline-flex items-center gap-2 overflow-hidden rounded-xl",
                  "border-2 border-flag-400 bg-gradient-to-r from-flag-50 via-rose-50 to-flag-100 px-3.5 py-1.5",
                  "text-xs font-black text-flag-700 shadow-md shadow-flag-500/20",
                  "transition-all duration-300 ease-out",
                  "hover:scale-105 hover:border-flag-500 hover:bg-gradient-to-r hover:from-flag-500 hover:to-rose-600 hover:text-white hover:shadow-xl hover:shadow-flag-500/40",
                  "active:scale-95 cursor-pointer ring-2 ring-flag-300/40 hover:ring-flag-500/60",
                  "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent before:transition-transform before:duration-700 hover:before:translate-x-full",
                )}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flag-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-flag-500 group-hover:bg-white transition-colors" />
                </span>

                <RotateCcw className="h-4 w-4 transition-transform duration-700 ease-in-out group-hover:-rotate-180 text-flag-600 group-hover:text-white" />

                <span className="tracking-tight">হিসাব রিসেট</span>
              </button>
            </div>
          }
        />
      </div>

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <TaxKpiCards result={result} />

        <div className="mt-8 flex items-center justify-between border-b border-line pb-4 print:hidden">
          <div className="inline-flex rounded-2xl border border-line bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab("calc")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all",
                activeTab === "calc"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-brand-700",
              )}
            >
              <Calculator className="h-4 w-4" />
              <span>ক্যালকুলেটর ফরম ও স্ল্যাব হিসাব</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("report")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all",
                activeTab === "report"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-brand-700",
              )}
            >
              <FileText className="h-4 w-4" />
              <span>ট্যাক্স সার্টিফিকেট ও পূর্ণাঙ্গ রিপোর্ট (PDF)</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveTab("report")}
              className="gap-1.5 shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span>PDF রিপোর্ট ডাউনলোড</span>
            </Button>
          </div>
        </div>

        {activeTab === "calc" && (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 print:hidden">
            <div className="space-y-6 lg:col-span-8">
              <FieldGuide title={guide.title} text={guide.text} />

              <TaxpayerProfileForm
                form={form}
                taxFreeThreshold={result.taxFreeThreshold}
                onChange={handleFormChange}
                onFocus={setFocusedKey}
              />

              <IncomeDetailsForm
                form={form}
                result={result}
                onChange={handleFormChange}
                onFocus={setFocusedKey}
              />

              <InvestmentRebateForm
                form={form}
                result={result}
                onChange={handleFormChange}
                onFocus={setFocusedKey}
              />

              <WealthSurchargeForm
                form={form}
                result={result}
                onChange={handleFormChange}
                onFocus={setFocusedKey}
              />

              <SlabBreakdownTable result={result} />
            </div>

            <div className="space-y-6 lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
                  <div className="bg-gradient-to-br from-brand-700 to-brand-900 p-5 text-white">
                    <span className="text-xs font-semibold text-brand-200 uppercase tracking-wider">
                      সর্বমোট নিট প্রদেয় কর
                    </span>
                    <div className="mt-1 text-3xl font-black">
                      {formatBDT(result.finalNetTaxPayable)}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-brand-100">
                      <span>কার্যকর করের হার: {effectiveRate}%</span>
                      <span>মাসিক কিস্তি: {formatBDT(result.monthlyAverageTax)}</span>
                    </div>
                  </div>

                  <div className="divide-y divide-line p-5 text-xs text-slate-700">
                    <div className="flex justify-between py-2">
                      <span className="text-slate-500">মোট করযোগ্য আয়:</span>
                      <strong className="text-slate-900">{formatBDT(result.totalTaxableIncome)}</strong>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-500">করমুক্ত সীমা (ব্যক্তিগত):</span>
                      <strong className="text-emerald-700">{formatBDT(result.taxFreeThreshold)}</strong>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-500">গ্রস কর (স্ল্যাবভিত্তিক):</span>
                      <strong className="text-slate-900">{formatBDT(result.grossTax)}</strong>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-500">বিনিয়োগ রেয়াত:</span>
                      <strong className="text-emerald-700">- {formatBDT(result.finalRebate)}</strong>
                    </div>
                    {result.minTaxApplied && (
                      <div className="flex justify-between py-2 text-amber-700 font-semibold">
                        <span>ন্যূনতম কর নিয়ম:</span>
                        <span>{formatBDT(result.minTaxAmount)} প্রযোজ্য</span>
                      </div>
                    )}
                    {result.effectiveSurchargePct > 0 && (
                      <div className="flex justify-between py-2 text-amber-700 font-semibold">
                        <span>সারচার্জ ({result.effectiveSurchargePct}%):</span>
                        <span>+ {formatBDT(result.surchargeAmount)}</span>
                      </div>
                    )}
                    {result.aitPaid > 0 && (
                      <div className="flex justify-between py-2 text-emerald-700 font-semibold">
                        <span>অগ্রিম কর কর্তন (AIT):</span>
                        <span>- {formatBDT(result.aitPaid)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-line bg-slate-50/70 p-4 space-y-2.5">
                    <Button
                      variant="primary"
                      block
                      onClick={() => setActiveTab("report")}
                      className="gap-2 shadow-sm"
                    >
                      <Download className="h-4 w-4" />
                      <span>ট্যাক্স সার্টিফিকেট ও PDF ডাউনলোড</span>
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className={cn(
                        "group w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-black",
                        "border border-flag-300 bg-gradient-to-r from-flag-50/80 to-rose-50/80 text-flag-700 shadow-sm",
                        "transition-all duration-300 hover:border-flag-500 hover:bg-gradient-to-r hover:from-flag-500 hover:to-rose-600 hover:text-white hover:shadow-md hover:shadow-flag-500/25",
                        "active:scale-95 cursor-pointer",
                      )}
                    >
                      <RotateCcw className="h-3.5 w-3.5 transition-transform duration-700 group-hover:-rotate-180 text-flag-600 group-hover:text-white" />
                      <span>সব তথ্য মুছে নতুন হিসাব (রিসেট)</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-line bg-white p-5 shadow-card space-y-4">
                  <div className="flex items-center gap-2.5 text-brand-800 font-bold text-sm">
                    <Calendar className="h-4 w-4 text-brand-600" />
                    <span>গুরুত্বপূর্ণ কর তথ্য ও তারিখ</span>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-600 shrink-0" />
                      <span>
                        <strong>ট্যাক্স ডে (Tax Day):</strong> ৩০ নভেম্বর এর মধ্যে বার্ষিক আয়কর রিটার্ন
                        জমা দেওয়া বাধ্যতামূলক।
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-600 shrink-0" />
                      <span>
                        <strong>সার্বজনীন স্বনির্ধারণী:</strong> ধারা ১৮০ অনুযায়ী নিজেই নিজের আয় হিসাব
                        করে জমা দেওয়া যায়।
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-600 shrink-0" />
                      <span>
                        <strong>দেরিতে জমা দিলে:</strong> সময়মতো রিটার্ন না দিলে বিনিয়োগ রেয়াত বাতিল
                        হয় এবং মাসিক ২% বিলম্ব জরিমানা হতে পারে।
                      </span>
                    </li>
                  </ul>

                  <div className="pt-3 border-t border-line">
                    <a
                      href="https://etaxnbr.gov.bd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-900"
                    >
                      <span>NBR অফিসিয়াল e-Return পোর্টাল</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "report" && (
          <div className="mt-8 max-w-4xl mx-auto">
            <TaxReportPreview form={form} result={result} />
          </div>
        )}

        <div className="hidden print:block">
          <TaxReportPreview form={form} result={result} />
        </div>
      </main>
    </div>
  );
}
