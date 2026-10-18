"use client";

import Link from "next/link";
import { Search, Layers, Pencil, Trash2 } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { T } from "@/components/ui/T";
import { DashboardEmptyState } from "@/components/dashboard/common/DashboardEmptyState";
import type { CategoryItem } from "@/types/category";

export interface CategoryTableProps {
  categories: CategoryItem[];
  search: string;
  onSearchChange: (value: string) => void;
  onEdit: (category: CategoryItem) => void;
  onDelete: (category: CategoryItem) => void;
  onCreateOpen: () => void;
}

export function CategoryTable({
  categories,
  search,
  onSearchChange,
  onEdit,
  onDelete,
  onCreateOpen,
}: CategoryTableProps) {
  return (
    <div className="rounded-2xl border border-line bg-white shadow-card overflow-hidden">
      {/* Search Bar */}
      <div className="border-b border-line p-4 bg-slate-50/50">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ক্যাটাগরির নাম বা স্ল্যাগ দিয়ে খুঁজুন..."
            className="h-10 w-full rounded-xl border border-line bg-white pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-line">
            <tr>
              <th scope="col" className="px-5 py-3.5">
                <T bn="ক্যাটাগরির নাম" en="Category Name" />
              </th>
              <th scope="col" className="px-5 py-3.5">
                <T bn="স্ল্যাগ (Slug)" en="Slug" />
              </th>
              <th scope="col" className="px-5 py-3.5">
                <T bn="বিবরণ" en="Description" />
              </th>
              <th scope="col" className="px-5 py-3.5 text-center">
                <T bn="সেবা সংখ্যা" en="Services Count" />
              </th>
              <th scope="col" className="px-5 py-3.5">
                <T bn="তারিখ" en="Created Date" />
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">
                <T bn="পদক্ষেপ" en="Actions" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat.id} className="transition-colors hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                        <Icon name={cat.icon || "IdCard"} className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-bold text-slate-900">{cat.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          ID: {cat.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <code className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-mono text-slate-700">
                      {cat.slug}
                    </code>
                  </td>

                  <td className="px-5 py-4 max-w-xs">
                    <p className="truncate text-slate-600" title={cat.description || "—"}>
                      {cat.description || "—"}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <Link
                      href={`/admin/services?categoryId=${cat.id}`}
                      className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-800 transition hover:bg-brand-100"
                      title="View Services"
                    >
                      <Layers className="h-3 w-3 text-brand-600" />
                      <span>{cat.serviceCount || 0}</span>
                    </Link>
                  </td>

                  <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                    {cat.createdAt
                      ? new Date(cat.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>

                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(cat)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 cursor-pointer"
                        title="Edit Category"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(cat)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                        title="Delete Category"
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
                    title={{ bn: "কোনো ক্যাটাগরি পাওয়া যায়নি", en: "No categories found" }}
                    description={{
                      bn: search ? "কোনো মিল পাওয়া যায়নি" : "শুরু করতে একটি ক্যাটাগরি তৈরি করুন",
                      en: search ? "No matches found" : "Create a category to get started",
                    }}
                    action={
                      !search
                        ? {
                            label: { bn: "প্রথম ক্যাটাগরি তৈরি করুন", en: "Create First Category" },
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
    </div>
  );
}

export default CategoryTable;
