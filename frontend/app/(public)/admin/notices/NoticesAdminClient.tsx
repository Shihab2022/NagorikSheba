"use client";

import { useState } from "react";
import {
  Bell,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Search,
  Calendar,
  Loader2,
  Database,
  Building,
} from "lucide-react";
import type { NoticeItem } from "@/lib/types";
import type { CategoryItem } from "@/types/category";
import {
  createManualNotice,
  updateNotice,
  deleteNotice,
  getAllNoticesAdmin,
} from "@/service/notices";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Props {
  initialItems: NoticeItem[];
  initialTotal: number;
  initialTotalPages: number;
  categories: CategoryItem[];
}

export function NoticesAdminClient({
  initialItems,
  initialTotal,
  initialTotalPages,
  categories,
}: Props) {
  const [items, setItems] = useState<NoticeItem[]>(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [page, setPage] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [formCategoryId, setFormCategoryId] = useState(categories[0]?.id || "");
  const [formTitle, setFormTitle] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formPublishedAt, setFormPublishedAt] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Re-fetch notices with active filters & pagination
  const fetchNotices = async (newPage = page, catId = selectedCategory, q = search) => {
    setIsLoading(true);
    try {
      const res = await getAllNoticesAdmin({
        page: newPage,
        limit: 20,
        categoryId: catId || undefined,
        search: q || undefined,
      });

      if (res.success && res.data) {
        setItems(res.data.items);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
        setPage(res.data.page);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (catId: string) => {
    setSelectedCategory(catId);
    setPage(1);
    fetchNotices(1, catId, search);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchNotices(1, selectedCategory, search);
  };

  const openCreateModal = () => {
    setEditingNotice(null);
    setFormCategoryId(categories[0]?.id || "");
    setFormTitle("");
    setFormUrl("");
    setFormPublishedAt(new Date().toISOString().split("T")[0]);
    setIsModalOpen(true);
  };

  const openEditModal = (item: NoticeItem) => {
    setEditingNotice(item);
    setFormCategoryId(item.categoryId || categories[0]?.id || "");
    setFormTitle(item.title);
    setFormUrl(item.url);
    setFormPublishedAt(
      item.publishedAt ? new Date(item.publishedAt).toISOString().split("T")[0] : ""
    );
    setIsModalOpen(true);
  };

  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingNotice) {
        const res = await updateNotice(Number(editingNotice.id), {
          categoryId: formCategoryId,
          title: formTitle,
          url: formUrl,
        });

        if (res.success) {
          setIsModalOpen(false);
          await fetchNotices(page);
        } else {
          alert(res.message || "Failed to update notice");
        }
      } else {
        const res = await createManualNotice({
          categoryId: formCategoryId,
          title: formTitle,
          url: formUrl,
          publishedAt: formPublishedAt ? new Date(formPublishedAt).toISOString() : null,
        });

        if (res.success) {
          setIsModalOpen(false);
          await fetchNotices(1);
        } else {
          alert(res.message || "Failed to create notice");
        }
      }
    } catch (err: any) {
      alert(err.message || "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleHide = async (item: NoticeItem) => {
    const newHidden = !item.isHidden;
    try {
      const res = await updateNotice(Number(item.id), { isHidden: newHidden });
      if (res.success) {
        setItems((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isHidden: newHidden } : n))
        );
      } else {
        alert(res.message || "Failed to toggle visibility");
      }
    } catch (err: any) {
      alert(err.message || "Error updating notice");
    }
  };

  const handleDeleteNotice = async (id: number | string) => {
    if (!confirm("Are you sure you want to delete this notice? This action cannot be undone.")) return;
    try {
      const res = await deleteNotice(Number(id));
      if (res.success) {
        setItems((prev) => prev.filter((n) => n.id !== id));
        setTotal((prev) => Math.max(0, prev - 1));
      } else {
        alert(res.message || "Failed to delete notice");
      }
    } catch (err: any) {
      alert(err.message || "Error deleting notice");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Notices Directory
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View, moderate, and manually publish government notices across categories.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" />
          Add Manual Notice
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notices by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-line bg-white pl-10 pr-4 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </form>

        <select
          value={selectedCategory}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="rounded-xl border border-line bg-white px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Notices Table */}
      <div className="rounded-2xl border border-line bg-white shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
            Loading notices...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-base font-bold text-slate-800">No notices found</h3>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your search criteria or add a manual notice above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-line text-xs uppercase font-bold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Title & Link</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Published Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {items.map((notice) => (
                  <tr
                    key={notice.id}
                    className={cn(
                      "hover:bg-slate-50/70 transition-colors",
                      notice.isHidden && "bg-slate-50/40 opacity-70"
                    )}
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900 max-w-md">
                      <p className="line-clamp-2">{notice.title}</p>
                      <a
                        href={notice.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-normal text-brand-600 hover:underline flex items-center gap-1 line-clamp-1 mt-1"
                      >
                        <ExternalLink className="h-3 w-3 shrink-0" />
                        {notice.url}
                      </a>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Database className="h-3 w-3 text-slate-400" />
                        {notice.categoryName || "Uncategorized"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-slate-700">
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3 text-slate-400" />
                        {notice.sourceName || "Manual Entry"}
                      </div>
                      {notice.isManual && (
                        <span className="text-[10px] text-brand-700 font-bold bg-brand-50 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                          Manual
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {notice.publishedAt ? (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          {new Date(notice.publishedAt).toLocaleDateString()}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {notice.isHidden ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          <EyeOff className="h-3 w-3" /> Hidden
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <Eye className="h-3 w-3" /> Public
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Hide / Unhide Toggle */}
                        <button
                          onClick={() => handleToggleHide(notice)}
                          title={notice.isHidden ? "Unhide Notice" : "Hide Notice"}
                          className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                        >
                          {notice.isHidden ? (
                            <Eye className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          )}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(notice)}
                          className="p-1.5 text-slate-500 hover:text-brand-700 rounded-lg hover:bg-slate-100"
                          title="Edit notice"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteNotice(notice.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Delete notice"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-line px-6 py-4">
            <span className="text-xs text-slate-500 font-medium">
              Showing {items.length} of {total} notices
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => fetchNotices(page - 1)}
              >
                Previous
              </Button>
              <span className="text-xs font-bold text-slate-700">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => fetchNotices(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {editingNotice ? "Edit Notice" : "Add Manual Notice"}
            </h2>

            <form onSubmit={handleSaveNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category
                </label>
                <select
                  value={formCategoryId}
                  onChange={(e) => setFormCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-line px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Notice Title
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Official notice title / heading..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-xl border border-line px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Official URL (Outbound SSRF Safe)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://nbr.gov.bd/notice-file.pdf"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  className="w-full rounded-xl border border-line px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Published Date
                </label>
                <input
                  type="date"
                  value={formPublishedAt}
                  onChange={(e) => setFormPublishedAt(e.target.value)}
                  className="w-full rounded-xl border border-line px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-line pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-brand-700 text-white hover:bg-brand-800"
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </span>
                  ) : editingNotice ? (
                    "Save Changes"
                  ) : (
                    "Publish Notice"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
