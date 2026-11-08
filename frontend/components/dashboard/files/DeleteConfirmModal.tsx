"use client";

import React, { useEffect } from "react";
import { Trash2, AlertTriangle, X, Loader2, FileText, ImageIcon } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import type { IUploadedFile } from "@/types/upload";
import { formatBytes } from "./FileUploadZone";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  file: IUploadedFile | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
  error?: string | null;
}

const STRINGS = {
  bn: {
    title: "ফাইলটি মুছে ফেলতে চান?",
    subtitle: "এই ফাইলটি ক্লাউডিনারি ক্লাউড স্টোরেজ থেকে স্থায়ীভাবে মুছে যাবে। এই কাজটি আর ফিরিয়ে আনা সম্ভব নয়।",
    cancelBtn: "না, বাতিল করুন",
    confirmBtn: "হ্যাঁ, মুছে ফেলুন",
    deleting: "মুছে ফেলা হচ্ছে...",
  },
  en: {
    title: "Delete this file?",
    subtitle: "This file will be permanently deleted from Cloudinary cloud storage. This action cannot be undone.",
    cancelBtn: "Cancel",
    confirmBtn: "Yes, Delete",
    deleting: "Deleting...",
  },
};

export function DeleteConfirmModal({
  isOpen,
  file,
  onClose,
  onConfirm,
  isDeleting,
  error,
}: DeleteConfirmModalProps) {
  const { t } = useTranslation();
  const s = t(STRINGS);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !file) return null;

  const isPdf =
    file.resourceType === "raw" ||
    file.format?.toLowerCase() === "pdf" ||
    file.originalName.toLowerCase().endsWith(".pdf");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => {
        if (!isDeleting) onClose();
      }}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Minimal Alert Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-8 ring-red-50/60 transition-transform">
            <Trash2 className="h-6 w-6 stroke-[2.2]" />
          </div>

          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            {s.title}
          </h3>

          <p className="mt-1.5 text-xs text-slate-500 leading-relaxed max-w-xs">
            {s.subtitle}
          </p>
        </div>

        {/* Selected File Card Preview */}
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
            {isPdf ? (
              <FileText className="h-5 w-5 text-red-500" />
            ) : file.secureUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={file.secureUrl}
                alt={file.originalName}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-5 w-5 text-brand-600" />
            )}
          </div>

          <div className="min-w-0 flex-1 text-left">
            <p
              className="truncate text-xs font-bold text-slate-800"
              title={file.originalName}
            >
              {file.originalName}
            </p>
            <p className="mt-0.5 text-[11px] font-mono text-slate-400">
              {formatBytes(file.bytes)} • {file.format?.toUpperCase() || (isPdf ? "PDF" : "IMG")}
            </p>
          </div>
        </div>

        {/* Inline Error if delete fails */}
        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 p-2.5 text-xs font-semibold text-red-700 border border-red-200">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
          >
            {s.cancelBtn}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-md shadow-red-500/25 hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>{s.deleting}</span>
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>{s.confirmBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

