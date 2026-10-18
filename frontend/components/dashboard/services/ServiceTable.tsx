"use client";

import Link from "next/link";
import {
  FileText,
  ListOrdered,
  CreditCard,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { T } from "@/components/ui/T";
import { DashboardEmptyState } from "@/components/dashboard/common/DashboardEmptyState";
import type { ServiceItem } from "@/types/service";
import type { CategoryItem } from "@/types/category";

export interface ServiceTableProps {
  services: ServiceItem[];
  categories: CategoryItem[];
  search: string;
  selectedCategory: string;
  selectedStatus: string;
  onEdit: (service: ServiceItem) => void;
  onDelete: (service: ServiceItem) => void;
  onTogglePublish: (service: ServiceItem) => void;
  onCreateOpen: () => void;
}

export function ServiceTable({
  services,
  categories,
  search,
  selectedCategory,
  selectedStatus,
  onEdit,
  onDelete,
  onTogglePublish,
  onCreateOpen,
}: ServiceTableProps) {
  const isFiltered = search || selectedCategory !== "ALL" || selectedStatus !== "ALL";

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-line">
          <tr>
            <th scope="col" className="px-5 py-3.5">
              <T bn="সেবার নাম ও ক্যাটাগরি" en="Service & Category" />
            </th>
            <th scope="col" className="px-5 py-3.5">
              <T bn="সম্পৃক্ত স্কিমা উপাদান" en="Related Schemas" />
            </th>
            <th scope="col" className="px-5 py-3.5">
              <T bn="সময়সীমা" en="Processing Time" />
            </th>
            <th scope="col" className="px-5 py-3.5">
              <T bn="যাচাই অবস্থা" en="Verification" />
            </th>
            <th scope="col" className="px-5 py-3.5 text-center">
              <T bn="প্রকাশ" en="Published" />
            </th>
            <th scope="col" className="px-5 py-3.5 text-right">
              <T bn="পদক্ষেপ" en="Actions" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {services.length > 0 ? (
            services.map((svc) => (
              <tr key={svc.id} className="transition-colors hover:bg-slate-50/70">
                {/* Service Name & Category */}
                <td className="px-5 py-4 max-w-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{svc.name}</span>
                      {svc.category_name && (
                        <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-800 border border-brand-200">
                          {svc.category_name}
                        </span>
                      )}
                    </div>
                    <p className="line-clamp-1 text-slate-500 text-[11px]">
                      {svc.shortDescription}
                    </p>
                    <code className="text-[10px] font-mono text-slate-400">/{svc.slug}</code>
                  </div>
                </td>

                {/* Related Schemas Indicators */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                        (svc.requirementCount || 0) > 0
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-slate-100 text-slate-400"
                      )}
                      title="Requirements / Documents"
                    >
                      <FileText className="h-3 w-3" />
                      <span>{svc.requirementCount || 0} Req</span>
                    </span>

                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                        (svc.stepCount || 0) > 0
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-slate-100 text-slate-400"
                      )}
                      title="Procedure Steps"
                    >
                      <ListOrdered className="h-3 w-3" />
                      <span>{svc.stepCount || 0} Steps</span>
                    </span>

                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                        (svc.feeCount || 0) > 0
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-400"
                      )}
                      title="Fees"
                    >
                      <CreditCard className="h-3 w-3" />
                      <span>{svc.feeCount || 0} Fees</span>
                    </span>
                  </div>
                </td>

                {/* Processing Time */}
                <td className="px-5 py-4 whitespace-nowrap">
                  {svc.processingTime ? (
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{svc.processingTime}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>

                {/* Verification Status */}
                <td className="px-5 py-4 whitespace-nowrap">
                  {svc.verificationStatus === "VERIFIED" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      <span>
                        <T bn="যাচাইকৃত" en="Verified" />
                      </span>
                    </span>
                  ) : svc.verificationStatus === "NEEDS_REVIEW" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">
                      <ShieldAlert className="h-3 w-3 text-amber-600" />
                      <span>
                        <T bn="পুনর্বিবেচনা প্রয়োজন" en="Needs Review" />
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 ring-1 ring-slate-200">
                      <span>
                        <T bn="অযাচাইকৃত" en="Unverified" />
                      </span>
                    </span>
                  )}
                </td>

                {/* Published Toggle */}
                <td className="px-5 py-4 text-center whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onTogglePublish(svc)}
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                      svc.isPublished ? "bg-emerald-600" : "bg-slate-300"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                        svc.isPublished ? "translate-x-4" : "translate-x-0"
                      )}
                    />
                  </button>
                </td>

                {/* Actions */}
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5">
                    {svc.officialUrl && (
                      <a
                        href={svc.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700"
                        title="Official Portal"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => onEdit(svc)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 cursor-pointer"
                      title="Edit Service"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(svc)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                      title="Delete Service"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                <DashboardEmptyState
                  title={{ bn: "কোনো সেবা পাওয়া যায়নি", en: "No services found" }}
                  description={{
                    bn: isFiltered
                      ? "কোনো সেবা মেলেনি"
                      : categories.length === 0
                      ? "সেবা তৈরি করার আগে অন্তত একটি ক্যাটাগরি তৈরি করতে হবে।"
                      : "শুরু করতে একটি সেবা যুক্ত করুন",
                    en: isFiltered
                      ? "No services matched your query"
                      : categories.length === 0
                      ? "You need at least one category before creating a service."
                      : "Create a service to get started",
                  }}
                  action={
                    !isFiltered
                      ? categories.length === 0
                        ? {
                            label: { bn: "ক্যাটাগরি তৈরি করুন", en: "Create a Category" },
                            href: "/admin/categories?action=create",
                          }
                        : {
                            label: { bn: "প্রথম সেবা তৈরি করুন", en: "Create First Service" },
                            onClick: onCreateOpen,
                          }
                      : undefined
                  }
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ServiceTable;
