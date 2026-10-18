"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Database, Plus } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/service/category";
import type { CategoryItem } from "@/types/category";
import { DashboardAlert } from "@/components/dashboard/common/DashboardAlert";
import { T } from "@/components/ui/T";
import { CategoryStats } from "./CategoryStats";
import { CategoryTable } from "./CategoryTable";
import { CategoryFormModal } from "./CategoryFormModal";
import { CategoryDeleteModal } from "./CategoryDeleteModal";

export interface CategoryManagerProps {
  initialCategories: CategoryItem[];
}

export function CategoryManager({ initialCategories = [] }: CategoryManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Auto-open modal if URL has ?action=create
  useEffect(() => {
    if (searchParams.get("action") === "create") {
      const timer = setTimeout(() => {
        setIsCreateOpen(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleCreateSubmit = async (data: {
    name: string;
    slug: string;
    icon: string;
    description?: string;
  }) => {
    setIsSubmitting(true);
    setFeedback(null);

    const res = await createCategory(data);
    setIsSubmitting(false);

    if (res.success && res.data) {
      setCategories((prev) => [res.data as CategoryItem, ...prev]);
      setIsCreateOpen(false);
      setFeedback({ type: "success", message: "ক্যাটাগরি সফলভাবে তৈরি করা হয়েছে" });
      router.refresh();
    } else {
      setFeedback({ type: "error", message: res.message || "Failed to create category" });
    }
  };

  const handleEditSubmit = async (data: {
    name: string;
    slug: string;
    icon: string;
    description?: string;
  }) => {
    if (!editingCategory) return;
    setIsSubmitting(true);
    setFeedback(null);

    const res = await updateCategory(editingCategory.id, data);
    setIsSubmitting(false);

    if (res.success && res.data) {
      setCategories((prev) =>
        prev.map((item) => (item.id === editingCategory.id ? { ...item, ...res.data } : item))
      );
      setEditingCategory(null);
      setFeedback({ type: "success", message: "ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে" });
      router.refresh();
    } else {
      setFeedback({ type: "error", message: res.message || "Failed to update category" });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    setIsSubmitting(true);

    const res = await deleteCategory(deletingCategory.id);
    setIsSubmitting(false);

    if (res.success) {
      setCategories((prev) => prev.filter((item) => item.id !== deletingCategory.id));
      setDeletingCategory(null);
      setFeedback({ type: "success", message: "ক্যাটাগরি সফলভাবে মুছে ফেলা হয়েছে" });
      router.refresh();
    } else {
      setFeedback({ type: "error", message: res.message || "Failed to delete category" });
    }
  };

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [categories, search]);

  const totalServicesCount = useMemo(() => {
    return categories.reduce((acc, curr) => acc + (Number(curr.serviceCount) || 0), 0);
  }, [categories]);

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
      {feedback && (
        <DashboardAlert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      {/* Header & Quick Action Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-line bg-white p-6 shadow-card">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200">
            <Database className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-black text-slate-900">
              <T bn="ক্যাটাগরি ব্যবস্থাপনা" en="Categories Management" />
            </h1>
            <p className="text-xs text-slate-500">
              <T
                bn="সেবাসমূহ শ্রেণীবদ্ধ করতে ক্যাটাগরি তৈরি, সম্পাদনা ও পর্যবেক্ষণ করুন।"
                en="Create, update and manage service classification categories."
              />
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-brand-800 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>
            <T bn="নতুন ক্যাটাগরি যুক্ত করুন" en="Add New Category" />
          </span>
        </button>
      </div>

      {/* Stats Summary */}
      <CategoryStats
        totalCategories={categories.length}
        totalServices={totalServicesCount}
      />

      {/* Search and Table */}
      <CategoryTable
        categories={filteredCategories}
        search={search}
        onSearchChange={setSearch}
        onEdit={(cat) => setEditingCategory(cat)}
        onDelete={(cat) => setDeletingCategory(cat)}
        onCreateOpen={() => setIsCreateOpen(true)}
      />

      {/* Create Modal */}
      <CategoryFormModal
        isOpen={isCreateOpen}
        editingCategory={null}
        isSubmitting={isSubmitting}
        errorMessage={feedback?.type === "error" ? feedback.message : null}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      {/* Edit Modal */}
      <CategoryFormModal
        isOpen={!!editingCategory}
        editingCategory={editingCategory}
        isSubmitting={isSubmitting}
        errorMessage={feedback?.type === "error" ? feedback.message : null}
        onClose={() => setEditingCategory(null)}
        onSubmit={handleEditSubmit}
      />

      {/* Delete Confirmation Modal */}
      <CategoryDeleteModal
        category={deletingCategory}
        isOpen={!!deletingCategory}
        isSubmitting={isSubmitting}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default CategoryManager;
