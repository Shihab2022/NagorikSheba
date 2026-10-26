"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { T } from "@/components/ui/T";
import type { CategoryItem } from "@/types/category";

export interface CategoryDeleteModalProps {
  category: CategoryItem | null;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CategoryDeleteModal({
  category,
  isOpen,
  isSubmitting,
  onClose,
  onConfirm,
}: CategoryDeleteModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose} title="ক্যাটাগরি মুছে ফেলুন">
      <div className="space-y-4">
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-red-900">
                <T
                  bn="আপনি কি নিশ্চিত যে এই ক্যাটাগরি মুছে ফেলতে চান?"
                  en="Are you sure you want to delete this category?"
                />
              </p>
              <p className="mt-1 text-xs text-red-700">
                <T
                  bn="এটি মুছে ফেললে সক্রিয় তালিকা থেকে লুকানো হবে।"
                  en="This category will be marked as deleted and hidden from public view."
                />
              </p>
              {category && (
                <p className="mt-2 text-xs font-bold text-slate-800">
                  &ldquo;{category.name}&rdquo; ({category.slug})
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <T bn="বাতিল" en="Cancel" />
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>
              <T
                bn={isSubmitting ? "মুছে ফেলা হচ্ছে..." : "মুছে ফেলুন"}
                en={isSubmitting ? "Deleting..." : "Delete"}
              />
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default CategoryDeleteModal;
