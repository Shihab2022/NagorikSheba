"use client";

import React from "react";
import { Plus, FileText, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import type { ServiceRequirementItem } from "@/types/service";

export interface RequirementsTabProps {
  requirements: ServiceRequirementItem[];
  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<ServiceRequirementItem>) => void;
  onRemove: (index: number) => void;
}

export function RequirementsTab({
  requirements,
  onAdd,
  onUpdate,
  onRemove,
}: RequirementsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          নাগরিকদের আবেদন করার জন্য প্রয়োজনীয় সনদ, ডকুমেন্ট ও শর্তাবলী।
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-800 border border-brand-200 hover:bg-brand-100 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>+ নতুন প্রয়োজনীয় কাগজ যুক্ত করুন</span>
        </button>
      </div>

      {requirements.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-8 text-center text-xs text-slate-400">
          <FileText className="mx-auto h-8 w-8 text-slate-300 mb-2" />
          <p>এখনও কোনো প্রয়োজনীয় কাগজপত্র যুক্ত করা হয়নি।</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requirements.map((req, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-line bg-slate-50/50 p-3.5 space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-wide">
                  কাগজপত্র #{idx + 1}
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
                  value={req.name}
                  onChange={(e) => onUpdate(idx, { name: e.target.value })}
                  placeholder="কাগজ বা সনদের নাম (উদাঃ জন্ম সনদ)"
                  className="h-10 text-xs"
                />
                <Input
                  type="text"
                  value={req.conditionDescription || ""}
                  onChange={(e) => onUpdate(idx, { conditionDescription: e.target.value })}
                  placeholder="শর্ত (উদাঃ মূল কপি অথবা সত্যায়িত অনুলিপি)"
                  className="h-10 text-xs"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <Input
                  type="text"
                  value={req.description || ""}
                  onChange={(e) => onUpdate(idx, { description: e.target.value })}
                  placeholder="সংক্ষিপ্ত নির্দেশনা (ঐচ্ছিক)"
                  className="h-9 text-xs flex-1"
                />
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={req.isMandatory !== false}
                    onChange={(e) => onUpdate(idx, { isMandatory: e.target.checked })}
                    className="h-3.5 w-3.5 rounded text-brand-600"
                  />
                  <span>বাধ্যতামূলক (Mandatory)</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RequirementsTab;
