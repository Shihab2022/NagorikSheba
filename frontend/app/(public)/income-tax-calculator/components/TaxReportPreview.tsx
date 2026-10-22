"use client";

import React, { useRef, useState } from "react";
import type { TaxFormState, TaxCalculationResult } from "../lib/types";
import { formatBDT } from "../lib/tax-engine";
import { TAXPAYER_CATEGORY_OPTIONS } from "../lib/tax-config";
import { downloadTaxPdf } from "../lib/pdf-export";
import { Download, CheckCircle2, ShieldAlert, Award, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Props = {
  form: TaxFormState;
  result: TaxCalculationResult;
};

export function TaxReportPreview({ form, result }: Props) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!reportRef.current || isDownloading) return;
    try {
      setIsDownloading(true);
      await downloadTaxPdf(
        reportRef.current,
        form.taxpayerName,
        form.assessmentYear
      );
    } catch (err) {
      console.error("PDF download error:", err);
      alert("PDF ফাইল ডাউনলোডে সমস্যা হয়েছে। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করুন।");
    } finally {
      setIsDownloading(false);
    }
  };

  const categoryLabel =
    TAXPAYER_CATEGORY_OPTIONS.find((c) => c.value === form.taxpayerCategory)?.label.bn ??
    "সাধারণ করদাতা";

  const currentDate = new Date().toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const certRefId = `NS-TAX-${form.assessmentYear.replace("-", "")}-${(form.taxpayerTin || "1001").slice(-4)}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4 shadow-card">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-brand-600" />
            <span>আয়কর প্রত্যয়ন ও হিসাব সনদ (এক পাতার পরিপাটি A4 PDF)</span>
          </h3>
          <p className="text-xs text-slate-500">
            জাতীয় রাজস্ব বোর্ড (NBR) নীতিমালায় প্রস্তুতকৃত এক পাতার নির্ভুল অফিসিয়াল প্রত্যয়নপত্র
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="gap-2 shadow-sm min-w-[170px]"
          >
            {isDownloading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>PDF তৈরি হচ্ছে...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>PDF ডাউনলোড করুন</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto pb-6">
        <div
          ref={reportRef}
          id="tax-report-sheet"
          className="relative mx-auto bg-white border border-slate-300 rounded-xl shadow-xl text-slate-800"
          style={{
            width: "794px",
            height: "1123px",
            minHeight: "1123px",
            padding: "36px 36px 28px 36px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            fontFamily: "'Noto Sans Bengali', 'Inter', system-ui, sans-serif",
            lineHeight: 1.5,
          }}
        >
          <div className="absolute top-0 inset-x-0 h-2 rounded-t-xl bg-gradient-to-r from-brand-700 via-brand-600 to-flag-500" />

          <div className="border-b-2 border-brand-700 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-700 text-white font-black text-lg shadow-sm">
                  এক
                </div>
                <div>
                  <div className="text-xl font-black tracking-tight text-brand-900 leading-tight">
                    নাগরিকসেবা <span className="text-flag-500 text-base font-bold">| গণপ্রজাতন্ত্রী বাংলাদেশ</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    জাতীয় রাজস্ব বোর্ড (NBR) আয়কর আইন, ২০২৩ ও অর্থ আইন অনুসরণে
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block rounded-full bg-brand-50 border border-brand-200 px-3 py-1 text-xs font-bold text-brand-800">
                  করবর্ষ: {form.assessmentYear === "2025-26" ? "২০২৫-২০২৬" : "২০২৬-২০২৭"}
                </div>
                <div className="text-[10.5px] text-slate-500 mt-1 font-mono">
                  সনদ নং: {certRefId}
                </div>
              </div>
            </div>

            <div className="text-center mt-2.5">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                আয়কর নিরূপণ সারসংক্ষেপ ও প্রত্যয়নপত্র
              </h1>
              <div className="mt-1 flex items-center justify-center gap-3 text-xs text-slate-600 font-medium">
                <span>আয়বর্ষ: {form.assessmentYear === "2025-26" ? "২০২৪-২০২৫" : "২০২৫-২০২৬"}</span>
                <span className="text-slate-300">•</span>
                <span>ইস্যুর তারিখ: {currentDate}</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-semibold">ডিজিটাল মূল্যায়ন প্রত্যয়ন</span>
              </div>
            </div>
          </div>

          <div className="my-2.5 rounded-lg border border-slate-300 bg-slate-50/70 overflow-hidden">
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 px-3 w-1/4 border-r border-slate-200">
                    <span className="text-[10px] text-slate-500 block">করদাতার পূর্ণ নাম:</span>
                    <strong className="text-slate-900 font-bold text-xs truncate block">
                      {form.taxpayerName || "নাম উল্লেখ করা হয়নি"}
                    </strong>
                  </td>
                  <td className="py-1.5 px-3 w-1/4 border-r border-slate-200">
                    <span className="text-[10px] text-slate-500 block">ই-টিআইএন (e-TIN):</span>
                    <strong className="text-slate-900 font-mono font-bold text-xs block tracking-wide">
                      {form.taxpayerTin || "—"}
                    </strong>
                  </td>
                  <td className="py-1.5 px-3 w-1/4 border-r border-slate-200">
                    <span className="text-[10px] text-slate-500 block">করদাতার শ্রেণি:</span>
                    <strong className="text-slate-900 font-bold text-xs block truncate">
                      {categoryLabel}
                    </strong>
                  </td>
                  <td className="py-1.5 px-3 w-1/4">
                    <span className="text-[10px] text-slate-500 block">রিটার্ন জমাদানের সময়:</span>
                    <span className="inline-flex items-center gap-1 font-bold text-xs">
                      {form.filedOnTime ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> সময়মতো (On-time)
                        </span>
                      ) : (
                        <span className="text-amber-700 flex items-center gap-1">
                          <ShieldAlert className="h-3.5 w-3.5" /> বিলম্বে (Late)
                        </span>
                      )}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="py-1.5 px-3 border-r border-slate-200">
                    <span className="text-[10px] text-slate-500 block">কর অঞ্চল ও সার্কেল:</span>
                    <strong className="text-slate-900 text-xs block truncate">
                      {form.taxpayerZone || "প্রযোজ্য কর সার্কেল/অঞ্চল"}
                    </strong>
                  </td>
                  <td className="py-1.5 px-3 border-r border-slate-200">
                    <span className="text-[10px] text-slate-500 block">করমুক্ত আয়ের সীমা:</span>
                    <strong className="text-brand-800 font-bold text-xs">
                      {formatBDT(result.taxFreeThreshold)}
                    </strong>
                  </td>
                  <td className="py-1.5 px-3">
                    <span className="text-[10px] text-slate-500 block">এলাকাভিত্তিক ন্যূনতম কর:</span>
                    <strong className="text-slate-800 font-bold text-xs">
                      {formatBDT(form.taxpayerLocation)}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-3.5 my-1.5 items-start">
            <div className="space-y-2.5">
              <div className="rounded-lg border border-slate-300 overflow-hidden">
                <div className="bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 flex items-center justify-between border-b border-slate-200">
                  <span className="flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-brand-700 text-white text-[9.5px] font-bold">
                      ক
                    </span>
                    আয়ের বিবরণী ও করযোগ্য আয়
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">টাকায়</span>
                </div>
                <table className="w-full text-xs border-collapse">
                  <thead className="bg-slate-50 text-[10.5px] text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-1 px-2.5 text-left font-semibold">আয়ের উৎস / খাত</th>
                      <th className="py-1 px-2 text-right font-semibold">মোট আয়</th>
                      <th className="py-1 px-2.5 text-right font-semibold">করযোগ্য</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-1.5 px-2.5">
                        <div className="font-medium text-slate-800">বেতন খাত (ধারা ৩২)</div>
                        <div className="text-[9.5px] text-slate-400">
                          ১/৩ বাদ: {formatBDT(result.salaryExemption)}
                        </div>
                      </td>
                      <td className="py-1.5 px-2 text-right text-slate-600">
                        {formatBDT(result.effectiveGrossSalary)}
                      </td>
                      <td className="py-1.5 px-2.5 text-right font-semibold text-slate-900">
                        {formatBDT(result.taxableSalary)}
                      </td>
                    </tr>
                    {result.grossHouseRent > 0 && (
                      <tr>
                        <td className="py-1.5 px-2.5">
                          <div className="font-medium text-slate-800">বাড়ি ভাড়া খাত (ধারা ৩৬)</div>
                          <div className="text-[9.5px] text-slate-400">২৫% মেরামত খরচ বাদ</div>
                        </td>
                        <td className="py-1.5 px-2 text-right text-slate-600">
                          {formatBDT(result.grossHouseRent)}
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-semibold text-slate-900">
                          {formatBDT(result.taxableHouseRent)}
                        </td>
                      </tr>
                    )}
                    {result.businessIncome > 0 && (
                      <tr>
                        <td className="py-1.5 px-2.5 font-medium text-slate-800">ব্যবসা বা পেশা খাত</td>
                        <td className="py-1.5 px-2 text-right text-slate-600">
                          {formatBDT(result.businessIncome)}
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-semibold text-slate-900">
                          {formatBDT(result.businessIncome)}
                        </td>
                      </tr>
                    )}
                    {result.otherIncome > 0 && (
                      <tr>
                        <td className="py-1.5 px-2.5 font-medium text-slate-800">অন্যান্য উৎস (সুদ/লভ্যাংশ)</td>
                        <td className="py-1.5 px-2 text-right text-slate-600">
                          {formatBDT(result.otherIncome)}
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-semibold text-slate-900">
                          {formatBDT(result.otherIncome)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-brand-50 border-t-2 border-brand-300 font-bold text-brand-900">
                    <tr>
                      <td colSpan={2} className="py-1.5 px-2.5 text-xs">মোট করযোগ্য আয় (Taxable):</td>
                      <td className="py-1.5 px-2.5 text-right text-xs font-black text-brand-900">
                        {formatBDT(result.totalTaxableIncome)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="rounded-lg border border-slate-300 overflow-hidden">
                <div className="bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 flex items-center justify-between border-b border-slate-200">
                  <span className="flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-amber-600 text-white text-[9.5px] font-bold">
                      গ
                    </span>
                    অনুমোদিত বিনিয়োগ ও কর রেয়াত
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">টাকায়</span>
                </div>
                <table className="w-full text-xs border-collapse">
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-1 px-2.5 w-1/2">
                        ডিপিএস (DPS): <strong className="text-slate-900">{formatBDT(form.invDps)}</strong>
                      </td>
                      <td className="py-1 px-2.5 w-1/2 text-right">
                        সঞ্চয়পত্র: <strong className="text-slate-900">{formatBDT(form.invSanchay)}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2.5 w-1/2">
                        বীমা/পিএফ: <strong className="text-slate-900">{formatBDT(form.invLip + form.invPf)}</strong>
                      </td>
                      <td className="py-1 px-2.5 w-1/2 text-right">
                        শেয়ার/যাকাত: <strong className="text-slate-900">{formatBDT(form.invStock + form.invZakat)}</strong>
                      </td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="py-1 px-2.5 font-medium text-slate-700">মোট অনুমোদিত বিনিয়োগ:</td>
                      <td className="py-1 px-2.5 text-right font-bold text-slate-900">
                        {formatBDT(result.totalEligibleInvestment)}
                      </td>
                    </tr>
                    <tr className="bg-emerald-50 text-emerald-900 font-bold border-t border-emerald-200">
                      <td className="py-1.5 px-2.5">প্রযোজ্য বিনিয়োগ কর রেয়াত:</td>
                      <td className="py-1.5 px-2.5 text-right text-xs font-black text-emerald-800">
                        - {formatBDT(result.finalRebate)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="rounded-lg border border-slate-300 overflow-hidden">
                <div className="bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 flex items-center justify-between border-b border-slate-200">
                  <span className="flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-brand-700 text-white text-[9.5px] font-bold">
                      খ
                    </span>
                    স্ল্যাবভিত্তিক কর নিরূপণ
                  </span>
                  <span className="text-[10px] text-brand-800 font-bold">
                    সর্বোচ্চ: {result.highestSlabRate}%
                  </span>
                </div>
                <table className="w-full text-xs border-collapse">
                  <thead className="bg-slate-50 text-[10.5px] text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-1 px-2.5 text-left font-semibold">আয়ের ধাপ (Slab)</th>
                      <th className="py-1 px-2 text-center font-semibold">হার</th>
                      <th className="py-1 px-2.5 text-right font-semibold">আরোপিত কর</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {result.slabResults
                      .filter((s) => s.allocated > 0 || s.rate === 0)
                      .map((row, i) => (
                        <tr key={i}>
                          <td className="py-1 px-2.5 font-medium truncate max-w-[150px]">
                            {row.label.split(" (")[0]}
                          </td>
                          <td className="py-1 px-2 text-center font-bold text-[11px] text-slate-800">
                            {row.rate}%
                          </td>
                          <td className="py-1 px-2.5 text-right font-semibold text-slate-900">
                            {formatBDT(row.tax)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-800">
                    <tr>
                      <td colSpan={2} className="py-1.5 px-2.5 text-xs">মোট গ্রস কর (Gross Tax):</td>
                      <td className="py-1.5 px-2.5 text-right text-xs font-black text-brand-900">
                        {formatBDT(result.grossTax)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="rounded-lg border border-slate-300 overflow-hidden">
                <div className="bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 flex items-center justify-between border-b border-slate-200">
                  <span className="flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-brand-700 text-white text-[9.5px] font-bold">
                      ঘ
                    </span>
                    চূড়ান্ত কর নিরূপণ ও সমন্বয়
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">টাকায়</span>
                </div>
                <table className="w-full text-xs border-collapse">
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-1 px-2.5 text-slate-600">১. মোট গ্রস কর (Gross Tax):</td>
                      <td className="py-1 px-2.5 text-right font-semibold text-slate-900">{formatBDT(result.grossTax)}</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2.5 text-emerald-700">২. বাদ: বিনিয়োগ কর রেয়াত:</td>
                      <td className="py-1 px-2.5 text-right font-semibold text-emerald-700">- {formatBDT(result.finalRebate)}</td>
                    </tr>
                    {result.effectiveSurchargePct > 0 && (
                      <tr>
                        <td className="py-1 px-2.5 text-amber-700">৩. নিট সম্পদ সারচার্জ ({result.effectiveSurchargePct}%):</td>
                        <td className="py-1 px-2.5 text-right font-semibold text-amber-700">+ {formatBDT(result.surchargeAmount)}</td>
                      </tr>
                    )}
                    {result.minTaxApplied && (
                      <tr>
                        <td className="py-1 px-2.5 text-amber-800 text-[11px]">৪. এলাকাভিত্তিক ন্যূনতম কর সমন্বয়:</td>
                        <td className="py-1 px-2.5 text-right font-semibold text-amber-800">{formatBDT(result.minTaxAmount)} ধার্য</td>
                      </tr>
                    )}
                    {result.aitPaid > 0 && (
                      <tr>
                        <td className="py-1 px-2.5 text-emerald-700">৫. বাদ: অগ্রিম প্রদত্ত কর (AIT):</td>
                        <td className="py-1 px-2.5 text-right font-semibold text-emerald-700">- {formatBDT(result.aitPaid)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="bg-gradient-to-r from-brand-700 to-brand-900 p-2 text-white flex items-center justify-between">
                  <div>
                    <div className="text-[10.5px] text-brand-100 uppercase tracking-wider font-semibold">
                      চূড়ান্ত প্রদেয় নিট কর (Net Tax)
                    </div>
                    <div className="text-[9.5px] text-brand-200">
                      মাসিক কিস্তি: {formatBDT(result.monthlyAverageTax)} / মাস
                    </div>
                  </div>
                  <div className="text-base font-black tracking-tight">
                    {formatBDT(result.finalNetTaxPayable)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-300 pt-2.5 mt-2">
            <p className="text-slate-500 italic text-[10.5px] leading-relaxed mb-3.5">
              ঘোষণা: আমি এই মর্মে প্রত্যয়ন করছি যে, এই প্রত্যয়নপত্রে প্রদর্শিত বার্ষিক আয়, বিনিয়োগ এবং কর হিসাব আয়কর আইন ২০২৩ ও অর্থ আইন অনুসারে সম্পূর্ণ সঠিক ও নির্ভুলভাবে প্রণীত হয়েছে। এটি স্বনির্ধারণী রিটার্ন জমার সহায়ক একটি অফিসিয়াল সারসংক্ষেপ প্রত্যয়নপত্র।
            </p>

            <div className="flex items-end justify-between px-2 text-xs">
              <div className="text-center">
                <div className="h-6 border-b border-dashed border-slate-400 w-44 mb-1"></div>
                <div className="text-[10px] text-slate-500">করদাতার স্বাক্ষর ও তারিখ</div>
                <div className="text-slate-800 font-bold text-xs mt-0.5">
                  {form.signatureText || form.taxpayerName || "—"}
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 shadow-sm">
                <div className="h-7 w-7 rounded-md bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700">
                  <Award className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-brand-800 text-[10px] uppercase leading-tight">
                    নাগরিকসেবা ডিজিটাল প্রত্যয়ন
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">
                    VERIFIED • {certRefId}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="h-6 border-b border-dashed border-slate-400 w-44 mb-1"></div>
                <div className="text-[10px] text-slate-500">প্রস্তুতকারী কর্তৃপক্ষ</div>
                <div className="text-slate-800 font-bold text-xs mt-0.5">নাগরিকসেবা অটোমেশন</div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-1.5 flex items-center justify-between text-[9.5px] text-slate-400">
            <span>নাগরিকসেবা | NagorikSheba Citizen Civic Platform</span>
            <span>অফিসিয়াল e-Return পোর্টাল: https://etaxnbr.gov.bd</span>
            <span className="font-semibold text-slate-500">এক পাতার আন্তর্জাতিক A4 সনদ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
