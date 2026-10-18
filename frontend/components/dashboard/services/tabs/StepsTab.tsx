"use client";

import React from "react";
import { Plus, ListOrdered, X } from "lucide-react";
import { Input, Textarea, Select } from "@/components/ui/Input";
import type { ServiceStepItem } from "@/types/service";

export interface StepsTabProps {
  steps: ServiceStepItem[];
  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<ServiceStepItem>) => void;
  onRemove: (index: number) => void;
}

export function StepsTab({ steps, onAdd, onUpdate, onRemove }: StepsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          সেবাটি পাওয়ার ধাপে ধাপে নির্দেশনাবলী (Workflow)।
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-800 border border-brand-200 hover:bg-brand-100 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>+ পরবর্তী ধাপ যুক্ত করুন</span>
        </button>
      </div>

      {steps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-8 text-center text-xs text-slate-400">
          <ListOrdered className="mx-auto h-8 w-8 text-slate-300 mb-2" />
          <p>এখনও কোনো ধাপ যুক্ত করা হয়নি।</p>
        </div>
      ) : (
        <div className="space-y-3">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-line bg-slate-50/50 p-3.5 space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-wide">
                  ধাপ #{step.stepNumber || idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  type="text"
                  required
                  value={step.title}
                  onChange={(e) => onUpdate(idx, { title: e.target.value })}
                  placeholder="ধাপের শিরোনাম (উদাঃ অনলাইন পোর্টালে নিবন্ধন)"
                  className="h-10 text-xs"
                />
                <Select
                  value={step.actionType || "READ_GUIDE"}
                  onChange={(e) =>
                    onUpdate(idx, {
                      actionType: e.target.value as ServiceStepItem["actionType"],
                    })
                  }
                  className="h-10 text-xs"
                >
                  <option value="VISIT_OFFICIAL_PORTAL">অফিসিয়াল পোর্টালে যান (Visit Portal)</option>
                  <option value="READ_GUIDE">গাইড পড়ুন (Read Guide)</option>
                  <option value="VISIT_OFFICE">অফিসে উপস্থিত হোন (Visit Office)</option>
                  <option value="PREPARE_DOCUMENTS">কাগজপত্র প্রস্তুত করুন (Prepare Documents)</option>
                  <option value="OTHER">অন্যান্য (Other)</option>
                </Select>
              </div>

              <Textarea
                required
                value={step.description}
                onChange={(e) => onUpdate(idx, { description: e.target.value })}
                placeholder="এই ধাপে নাগরিককে কী করতে হবে তার বিস্তারিত নির্দেশনা..."
                rows={2}
                className="text-xs"
              />

              <Input
                type="url"
                value={step.officialUrl || ""}
                onChange={(e) => onUpdate(idx, { officialUrl: e.target.value })}
                placeholder="নির্দিষ্ট ধাপের ওয়েবলিংক (উদাঃ https://...)"
                className="h-9 text-xs"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StepsTab;
