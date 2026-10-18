"use client";

import React from "react";
import { Field, Input, Textarea, Select } from "@/components/ui/Input";
import type { CategoryItem } from "@/types/category";

export interface BasicDetailsTabProps {
  categories: CategoryItem[];
  categoryId: string;
  onCategoryIdChange: (val: string) => void;
  name: string;
  onNameChange: (val: string) => void;
  slug: string;
  onSlugChange: (val: string) => void;
  onSlugTouched: () => void;
  shortDesc: string;
  onShortDescChange: (val: string) => void;
  desc: string;
  onDescChange: (val: string) => void;
  eligibility: string;
  onEligibilityChange: (val: string) => void;
  processingTime: string;
  onProcessingTimeChange: (val: string) => void;
  officialUrl: string;
  onOfficialUrlChange: (val: string) => void;
  verificationStatus: "UNVERIFIED" | "VERIFIED" | "NEEDS_REVIEW";
  onVerificationStatusChange: (val: "UNVERIFIED" | "VERIFIED" | "NEEDS_REVIEW") => void;
  isPublished: boolean;
  onIsPublishedChange: (val: boolean) => void;
  isEditing?: boolean;
}

export function BasicDetailsTab({
  categories,
  categoryId,
  onCategoryIdChange,
  name,
  onNameChange,
  slug,
  onSlugChange,
  onSlugTouched,
  shortDesc,
  onShortDescChange,
  desc,
  onDescChange,
  eligibility,
  onEligibilityChange,
  processingTime,
  onProcessingTimeChange,
  officialUrl,
  onOfficialUrlChange,
  verificationStatus,
  onVerificationStatusChange,
  isPublished,
  onIsPublishedChange,
  isEditing,
}: BasicDetailsTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="ক্যাটাগরি নির্ধারণ" htmlFor="svc-cat" required>
          <Select
            id="svc-cat"
            required
            value={categoryId}
            onChange={(e) => onCategoryIdChange(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="সেবার নাম" htmlFor="svc-name" required>
          <Input
            id="svc-name"
            type="text"
            required
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="উদাঃ জাতীয় পরিচয়পত্র সংশোধন"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="ইউআরএল স্ল্যাগ (Slug)" htmlFor="svc-slug" hint="ইংরেজি ইউআরএল শনাক্তকারী">
          <Input
            id="svc-slug"
            type="text"
            value={slug}
            onChange={(e) => {
              onSlugTouched();
              onSlugChange(e.target.value);
            }}
            placeholder="উদাঃ nid-correction"
          />
        </Field>

        <Field label="প্রক্রিয়াকরণ সময়সীমা" htmlFor="svc-proc">
          <Input
            id="svc-proc"
            type="text"
            value={processingTime}
            onChange={(e) => onProcessingTimeChange(e.target.value)}
            placeholder="উদাঃ ৭-১৫ কার্যদিবস"
          />
        </Field>
      </div>

      <Field label="সংক্ষিপ্ত বিবরণ" htmlFor="svc-short" required>
        <Input
          id="svc-short"
          type="text"
          required
          value={shortDesc}
          onChange={(e) => onShortDescChange(e.target.value)}
          placeholder="এক লাইনে সেবার মূল উদ্দেশ্য লিখুন..."
        />
      </Field>

      <Field label="বিস্তারিত বিবরণ ও উদ্দেশ্য" htmlFor="svc-desc" required>
        <Textarea
          id="svc-desc"
          required
          value={desc}
          onChange={(e) => onDescChange(e.target.value)}
          placeholder="সেবাটি কীভাবে গ্রহণ করতে হবে, নিয়মাবলী ও পটভূমি..."
          rows={3}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="যোগ্যতা" htmlFor="svc-elig">
          <Input
            id="svc-elig"
            type="text"
            value={eligibility}
            onChange={(e) => onEligibilityChange(e.target.value)}
            placeholder="উদাঃ ১৮ বছর বা তদূর্ধ্ব নাগরিক"
          />
        </Field>

        <Field label="অফিসিয়াল পোর্টাল লিংক" htmlFor="svc-url">
          <Input
            id="svc-url"
            type="url"
            value={officialUrl}
            onChange={(e) => onOfficialUrlChange(e.target.value)}
            placeholder="https://..."
          />
        </Field>
      </div>

      {isEditing && (
        <Field label="যাচাইকরণের অবস্থা" htmlFor="edit-verif">
          <Select
            id="edit-verif"
            value={verificationStatus}
            onChange={(e) =>
              onVerificationStatusChange(
                e.target.value as "UNVERIFIED" | "VERIFIED" | "NEEDS_REVIEW"
              )
            }
          >
            <option value="VERIFIED">যাচাইকৃত (Verified)</option>
            <option value="UNVERIFIED">অযাচাইকৃত (Unverified)</option>
            <option value="NEEDS_REVIEW">পুনর্বিবেচনা প্রয়োজন (Needs Review)</option>
          </Select>
        </Field>
      )}

      <div className="rounded-xl border border-line bg-slate-50/70 p-3.5">
        <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => onIsPublishedChange(e.target.checked)}
            className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500"
          />
          <span>পাবলিক সাইটে অবিলম্বে প্রকাশ করুন</span>
        </label>
      </div>
    </div>
  );
}

export default BasicDetailsTab;
