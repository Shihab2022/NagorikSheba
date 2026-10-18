"use client";

import React from "react";
import { Plus, CreditCard, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import type { ServiceFeeItem } from "@/types/service";

export interface FeesTabProps {
  fees: ServiceFeeItem[];
  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<ServiceFeeItem>) => void;
  onRemove: (index: number) => void;
}

export function FeesTab({ fees, onAdd, onUpdate, onRemove }: FeesTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          সরকারি ফি, ভ্যাট বা চার্জের বিবরণ।
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-800 border border-brand-200 hover:bg-brand-100 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>+ নতুন ফি যুক্ত করুন</span>
        </button>
      </div>

      {fees.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-8 text-center text-xs text-slate-400">
          <CreditCard className="mx-auto h-8 w-8 text-slate-300 mb-2" />
          <p>কোনো সরকারি ফি যোগ করা হয়নি (সেবাটি বিনামূল্যে হতে পারে)।</p>
        </div>
      ) : (
        <div className="space-y-3">
          {fees.map((fee, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-line bg-slate-50/50 p-3.5 space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-wide">
                  ফি বিবরণী #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <Input
                    type="text"
                    required
                    value={fee.name}
                    onChange={(e) => onUpdate(idx, { name: e.target.value })}
                    placeholder="ফি এর নাম (উদাঃ নিয়মিত আবেদন ফি)"
                    className="h-10 text-xs"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    step="0.01"
                    value={fee.amount !== undefined && fee.amount !== null ? String(fee.amount) : ""}
                    onChange={(e) =>
                      onUpdate(idx, {
                        amount: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="পরিমাণ"
                    className="h-10 text-xs"
                  />
                  <span className="rounded-lg border border-line bg-white px-2 py-2 text-xs font-mono font-bold text-slate-600">
                    {fee.currency || "BDT"}
                  </span>
                </div>
              </div>

              <Input
                type="text"
                value={fee.description || ""}
                onChange={(e) => onUpdate(idx, { description: e.target.value })}
                placeholder="পরিশোধ পদ্ধতি বা অতিরিক্ত নোট (উদাঃ চালান কোড বা মোবাইল ব্যাংকিং)"
                className="h-9 text-xs"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FeesTab;
