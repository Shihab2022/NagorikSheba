"use client";

import React, { useState } from "react";
import {
  ImageIcon,
  Eye,
  Download,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import type { IUploadedFile } from "@/types/upload";
import { formatBytes } from "./FileUploadZone";

interface ImageGalleryProps {
  images: IUploadedFile[];
  onSelectImage: (file: IUploadedFile) => void;
  onDownload: (file: IUploadedFile) => void;
  onDelete?: (file: IUploadedFile) => void;
}

const STRINGS = {
  bn: {
    sectionTitle: "ছবি গ্যালারি",
    totalCount: "টি ছবি",
    emptyTitle: "কোনো ছবি পাওয়া যায়নি",
    emptySubtitle: "আপনার প্রয়োজনীয় ছবিগুলো উপরে ড্র্যাগ করে আপলোড করুন।",
    showMore: "আরও দেখুন",
    showLess: "কম দেখুন",
    viewTooltip: "বড় করে দেখুন",
    downloadTooltip: "ডাউনলোড করুন",
    deleteTooltip: "মুছে ফেলুন",
    initialLimitNote: "এক সাথে ৫টি ছবি প্রদর্শিত হচ্ছে",
  },
  en: {
    sectionTitle: "Image Gallery",
    totalCount: "images",
    emptyTitle: "No images found",
    emptySubtitle: "Drag & drop your images above to see them here.",
    showMore: "Show More",
    showLess: "Show Less",
    viewTooltip: "View full size",
    downloadTooltip: "Download file",
    deleteTooltip: "Delete file",
    initialLimitNote: "Showing 5 images",
  },
};

const INITIAL_LIMIT = 5;

export function ImageGallery({
  images,
  onSelectImage,
  onDownload,
  onDelete,
}: ImageGalleryProps) {
  const { t } = useTranslation();
  const s = t(STRINGS);

  const [expanded, setExpanded] = useState(false);

  const visibleImages = expanded ? images : images.slice(0, INITIAL_LIMIT);
  const remainingCount = images.length - INITIAL_LIMIT;

  if (images.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white p-8 sm:p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <ImageIcon className="h-7 w-7" />
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
          <span className="rounded-full bg-brand-50 border border-brand-200 px-2.5 py-0.5 text-xs font-bold text-brand-700">
            {images.length} {s.totalCount}
          </span>
        </div>

        {images.length > INITIAL_LIMIT && (
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            {expanded
              ? `${images.length} of ${images.length}`
              : `${INITIAL_LIMIT} of ${images.length}`}
          </span>
        )}
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {visibleImages.map((img, idx) => (
          <div
            key={img.publicId || img.id || `${img.originalName}-${idx}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card hover:border-brand-300 hover:shadow-lift transition-all"
          >
            {/* Image Preview Container */}
            <div
              onClick={() => onSelectImage(img)}
              className="relative aspect-square w-full overflow-hidden bg-slate-100 cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.secureUrl}
                alt={img.originalName}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5">
                {/* Top action buttons */}
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload(img);
                    }}
                    title={s.downloadTooltip}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-slate-800 shadow hover:bg-white hover:text-brand-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(img);
                      }}
                      title={s.deleteTooltip}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/90 text-white shadow hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Bottom View button in overlay */}
                <div className="flex items-center justify-center">
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-700/90 backdrop-blur-sm px-3 py-1 text-[11px] font-bold text-white shadow">
                    <Eye className="h-3.5 w-3.5" />
                    <span>{s.viewTooltip}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Card Details */}
            <div className="p-2.5 bg-white">
              <p
                className="truncate text-xs font-bold text-slate-800"
                title={img.originalName}
              >
                {img.originalName}
              </p>
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>{formatBytes(img.bytes)}</span>
                <span className="uppercase text-[10px] font-bold tracking-wider rounded bg-slate-100 px-1.5 py-0.2">
                  {img.format || "img"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More / Show Less Toggle Button */}
      {images.length > INITIAL_LIMIT && (
        <div className="pt-2 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-brand-700 shadow-sm hover:bg-brand-50 hover:border-brand-300 transition-all"
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

