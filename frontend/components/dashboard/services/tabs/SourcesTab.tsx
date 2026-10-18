"use client";

import React from "react";
import { Plus, Link2, X } from "lucide-react";
import { Input, Select } from "@/components/ui/Input";
import type { ServiceSourceItem } from "@/types/service";

export interface SourcesTabProps {
  sources: ServiceSourceItem[];
  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<ServiceSourceItem>) => void;
  onRemove: (index: number) => void;
}

export function SourcesTab({
  sources,
  onAdd,
  onUpdate,
  onRemove,
}: SourcesTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          তথ্য যাচাইকরণের সরকারি উৎস, পরিপত্র ও গেজেট।
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-800 border border-brand-200 hover:bg-brand-100 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>+ নতুন তথ্যসূত্র যুক্ত করুন</span>
        </button>
      </div>

      {sources.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-8 text-center text-xs text-slate-400">
          <Link2 className="mx-auto h-8 w-8 text-slate-300 mb-2" />
          <p>কোনো তথ্যসূত্র যোগ করা হয়নি।</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sources.map((source, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-line bg-slate-50/50 p-3.5 space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-wide">
                  উৎস #{idx + 1}
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
                  value={source.title}
                  onChange={(e) => onUpdate(idx, { title: e.target.value })}
                  placeholder="উৎস বা পরিপত্রের নাম (উদাঃ গেজেট বিজ্ঞপ্তি ২০২৪)"
                  className="h-10 text-xs"
                />
                <Select
                  value={source.sourceType || "OFFICIAL_PORTAL"}
                  onChange={(e) =>
                    onUpdate(idx, {
                      sourceType: e.target.value as ServiceSourceItem["sourceType"],
                    })
                  }
                  className="h-10 text-xs"
                >
                  <option value="OFFICIAL_PORTAL">অফিসিয়াল পোর্টাল (Portal)</option>
                  <option value="OFFICIAL_NOTICE">অফিসিয়াল নোটিশ (Notice)</option>
                  <option value="OFFICIAL_DOCUMENT">সরকারি দলিল / গেজেট (Document)</option>
                  <option value="OTHER">অন্যান্য (Other)</option>
                </Select>
              </div>

              <Input
                type="url"
                required
                value={source.url}
                onChange={(e) => onUpdate(idx, { url: e.target.value })}
                placeholder="ওয়েব লিংক (উদাঃ https://...)"
                className="h-9 text-xs"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SourcesTab;
