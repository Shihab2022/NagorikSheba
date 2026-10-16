"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Database,
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  Layers,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FolderOpen,
  ArrowUpDown,
} from "lucide-react";
import { CategoryItem, createCategory, updateCategory, deleteCategory } from "@/service/category";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Textarea, Select } from "@/components/ui/Input";
import { Icon } from "@/components/ui/Icon";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const COMMON_ICONS = [
  "IdCard",
  "FileText",
  "Building2",
  "Building",
  "Landmark",
  "LandPlot",
  "HeartPulse",
  "GraduationCap",
  "Briefcase",
  "Car",
  "Wallet",
  "Baby",
  "Bell",
  "Calculator",
  "Plane",
  "Receipt",
  "Scale",
  "ScrollText",
  "ShieldCheck",
  "Sprout",
  "Store",
  "Truck",
  "LayoutGrid",
];

const STRINGS = {
  bn: {
    title: "ক্যাটাগরি ব্যবস্থাপনা",
    subtitle: "সেবাসমূহ শ্রেণীবদ্ধ করতে ক্যাটাগরি তৈরি, সম্পাদনা ও পর্যবেক্ষণ করুন।",
    addCategory: "নতুন ক্যাটাগরি যুক্ত করুন",
    searchPlaceholder: "ক্যাটাগরির নাম বা স্ল্যাগ দিয়ে খুঁজুন...",
    totalCategories: "মোট ক্যাটাগরি",
    totalServices: "সংযুক্ত সেবা",
    colName: "ক্যাটাগরির নাম",
    colSlug: "স্ল্যাগ (Slug)",
    colDescription: "বিবরণ",
    colServices: "সেবা সংখ্যা",
    colDate: "তারিখ",
    colActions: "পদক্ষেপ",
    noData: "কোনো ক্যাটাগরি পাওয়া যায়নি",
    createFirst: "প্রথম ক্যাটাগরি তৈরি করুন",
    editCategory: "ক্যাটাগরি সম্পাদনা",
    deleteCategory: "ক্যাটাগরি মুছে ফেলুন",
    deleteConfirm: "আপনি কি নিশ্চিত যে এই ক্যাটাগরি মুছে ফেলতে চান?",
    deleteWarning: "এটি মুছে ফেললে সক্রিয় তালিকা থেকে লুকানো হবে।",
    cancel: "বাতিল",
    save: "সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    delete: "মুছে ফেলুন",
    deleting: "মুছে ফেলা হচ্ছে...",
    nameLabel: "ক্যাটাগরির নাম",
    namePlaceholder: "উদাঃ নাগরিক সনদ ও পরিচয়পত্র",
    slugLabel: "ইউআরএল স্ল্যাগ (Slug)",
    slugPlaceholder: "উদাঃ citizen-identity",
    iconLabel: "আইকন (Icon)",
    descLabel: "সংক্ষিপ্ত বিবরণ",
    descPlaceholder: "এই ক্যাটাগরির অন্তর্ভুক্ত সেবাসমূহের সংক্ষিপ্ত বিবরণ...",
    successCreate: "ক্যাটাগরি সফলভাবে তৈরি করা হয়েছে",
    successUpdate: "ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে",
    successDelete: "ক্যাটাগরি সফলভাবে মুছে ফেলা হয়েছে",
    servicesBadge: "টি সেবা",
    viewServices: "সেবাগুলো দেখুন",
  },
  en: {
    title: "Categories Management",
    subtitle: "Create, update and manage service classification categories.",
    addCategory: "Add New Category",
    searchPlaceholder: "Search categories by name or slug...",
    totalCategories: "Total Categories",
    totalServices: "Linked Services",
    colName: "Category Name",
    colSlug: "Slug",
    colDescription: "Description",
    colServices: "Services Count",
    colDate: "Created Date",
    colActions: "Actions",
    noData: "No categories found",
    createFirst: "Create First Category",
    editCategory: "Edit Category",
    deleteCategory: "Delete Category",
    deleteConfirm: "Are you sure you want to delete this category?",
    deleteWarning: "This category will be marked as deleted and hidden from public view.",
    cancel: "Cancel",
    save: "Save Category",
    saving: "Saving...",
    delete: "Delete",
    deleting: "Deleting...",
    nameLabel: "Category Name",
    namePlaceholder: "e.g. Civil Registry & Identity",
    slugLabel: "URL Slug",
    slugPlaceholder: "e.g. civil-registry",
    iconLabel: "Icon",
    descLabel: "Description",
    descPlaceholder: "Brief description of the services in this category...",
    successCreate: "Category created successfully",
    successUpdate: "Category updated successfully",
    successDelete: "Category deleted successfully",
    servicesBadge: "services",
    viewServices: "View Services",
  },
};

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CategoryManager({
  initialCategories = [],
}: {
  initialCategories: CategoryItem[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const s = t(STRINGS);

  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [isSlugTouched, setIsSlugTouched] = useState(false);
  const [formIcon, setFormIcon] = useState("IdCard");
  const [formDesc, setFormDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Auto-open modal if URL has ?action=create
  useEffect(() => {
    if (searchParams.get("action") === "create") {
      resetForm();
      setIsCreateOpen(true);
    }
  }, [searchParams]);

  const resetForm = () => {
    setFormName("");
    setFormSlug("");
    setIsSlugTouched(false);
    setFormIcon("IdCard");
    setFormDesc("");
    setFeedback(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!isSlugTouched && !editingCategory) {
      setFormSlug(generateSlug(val));
    }
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormIcon(cat.icon || "IdCard");
    setFormDesc(cat.description || "");
    setFeedback(null);
  };

  // Submit Create
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFeedback({ type: "error", message: "Name is required" });
      return;
    }
    const slug = formSlug.trim() || generateSlug(formName) || `cat-${Date.now()}`;

    setIsSubmitting(true);
    setFeedback(null);

    const res = await createCategory({
      name: formName.trim(),
      slug,
      icon: formIcon,
      description: formDesc.trim() || undefined,
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      setCategories((prev) => [res.data as CategoryItem, ...prev]);
      setIsCreateOpen(false);
      resetForm();
      setFeedback({ type: "success", message: s.successCreate });
      router.refresh();
    } else {
      setFeedback({ type: "error", message: res.message || "Failed to create category" });
    }
  };

  // Submit Edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!formName.trim()) {
      setFeedback({ type: "error", message: "Name is required" });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const res = await updateCategory(editingCategory.id, {
      name: formName.trim(),
      slug: formSlug.trim() || editingCategory.slug,
      icon: formIcon,
      description: formDesc.trim() || undefined,
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      setCategories((prev) =>
        prev.map((item) => (item.id === editingCategory.id ? { ...item, ...res.data } : item))
      );
      setEditingCategory(null);
      resetForm();
      setFeedback({ type: "success", message: s.successUpdate });
      router.refresh();
    } else {
      setFeedback({ type: "error", message: res.message || "Failed to update category" });
    }
  };

  // Submit Delete
  const handleDeleteSubmit = async () => {
    if (!deletingCategory) return;
    setIsSubmitting(true);

    const res = await deleteCategory(deletingCategory.id);
    setIsSubmitting(false);

    if (res.success) {
      setCategories((prev) => prev.filter((item) => item.id !== deletingCategory.id));
      setDeletingCategory(null);
      setFeedback({ type: "success", message: s.successDelete });
      router.refresh();
    } else {
      setFeedback({ type: "error", message: res.message || "Failed to delete category" });
    }
  };

  // Filtered categories
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
        <div
          className={cn(
            "flex items-center justify-between rounded-xl p-4 text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-top-1",
            feedback.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-800"
          )}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-700 ml-4 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header & Quick Action Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-line bg-white p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200">
              <Database className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-black text-slate-900">{s.title}</h1>
              <p className="text-xs text-slate-500">{s.subtitle}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-brand-800 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{s.addCategory}</span>
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-white p-4 shadow-card">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {s.totalCategories}
          </p>
          <p className="mt-1 text-2xl font-black text-slate-900">{categories.length}</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-4 shadow-card">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {s.totalServices}
          </p>
          <p className="mt-1 text-2xl font-black text-brand-700">{totalServicesCount}</p>
        </div>
        <div className="col-span-2 sm:col-span-1 rounded-xl border border-line bg-white p-4 shadow-card">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            সক্রিয় অবস্থা
          </p>
          <p className="mt-1 text-2xl font-black text-emerald-600">Active</p>
        </div>
      </div>

      {/* Search and Table Container */}
      <div className="rounded-2xl border border-line bg-white shadow-card overflow-hidden">
        {/* Search Bar */}
        <div className="border-b border-line p-4 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={s.searchPlaceholder}
              className="h-10 w-full rounded-xl border border-line bg-white pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-line">
              <tr>
                <th scope="col" className="px-5 py-3.5">{s.colName}</th>
                <th scope="col" className="px-5 py-3.5">{s.colSlug}</th>
                <th scope="col" className="px-5 py-3.5">{s.colDescription}</th>
                <th scope="col" className="px-5 py-3.5 text-center">{s.colServices}</th>
                <th scope="col" className="px-5 py-3.5">{s.colDate}</th>
                <th scope="col" className="px-5 py-3.5 text-right">{s.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                          <Icon name={cat.icon || "IdCard"} className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">{cat.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {cat.id.slice(0, 8)}...</p>
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
                        title={s.viewServices}
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
                          onClick={() => handleOpenEdit(cat)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 cursor-pointer"
                          title={s.editCategory}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingCategory(cat)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                          title={s.deleteCategory}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <FolderOpen className="h-10 w-10 text-slate-300 mb-3" />
                      <p className="font-bold text-slate-700">{s.noData}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {search ? "কোনো মিল পাওয়া যায়নি" : "শুরু করতে একটি ক্যাটাগরি তৈরি করুন"}
                      </p>
                      {!search && (
                        <button
                          type="button"
                          onClick={handleOpenCreate}
                          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-brand-800 cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>{s.createFirst}</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE CATEGORY MODAL */}
      <Modal
        open={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          resetForm();
        }}
        title={s.addCategory}
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {feedback?.type === "error" && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {feedback.message}
            </div>
          )}

          <Field label={s.nameLabel} htmlFor="cat-name" required>
            <Input
              id="cat-name"
              type="text"
              required
              value={formName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder={s.namePlaceholder}
            />
          </Field>

          <Field label={s.slugLabel} htmlFor="cat-slug" hint="ইংরেজি ছোট অক্ষরে ইউআরএল শনাক্তকারী">
            <Input
              id="cat-slug"
              type="text"
              value={formSlug}
              onChange={(e) => {
                setIsSlugTouched(true);
                setFormSlug(e.target.value);
              }}
              placeholder={s.slugPlaceholder}
            />
          </Field>

          <Field label={s.iconLabel} htmlFor="cat-icon">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line bg-slate-50 text-brand-700">
                <Icon name={formIcon} className="h-6 w-6" />
              </span>
              <Select
                id="cat-icon"
                value={formIcon}
                onChange={(e) => setFormIcon(e.target.value)}
              >
                {COMMON_ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </Select>
            </div>
          </Field>

          <Field label={s.descLabel} htmlFor="cat-desc">
            <Textarea
              id="cat-desc"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder={s.descPlaceholder}
              rows={3}
            />
          </Field>

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-line">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              disabled={isSubmitting}
              className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              {s.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-800 transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{isSubmitting ? s.saving : s.save}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT CATEGORY MODAL */}
      <Modal
        open={!!editingCategory}
        onClose={() => {
          setEditingCategory(null);
          resetForm();
        }}
        title={s.editCategory}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {feedback?.type === "error" && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {feedback.message}
            </div>
          )}

          <Field label={s.nameLabel} htmlFor="edit-name" required>
            <Input
              id="edit-name"
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder={s.namePlaceholder}
            />
          </Field>

          <Field label={s.slugLabel} htmlFor="edit-slug">
            <Input
              id="edit-slug"
              type="text"
              value={formSlug}
              onChange={(e) => setFormSlug(e.target.value)}
              placeholder={s.slugPlaceholder}
            />
          </Field>

          <Field label={s.iconLabel} htmlFor="edit-icon">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line bg-slate-50 text-brand-700">
                <Icon name={formIcon} className="h-6 w-6" />
              </span>
              <Select
                id="edit-icon"
                value={formIcon}
                onChange={(e) => setFormIcon(e.target.value)}
              >
                {COMMON_ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </Select>
            </div>
          </Field>

          <Field label={s.descLabel} htmlFor="edit-desc">
            <Textarea
              id="edit-desc"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder={s.descPlaceholder}
              rows={3}
            />
          </Field>

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-line">
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              disabled={isSubmitting}
              className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              {s.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-800 transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{isSubmitting ? s.saving : s.save}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <Modal
        open={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        title={s.deleteCategory}
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-900">{s.deleteConfirm}</p>
                <p className="mt-1 text-xs text-red-700">{s.deleteWarning}</p>
                {deletingCategory && (
                  <p className="mt-2 text-xs font-bold text-slate-800">
                    "{deletingCategory.name}" ({deletingCategory.slug})
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeletingCategory(null)}
              disabled={isSubmitting}
              className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              {s.cancel}
            </button>
            <button
              type="button"
              onClick={handleDeleteSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{isSubmitting ? s.deleting : s.delete}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
