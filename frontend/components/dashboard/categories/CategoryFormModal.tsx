"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Textarea, Select } from "@/components/ui/Input";
import { Icon } from "@/components/ui/Icon";
import { T } from "@/components/ui/T";
import type { CategoryItem } from "@/types/category";

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

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface CategoryFormModalProps {
  isOpen: boolean;
  editingCategory: CategoryItem | null;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    slug: string;
    icon: string;
    description?: string;
  }) => Promise<void>;
}

export function CategoryFormModal({
  isOpen,
  editingCategory,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugTouched, setIsSlugTouched] = useState(false);
  const [icon, setIcon] = useState("IdCard");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name || "");
      setSlug(editingCategory.slug || "");
      setIcon(editingCategory.icon || "IdCard");
      setDescription(editingCategory.description || "");
      setIsSlugTouched(true);
    } else {
      setName("");
      setSlug("");
      setIcon("IdCard");
      setDescription("");
      setIsSlugTouched(false);
    }
  }, [editingCategory, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugTouched && !editingCategory) {
      setSlug(generateSlug(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalSlug = slug.trim() || generateSlug(name) || `cat-${Date.now()}`;
    await onSubmit({
      name: name.trim(),
      slug: finalSlug,
      icon,
      description: description.trim() || undefined,
    });
  };

  const title = editingCategory
    ? { bn: "ক্যাটাগরি সম্পাদনা", en: "Edit Category" }
    : { bn: "নতুন ক্যাটাগরি যুক্ত করুন", en: "Add New Category" };

  return (
    <Modal open={isOpen} onClose={onClose} title={title.bn}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        <Field
          label="ক্যাটাগরির নাম"
          htmlFor="cat-name"
          required
        >
          <Input
            id="cat-name"
            type="text"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="উদাঃ নাগরিক সনদ ও পরিচয়পত্র"
          />
        </Field>

        <Field
          label="ইউআরএল স্ল্যাগ (Slug)"
          htmlFor="cat-slug"
          hint="ইংরেজি ছোট অক্ষরে ইউআরএল শনাক্তকারী"
        >
          <Input
            id="cat-slug"
            type="text"
            value={slug}
            onChange={(e) => {
              setIsSlugTouched(true);
              setSlug(e.target.value);
            }}
            placeholder="উদাঃ citizen-identity"
          />
        </Field>

        <Field label="আইকন (Icon)" htmlFor="cat-icon">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line bg-slate-50 text-brand-700">
              <Icon name={icon} className="h-6 w-6" />
            </span>
            <Select
              id="cat-icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            >
              {COMMON_ICONS.map((ic) => (
                <option key={ic} value={ic}>
                  {ic}
                </option>
              ))}
            </Select>
          </div>
        </Field>

        <Field label="সংক্ষিপ্ত বিবরণ" htmlFor="cat-desc">
          <Textarea
            id="cat-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="এই ক্যাটাগরির অন্তর্ভুক্ত সেবাসমূহের সংক্ষিপ্ত বিবরণ..."
            rows={3}
          />
        </Field>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-line">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <T bn="বাতিল" en="Cancel" />
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-800 transition disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>
              <T
                bn={isSubmitting ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                en={isSubmitting ? "Saving..." : "Save Category"}
              />
            </span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CategoryFormModal;
