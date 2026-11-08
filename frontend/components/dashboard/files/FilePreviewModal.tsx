"use client";

import React from "react";
import {
  X,
  Download,
  ExternalLink,
  FileText,
  Calendar,
  HardDrive,
  Maximize2,
  Trash2,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import type { IUploadedFile } from "@/types/upload";
import { formatBytes } from "./FileUploadZone";

interface FilePreviewModalProps {
  file: IUploadedFile | null;
  onClose: () => void;
  onDownload: (file: IUploadedFile) => void;
  onDelete?: (file: IUploadedFile) => void;
}

const STRINGS = {
  bn: {
    previewTitle: "ফাইল প্রিভিউ",
    downloadBtn: "ডাউনলোড করুন",
    openTabBtn: "নতুন ট্যাবে খুলুন",
    closeBtn: "বন্ধ করুন",
    size: "সাইজ",
    format: "ফরম্যাট",
    dimensions: "রেজোলিউশন",
    uploadedOn: "আপলোডের তারিখ",
    pdfNotice: "পিডিএফ ডকুমেন্টটি সম্পূর্ণ দেখতে নিচের বাটনে ক্লিক করুন।",
  },
  en: {
    previewTitle: "File Preview",
    downloadBtn: "Download File",
    openTabBtn: "Open in New Tab",
    closeBtn: "Close",
    size: "Size",
    format: "Format",
    dimensions: "Dimensions",
    uploadedOn: "Uploaded on",
    pdfNotice: "Click below to view the complete PDF document in a new tab.",
  },
};

export function FilePreviewModal({
  file,
  onClose,
  onDownload,
  onDelete,
}: FilePreviewModalProps) {
  const { t } = useTranslation();
  const s = t(STRINGS);

  if (!file) return null;

  const isPdf =
    file.resourceType === "raw" ||
    file.format?.toLowerCase() === "pdf" ||
    file.originalName.toLowerCase().endsWith(".pdf");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-line bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="min-w-0 flex-1 pr-4">
            <h3 className="truncate text-base font-bold text-slate-900">
              {file.originalName}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 font-mono">
              {formatBytes(file.bytes)} • {file.format?.toUpperCase()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label={s.closeBtn}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-auto bg-slate-50 p-4 flex items-center justify-center min-h-[300px]">
          {isPdf ? (
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-md">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-100 text-red-600 shadow-sm">
                <FileText className="h-10 w-10" />
              </div>
              <h4 className="mt-4 text-base font-bold text-slate-800">
                {file.originalName}
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-500">
                {s.pdfNotice}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={file.secureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-slate-900 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>{s.openTabBtn}</span>
                </a>
                <button
                  onClick={() => onDownload(file)}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-brand-800 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>{s.downloadBtn}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="relative max-h-[60vh] max-w-full overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={file.secureUrl}
                alt={file.originalName}
                className="max-h-[60vh] w-auto max-w-full object-contain rounded-xl shadow-md"
              />
            </div>
          )}
        </div>

        {/* Footer Details & Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-line bg-white px-5 py-3.5">
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            {file.width && file.height && (
              <span className="flex items-center gap-1.5 font-mono">
                <Maximize2 className="h-3.5 w-3.5 text-slate-400" />
                {file.width} x {file.height} px
              </span>
            )}
            <span className="flex items-center gap-1.5 font-mono">
              <HardDrive className="h-3.5 w-3.5 text-slate-400" />
              {formatBytes(file.bytes)}
            </span>
            {file.uploadedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {new Date(file.uploadedAt).toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            {onDelete && (
              <button
                onClick={() => onDelete(file)}
                title="মুছে ফেলুন"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-red-600 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>মুছুন</span>
              </button>
            )}
            <button
              onClick={() => onDownload(file)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-brand-800 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>{s.downloadBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

