"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import {
  UploadCloud,
  FileText,
  ImageIcon,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { uploadFilesAction } from "@/service/upload";
import type { IUploadedFile } from "@/types/upload";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILE_COUNT = 10;
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf"];
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

interface QueuedFile {
  id: string;
  file: File;
  previewUrl?: string;
  isPdf: boolean;
}

interface FileUploadZoneProps {
  onUploadSuccess: (newFiles: IUploadedFile[]) => void;
}

const STRINGS = {
  bn: {
    dropTitle: "আপনার ফাইল এখানে টেনে আনুন বা সিলেক্ট করুন",
    dropSubtitle: "ছবি (JPEG, PNG, WebP, GIF) অথবা PDF ডকুমেন্ট (প্রতিটি সর্বোচ্চ ৫MB, সর্বোচ্চ ১০টি ফাইল)",
    browseBtn: "কম্পিউটার বা ফোন থেকে ব্রাউজ করুন",
    selectedFiles: "আপলোডের জন্য নির্বাচিত ফাইল",
    clearAll: "সব মুছুন",
    uploadBtn: "আপলোড শুরু করুন",
    uploading: "আপলোড হচ্ছে...",
    errorTitle: "আপলোড ত্রুটি",
    successMsg: "ফাইলগুলো সফলভাবে আপলোড হয়েছে!",
    limitReached: "একসাথে সর্বোচ্চ ১০টি ফাইল আপলোড করা যাবে।",
    sizeExceeded: "ফাইলের সাইজ ৫MB-এর বেশি হতে পারবে না:",
    invalidType: "অননুমোদিত ফাইল ফরম্যাট:",
    allowedNote: "সমর্থিত: JPG, PNG, WebP, GIF, PDF • সর্বোচ্চ ৫MB",
  },
  en: {
    dropTitle: "Drag & drop your files here, or browse",
    dropSubtitle: "Images (JPEG, PNG, WebP, GIF) or PDF documents (Max 5MB each, up to 10 files)",
    browseBtn: "Browse files from device",
    selectedFiles: "Selected files for upload",
    clearAll: "Clear all",
    uploadBtn: "Start Upload",
    uploading: "Uploading...",
    errorTitle: "Upload Error",
    successMsg: "Files uploaded successfully!",
    limitReached: "You can upload a maximum of 10 files at once.",
    sizeExceeded: "File size exceeds 5MB limit:",
    invalidType: "Unsupported file type:",
    allowedNote: "Supported: JPG, PNG, WebP, GIF, PDF • Max 5MB each",
  },
};

export function FileUploadZone({ onUploadSuccess }: FileUploadZoneProps) {
  const { t } = useTranslation();
  const s = t(STRINGS);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [queuedFiles, setQueuedFiles] = useState<QueuedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateAndAddFiles = (incomingFiles: FileList | File[]) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const filesArray = Array.from(incomingFiles);

    if (queuedFiles.length + filesArray.length > MAX_FILE_COUNT) {
      setErrorMessage(s.limitReached);
      return;
    }

    const newQueued: QueuedFile[] = [];

    for (const file of filesArray) {
      const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
      const isAllowedExt = ALLOWED_EXTENSIONS.includes(ext);
      const isAllowedMime = ALLOWED_MIME_TYPES.includes(file.type);

      if (!isAllowedExt && !isAllowedMime) {
        setErrorMessage(`${s.invalidType} ${file.name}`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage(`${s.sizeExceeded} ${file.name} (${formatBytes(file.size)})`);
        return;
      }

      const isPdf = file.type === "application/pdf" || ext === ".pdf";
      let previewUrl: string | undefined;

      if (!isPdf && file.type.startsWith("image/")) {
        previewUrl = URL.createObjectURL(file);
      }

      newQueued.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl,
        isPdf,
      });
    }

    setQueuedFiles((prev) => [...prev, ...newQueued]);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
    // reset input value so re-selecting same file triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeQueuedFile = (id: string) => {
    setQueuedFiles((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearAllQueued = () => {
    queuedFiles.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setQueuedFiles([]);
    setErrorMessage(null);
  };

  const handleUpload = async () => {
    if (queuedFiles.length === 0 || isUploading) return;

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      queuedFiles.forEach((item) => {
        formData.append("files", item.file);
      });

      const response = await uploadFilesAction(formData);

      if (response.success && response.data?.uploaded) {
        const uploadedList = response.data.uploaded.map((f) => ({
          ...f,
          id: f.publicId || `${Date.now()}-${Math.random()}`,
          uploadedAt: new Date().toISOString(),
        }));

        setSuccessMessage(s.successMsg);
        clearAllQueued();
        onUploadSuccess(uploadedList);
      } else {
        const msg =
          response.message === "fetch failed"
            ? "ব্যাকএন্ড সার্ভার (Port 5000)-এ সংযোগ করা যায়নি। সার্ভার চালু আছে কিনা নিশ্চিত করুন।"
            : response.message || "Upload failed. Please try again.";
        setErrorMessage(msg);
      }
    } catch (err: any) {
      const msg =
        err?.message === "fetch failed"
          ? "ব্যাকএন্ড সার্ভার (Port 5000)-এ সংযোগ করা যায়নি। সার্ভার চালু আছে কিনা নিশ্চিত করুন।"
          : err?.message || "Failed to communicate with upload server.";
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp,.gif,.pdf"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Drag & Drop Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 sm:p-10 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-brand-500 bg-brand-50/70 scale-[0.99] shadow-inner"
            : "border-slate-300 hover:border-brand-400 bg-white hover:bg-slate-50/50 shadow-card"
        }`}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 shadow-sm transition-transform group-hover:scale-110">
          <UploadCloud className="h-8 w-8 animate-pulse text-brand-600" />
        </div>

        <h3 className="mt-4 text-base sm:text-lg font-bold text-slate-900">
          {s.dropTitle}
        </h3>

        <p className="mt-1.5 max-w-md text-xs sm:text-sm text-slate-500">
          {s.dropSubtitle}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-brand-800 transition-colors">
          <Plus className="h-4 w-4" />
          <span>{s.browseBtn}</span>
        </div>

        <p className="mt-3 text-[11px] sm:text-xs text-slate-400">
          {s.allowedNote}
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
          <div className="flex-1 text-xs sm:text-sm font-medium">
            <span className="font-bold">{s.errorTitle}: </span>
            {errorMessage}
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Success Banner */}
      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-600" />
          <p className="flex-1 text-xs sm:text-sm font-semibold">
            {successMessage}
          </p>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-400 hover:text-emerald-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Queued Files List Before Upload */}
      {queuedFiles.length > 0 && (
        <div className="rounded-2xl border border-line bg-white p-4 sm:p-6 shadow-card">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                {s.selectedFiles}
              </span>
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-800">
                {queuedFiles.length} / {MAX_FILE_COUNT}
              </span>
            </div>
            <button
              onClick={clearAllQueued}
              disabled={isUploading}
              className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              {s.clearAll}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {queuedFiles.map((item) => (
              <div
                key={item.id}
                className="group relative flex items-center gap-3 rounded-xl border border-line bg-slate-50/50 p-2.5 transition-all hover:bg-slate-50"
              >
                {/* Thumbnail or PDF icon */}
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-white">
                  {item.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="h-full w-full object-cover"
                    />
                  ) : item.isPdf ? (
                    <FileText className="h-6 w-6 text-red-500" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-brand-600" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-xs font-bold text-slate-800"
                    title={item.file.name}
                  >
                    {item.file.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500 font-mono">
                    {formatBytes(item.file.size)}
                  </p>
                </div>

                <button
                  onClick={() => removeQueuedFile(item.id)}
                  disabled={isUploading}
                  className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              onClick={handleUpload}
              disabled={isUploading || queuedFiles.length === 0}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-800 transition-all disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{s.uploading}</span>
                </>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4" />
                  <span>
                    {s.uploadBtn} ({queuedFiles.length})
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

