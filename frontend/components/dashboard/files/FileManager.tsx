"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FolderArchive,
  ImageIcon,
  FileText,
  HardDrive,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  Cloud,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import type { IUploadedFile } from "@/types/upload";
import { getUploadedFilesAction, deleteUploadedFileAction } from "@/service/upload";
import { FileUploadZone, formatBytes } from "./FileUploadZone";
import { ImageGallery } from "./ImageGallery";
import { PdfList } from "./PdfList";
import { FilePreviewModal } from "./FilePreviewModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

interface FileManagerProps {
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  } | null;
}

const STRINGS = {
  bn: {
    pageTitle: "ফাইল ও গ্যালারি ব্যবস্থাপনা",
    pageSubtitle: "ক্লাউডিনারি সার্ভার থেকে আপনার প্রয়োজনীয় ছবি ও পিডিএফ ফাইল দেখুন ও ডাউনলোড করুন।",
    tabAll: "সকল ফাইল",
    tabImages: "ছবি গ্যালারি",
    tabPdfs: "পিডিএফ ডকুমেন্টস",
    searchPlaceholder: "ফাইলের নাম দিয়ে খুঁজুন...",
    statTotalFiles: "ক্লাউড ফাইল",
    statImages: "ছবি",
    statPdfs: "পিডিএফ ডকুমেন্ট",
    statStorage: "ব্যবহৃত স্টোরেজ",
    uploadSectionTitle: "নতুন ফাইল আপলোড",
    gallerySectionTitle: "ক্লাউডিনারি সার্ভারের ফাইলসমূহ",
    deleteConfirm: "আপনি কি নিশ্চিতভাবে এই ফাইলটি ক্লাউডিনারি থেকে মুছে ফেলতে চান?",
    noSearchResults: "খোঁজা অনুযায়ী কোনো ফাইল পাওয়া যায়নি",
    noCloudFiles: "ক্লাউডিনারি সার্ভারে এখনো কোনো ফাইল আপলোড করা হয়নি",
    noCloudFilesSubtitle: "উপরে ড্র্যাগ করে বা ব্রাউজ করে আপনার প্রথম ছবি অথবা পিডিএফ ফাইল আপলোড করুন।",
    loadingFiles: "ক্লাউডিনারি সার্ভার থেকে ফাইল লোড হচ্ছে...",
    refreshTooltip: "ফাইল রিফ্রেশ করুন",
    errorLoading: "ফাইল লোড করতে সমস্যা হয়েছে",
  },
  en: {
    pageTitle: "File & Gallery Manager",
    pageSubtitle: "Browse, view, and download images and PDF documents directly from Cloudinary server.",
    tabAll: "All Files",
    tabImages: "Image Gallery",
    tabPdfs: "PDF Documents",
    searchPlaceholder: "Search files by name...",
    statTotalFiles: "Cloud Files",
    statImages: "Images",
    statPdfs: "PDF Documents",
    statStorage: "Storage Used",
    uploadSectionTitle: "Upload New Files",
    gallerySectionTitle: "Files on Cloudinary Server",
    deleteConfirm: "Are you sure you want to permanently delete this file from Cloudinary?",
    noSearchResults: "No files match your search criteria",
    noCloudFiles: "No files uploaded to Cloudinary yet",
    noCloudFilesSubtitle: "Drag & drop or browse above to upload your first image or PDF file.",
    loadingFiles: "Fetching files from Cloudinary server...",
    refreshTooltip: "Refresh files",
    errorLoading: "Failed to load files from server",
  },
};

export function FileManager({ user }: FileManagerProps) {
  const { t } = useTranslation();
  const s = t(STRINGS);

  const [files, setFiles] = useState<IUploadedFile[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "images" | "pdfs">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPreview, setSelectedPreview] = useState<IUploadedFile | null>(null);
  const [fileToDelete, setFileToDelete] = useState<IUploadedFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch real uploaded files directly from Cloudinary
  const loadCloudFiles = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    setFetchError(null);

    try {
      const res = await getUploadedFilesAction();
      if (res.success && Array.isArray(res.data)) {
        setFiles(res.data);
      } else {
        const msg =
          res.message === "fetch failed"
            ? "ব্যাকএন্ড সার্ভার (Port 5000)-এ সংযোগ করা যায়নি। সার্ভার চালু আছে কিনা নিশ্চিত করুন।"
            : res.message || s.errorLoading;
        setFetchError(msg);
      }
    } catch (err: any) {
      console.error("Failed to load files from Cloudinary:", err);
      const msg =
        err?.message === "fetch failed"
          ? "ব্যাকএন্ড সার্ভার (Port 5000)-এ সংযোগ করা যায়নি। সার্ভার চালু আছে কিনা নিশ্চিত করুন।"
          : err?.message || s.errorLoading;
      setFetchError(msg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [s.errorLoading]);

  useEffect(() => {
    loadCloudFiles();
  }, [loadCloudFiles]);

  // When new files are uploaded via backend
  const handleUploadSuccess = (newUploaded: IUploadedFile[]) => {
    // Prepend new files immediately and refresh from Cloudinary in background
    setFiles((prev) => [...newUploaded, ...prev]);
    loadCloudFiles();
  };

  // Open minimal delete confirmation modal
  const handleDelete = (file: IUploadedFile) => {
    setDeleteError(null);
    setFileToDelete(file);
  };

  // Confirm and permanently delete from Cloudinary
  const confirmDelete = async () => {
    if (!fileToDelete) return;

    const publicId = fileToDelete.publicId || fileToDelete.id;
    if (!publicId) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await deleteUploadedFileAction(publicId, fileToDelete.resourceType);
      if (res.success) {
        setFiles((prev) =>
          prev.filter((f) => (f.publicId || f.id) !== publicId)
        );
        if (
          selectedPreview &&
          (selectedPreview.publicId || selectedPreview.id) === publicId
        ) {
          setSelectedPreview(null);
        }
        const fileName = fileToDelete.originalName;
        setFileToDelete(null);
        setSuccessToast(`"${fileName}" সফলভাবে মুছে ফেলা হয়েছে`);
        setTimeout(() => setSuccessToast(null), 3500);
      } else {
        setDeleteError(res.message || "ক্লাউড স্টোরেজ থেকে ফাইলটি মোছা সম্ভব হয়নি।");
      }
    } catch (err: any) {
      setDeleteError(err?.message || "সার্ভারের সাথে যোগাযোগ করা সম্ভব হয়নি।");
    } finally {
      setIsDeleting(false);
    }
  };

  // Proper download handler: streams exact byte-for-byte file with original filename & mime type
  const handleDownload = async (file: IUploadedFile) => {
    try {
      const base =
        process.env.NEXT_PUBLIC_API_SERVER_API || "http://localhost:5000/api";
      const cleanBase = base.replace(/\/+$/, "");
      const downloadEndpoint = `${cleanBase}/upload/download?url=${encodeURIComponent(
        file.secureUrl
      )}&filename=${encodeURIComponent(file.originalName)}`;

      // Try fetching as blob for direct in-memory download
      const response = await fetch(downloadEndpoint);
      if (!response.ok) throw new Error("Proxy download returned non-200");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.originalName || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.warn("Direct blob download failed, falling back to browser navigation:", e);
      // Fallback: browser navigation to download endpoint which sends Content-Disposition: attachment
      const base =
        process.env.NEXT_PUBLIC_API_SERVER_API || "http://localhost:5000/api";
      const cleanBase = base.replace(/\/+$/, "");
      const downloadEndpoint = `${cleanBase}/upload/download?url=${encodeURIComponent(
        file.secureUrl
      )}&filename=${encodeURIComponent(file.originalName)}`;

      const link = document.createElement("a");
      link.href = downloadEndpoint;
      link.setAttribute("download", file.originalName || "document");
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Separate images and PDFs
  const isImageFile = (f: IUploadedFile) => {
    const ext = f.originalName.toLowerCase().split(".").pop();
    const format = f.format?.toLowerCase();
    return (
      f.resourceType === "image" &&
      !["pdf"].includes(format || "") &&
      ext !== "pdf"
    );
  };

  const isPdfFile = (f: IUploadedFile) => {
    const ext = f.originalName.toLowerCase().split(".").pop();
    const format = f.format?.toLowerCase();
    return (
      f.resourceType === "raw" ||
      format === "pdf" ||
      ext === "pdf"
    );
  };

  // Filtered files according to search
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    const q = searchQuery.toLowerCase().trim();
    return files.filter((f) => f.originalName.toLowerCase().includes(q));
  }, [files, searchQuery]);

  const allImages = useMemo(() => files.filter(isImageFile), [files]);
  const allPdfs = useMemo(() => files.filter(isPdfFile), [files]);

  const displayedImages = useMemo(
    () => filteredFiles.filter(isImageFile),
    [filteredFiles]
  );
  const displayedPdfs = useMemo(
    () => filteredFiles.filter(isPdfFile),
    [filteredFiles]
  );

  const totalBytes = useMemo(
    () => files.reduce((acc, curr) => acc + (curr.bytes || 0), 0),
    [files]
  );

  return (
    <div className="space-y-8">
      {/* Top Metric Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Files */}
        <div className="rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-card hover:border-brand-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              {s.statTotalFiles}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <FolderArchive className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">
            {files.length}
          </p>
        </div>

        {/* Images */}
        <div className="rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-card hover:border-brand-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              {s.statImages}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <ImageIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-brand-700">
            {allImages.length}
          </p>
        </div>

        {/* PDFs */}
        <div className="rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-card hover:border-red-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              {s.statPdfs}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-red-600">
            {allPdfs.length}
          </p>
        </div>

        {/* Storage */}
        <div className="rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-card hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              {s.statStorage}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <HardDrive className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900 font-mono">
            {formatBytes(totalBytes)}
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
            {s.uploadSectionTitle}
          </h2>
          <span className="inline-flex items-center gap-1.5 text-xs text-brand-700 font-bold bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
            <Cloud className="h-3.5 w-3.5" />
            Cloudinary Live Storage
          </span>
        </div>
        <FileUploadZone onUploadSuccess={handleUploadSuccess} />
      </section>

      {/* Gallery & Controls Section */}
      <section className="space-y-6 pt-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Tabs */}
          <div className="inline-flex rounded-xl border border-line bg-white p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "all"
                  ? "bg-brand-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {s.tabAll} ({files.length})
            </button>
            <button
              onClick={() => setActiveTab("images")}
              className={`rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "images"
                  ? "bg-brand-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {s.tabImages} ({allImages.length})
            </button>
            <button
              onClick={() => setActiveTab("pdfs")}
              className={`rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "pdfs"
                  ? "bg-brand-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {s.tabPdfs} ({allPdfs.length})
            </button>
          </div>

          {/* Right Action: Search Input & Refresh Button */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={s.searchPlaceholder}
                className="w-full rounded-xl border border-line bg-white pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <button
              onClick={() => loadCloudFiles(true)}
              disabled={isRefreshing || isLoading}
              title={s.refreshTooltip}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-line bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-brand-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin text-brand-700" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-white p-16 text-center shadow-card">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-700" />
            <p className="mt-4 text-sm font-bold text-slate-700">
              {s.loadingFiles}
            </p>
          </div>
        )}

        {/* Fetch Error Banner */}
        {!isLoading && fetchError && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
            <AlertCircle className="h-6 w-6 flex-shrink-0 text-red-600" />
            <div className="flex-1 text-xs sm:text-sm">
              <p className="font-bold">{s.errorLoading}</p>
              <p className="mt-0.5 text-red-700">{fetchError}</p>
            </div>
            <button
              onClick={() => loadCloudFiles(true)}
              className="rounded-xl bg-red-100 px-3.5 py-1.5 text-xs font-bold text-red-800 hover:bg-red-200 transition-colors"
            >
              {s.refreshTooltip}
            </button>
          </div>
        )}

        {/* Clean Empty State: No Files in Cloudinary */}
        {!isLoading && !fetchError && files.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-white p-12 sm:p-16 text-center shadow-card">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <Cloud className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-base sm:text-lg font-bold text-slate-900">
              {s.noCloudFiles}
            </h3>
            <p className="mt-1.5 max-w-md text-xs sm:text-sm text-slate-500">
              {s.noCloudFilesSubtitle}
            </p>
          </div>
        )}

        {/* Search empty state */}
        {!isLoading && !fetchError && files.length > 0 && filteredFiles.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center">
            <Filter className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-800">
              {s.noSearchResults}
            </p>
          </div>
        )}

        {/* Gallery Content View */}
        {!isLoading && !fetchError && filteredFiles.length > 0 && (
          <div className="space-y-10">
            {/* Show Image Gallery if Tab is 'all' or 'images' */}
            {(activeTab === "all" || activeTab === "images") && (
              <ImageGallery
                images={displayedImages}
                onSelectImage={(file) => setSelectedPreview(file)}
                onDownload={handleDownload}
                onDelete={handleDelete}
              />
            )}

            {/* Show PDF List if Tab is 'all' or 'pdfs' */}
            {(activeTab === "all" || activeTab === "pdfs") && (
              <PdfList
                pdfs={displayedPdfs}
                onSelectPdf={(file) => setSelectedPreview(file)}
                onDownload={handleDownload}
                onDelete={handleDelete}
              />
            )}
          </div>
        )}
      </section>

      {/* Lightbox / Preview Modal */}
      <FilePreviewModal
        file={selectedPreview}
        onClose={() => setSelectedPreview(null)}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />

      {/* Minimal Premium Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!fileToDelete}
        file={fileToDelete}
        onClose={() => {
          if (!isDeleting) {
            setFileToDelete(null);
            setDeleteError(null);
          }
        }}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        error={deleteError}
      />

      {/* Floating Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-xs sm:text-sm font-bold text-emerald-800 shadow-xl shadow-emerald-600/10 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="truncate max-w-xs">{successToast}</span>
          <button
            onClick={() => setSuccessToast(null)}
            className="ml-2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
