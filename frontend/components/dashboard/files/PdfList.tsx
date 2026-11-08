"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  ExternalLink,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileCheck,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import type { IUploadedFile } from "@/types/upload";
import { formatBytes } from "./FileUploadZone";

interface PdfListProps {
  pdfs: IUploadedFile[];
  onSelectPdf: (file: IUploadedFile) => void;
  onDownload: (file: IUploadedFile) => void;
  onDelete?: (file: IUploadedFile) => void;
}

const STRINGS = {
  bn: {
    sectionTitle: "পিডিএফ ডকুমেন্টস",
    totalCount: "টি ডকুমেন্ট",
    emptyTitle: "কোনো পিডিএফ পাওয়া যায়নি",
    emptySubtitle: "আপনার প্রয়োজনীয় সরকারি ফর্ম ও পিডিএফ ডকুমেন্ট উপরে ড্র্যাগ করে আপলোড করুন।",
    showMore: "আরও দেখুন",
    showLess: "কম দেখুন",
    viewBtn: "ওপেন করুন",
    downloadBtn: "ডাউনলোড",
    deleteTooltip: "মুছে ফেলুন",
    pdfBadge: "PDF",
  },
  en: {
    sectionTitle: "PDF Documents",
    totalCount: "documents",
    emptyTitle: "No PDF documents found",
    emptySubtitle: "Drag & drop your forms and PDF files above to see them here.",
    showMore: "Show More",
    showLess: "Show Less",
    viewBtn: "Open",
    downloadBtn: "Download",
    deleteTooltip: "Delete file",
    pdfBadge: "PDF",
  },
};

const INITIAL_LIMIT = 5;

export function PdfList({
  pdfs,
  onSelectPdf,
  onDownload,
  onDelete,
}: PdfListProps) {
  const { t } = useTranslation();
  const s = t(STRINGS);

  const [expanded, setExpanded] = useState(false);

  const visiblePdfs = expanded ? pdfs : pdfs.slice(0, INITIAL_LIMIT);
  const remainingCount = pdfs.length - INITIAL_LIMIT;

  if (pdfs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white p-8 sm:p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <FileText className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-800">
          {s.emptyTitle}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          {s.emptySubtitle}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header bar with count badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            {s.sectionTitle}
          </h3>
          <span className="rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-bold text-red-700">
            {pdfs.length} {s.totalCount}
          </span>
        </div>

        {pdfs.length > INITIAL_LIMIT && (
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            {expanded
              ? `${pdfs.length} of ${pdfs.length}`
              : `${INITIAL_LIMIT} of ${pdfs.length}`}
          </span>
        )}
      </div>

      {/* PDF Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {visiblePdfs.map((pdf, idx) => (
          <div
            key={pdf.publicId || pdf.id || `${pdf.originalName}-${idx}`}
            className="group flex flex-col justify-between rounded-2xl border border-line bg-white p-4 shadow-card hover:border-red-200 hover:shadow-lift transition-all"
          >
            <div className="flex items-start gap-3.5">
              {/* PDF Icon Avatar */}
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100 group-hover:scale-105 transition-transform">
                <FileText className="h-6 w-6" />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-black uppercase text-red-700">
                    {s.pdfBadge}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {formatBytes(pdf.bytes)}
                  </span>
                </div>
                <h4
                  className="mt-1 truncate text-sm font-bold text-slate-900"
                  title={pdf.originalName}
                >
                  {pdf.originalName}
                </h4>
                {pdf.uploadedAt && (
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {new Date(pdf.uploadedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
              <button
                onClick={() => onSelectPdf(pdf)}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>{s.viewBtn}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDownload(pdf)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 border border-brand-200 px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-100 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{s.downloadBtn}</span>
                </button>

                {onDelete && (
                  <button
                    onClick={() => onDelete(pdf)}
                    title={s.deleteTooltip}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More / Show Less Toggle Button */}
      {pdfs.length > INITIAL_LIMIT && (
        <div className="pt-2 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-red-700 shadow-sm hover:bg-red-50 hover:border-red-300 transition-all"
          >
            {expanded ? (
              <>
                <span>{s.showLess}</span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>
                  {s.showMore} ({remainingCount})
                </span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

