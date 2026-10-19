/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { T } from "@/components/ui/T";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  updateTrackedService,
  updateTrackedStep,
} from "@/service/tracked-service";
import type { TrackedServiceItem } from "@/types/tracked-service";

const TRACKED_STATUS: { value: string; bn: string; en: string }[] = [
  { value: "PREPARING", bn: "প্রস্তুত", en: "Preparing" },
  { value: "READY_TO_APPLY", bn: "আবেদন করতে প্রস্তুত", en: "Ready to Apply" },
  { value: "SUBMITTED_BY_USER", bn: "জমা দেওয়া হয়েছে", en: "Submitted" },
  { value: "FOLLOW_UP_REQUIRED", bn: "ফলো-আপ প্রয়োজন", en: "Follow-up Required" },
  { value: "COMPLETED_BY_USER", bn: "সম্পন্ন", en: "Completed" },
  { value: "CANCELLED", bn: "বাতিল", en: "Cancelled" },
];

const STEP_STATUS: { value: string; bn: string; en: string }[] = [
  { value: "NOT_STARTED", bn: "শুরু হয়নি", en: "Not Started" },
  { value: "IN_PROGRESS", bn: "চলছে", en: "In Progress" },
  { value: "COMPLETED", bn: "সম্পন্ন", en: "Completed" },
  { value: "NOT_APPLICABLE", bn: "প্রযোজ্য নয়", en: "Not Applicable" },
];

const TONE: Record<string, "green" | "red" | "slate" | "amber"> = {
  PREPARING: "slate",
  READY_TO_APPLY: "amber",
  SUBMITTED_BY_USER: "slate",
  FOLLOW_UP_REQUIRED: "amber",
  COMPLETED_BY_USER: "green",
  CANCELLED: "red",
  NOT_STARTED: "slate",
  IN_PROGRESS: "amber",
  COMPLETED: "green",
  NOT_APPLICABLE: "slate",
};

export function TrackedServiceDetail({
  trackedService,
  steps,
}: {
  trackedService: TrackedServiceItem;
  steps: any[];
}) {
  const { t } = useTranslation();
  const [saving, setSaving] = useState<string | null>(null);

  const pick = (arr: { value: string; bn: string; en: string }[], v: string) =>
    t(arr.find((x) => x.value === v) || { bn: v, en: v });

  const handleServiceStatus = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as any;
    setSaving(trackedService.id);
    const res = await updateTrackedService(trackedService.id, { status });
    if (!res.success) alert(res.message || "Failed to update status");
    setSaving(null);
  };

  const handleStepStatus = async (step: any, e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as any;
    setSaving(step.id);
    const res = await updateTrackedStep(trackedService.id, step.serviceStepId, {
      status,
      note: undefined,
    });
    if (!res.success) alert(res.message || "Failed to update step");
    setSaving(null);
  };

  return (
    <div className="space-y-8">
      <Card>
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-slate-900">
                {trackedService.service_name || trackedService.title || "Untitled service"}
              </h2>
              {trackedService.referenceNumber && (
                <p className="mt-0.5 text-xs font-mono text-slate-500">
                  {trackedService.referenceNumber}
                </p>
              )}
              <p className="mt-1 text-xs text-slate-500">
                {trackedService.service_department || "Government service"}
              </p>
            </div>
            <Badge tone={(TONE[trackedService.status] ?? "slate") as any} className="whitespace-nowrap shrink-0">
              {pick(TRACKED_STATUS, trackedService.status)}
            </Badge>
          </div>
          <div className="pt-4 border-t border-line">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <T bn="অবস্থা পরিবর্তন করুন" en="Change status" />
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-3">
              <select
                value={trackedService.status}
                onChange={handleServiceStatus}
                disabled={saving === trackedService.id}
                className="rounded-xl border border-line bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-100 outline-none"
              >
                {TRACKED_STATUS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {t({ bn: s.bn, en: s.en })}
                  </option>
                ))}
              </select>
              {saving === trackedService.id ? (
                <span className="text-xs text-brand-600 font-medium">
                  <T bn="আপডেট হচ্ছে…" en="Updating…" />
                </span>
              ) : null}
            </form>
          </div>
        </div>
      </Card>
      <Card>
        <div className="p-5 sm:p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            <T bn="ধাপসমূহ" en="Steps" />
          </h3>
          {steps.length === 0 ? (
            <p className="text-sm text-slate-500">
              <T bn="কোনো ধাপ সংযোজিত হয়নি।" en="No steps added yet." />
            </p>
          ) : (
            <div className="space-y-3">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-line bg-white"
                >
                  <span className="flex-shrink-0 w-6 text-xs font-bold text-slate-400">
                    {step.stepNumber}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{step.step_title || "Untitled step"}</p>
                    {step.note && (
                      <p className="mt-0.5 text-xs text-slate-500 italic">{step.note}</p>
                    )}
                  </div>
                  <select
                    value={step.status}
                    onChange={(e) => handleStepStatus(step, e)}
                    disabled={saving === step.id}
                    className="flex-shrink-0 rounded-xl border border-line bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-100 outline-none"
                  >
                    {STEP_STATUS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {t({ bn: s.bn, en: s.en })}
                      </option>
                    ))}
                  </select>
                  {saving === step.id ? (
                    <span className="flex-shrink-0 text-[10px] text-brand-600 font-medium">
                      <T bn="…" en="…" />
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default TrackedServiceDetail;

