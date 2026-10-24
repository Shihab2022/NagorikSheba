/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { T } from "@/components/ui/T";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  updateTrackedService,
  updateTrackedStep,
  deleteTrackedService,
} from "@/service/tracked-service";
import type {
  TrackedServiceItem,
  TrackedStepItem,
  TrackedServiceStatus,
  TrackedStepStatus,
} from "@/types/tracked-service";
import {
  ArrowLeft,
  CheckCircle2,
  Clock2,
  ExternalLink,
  FileText,
  Trash2,
  Edit3,
  Save,
  X,
  Loader2,
  Check,
  BookOpen,
} from "lucide-react";

const TRACKED_STATUS: { value: TrackedServiceStatus; bn: string; en: string }[] = [
  { value: "PREPARING", bn: "প্রস্তুতি চলছে", en: "Preparing" },
  { value: "READY_TO_APPLY", bn: "আবেদন করতে প্রস্তুত", en: "Ready to Apply" },
  { value: "SUBMITTED_BY_USER", bn: "জমা দেওয়া হয়েছে", en: "Submitted" },
  { value: "FOLLOW_UP_REQUIRED", bn: "ফলো-আপ প্রয়োজন", en: "Follow-up Required" },
  { value: "COMPLETED_BY_USER", bn: "সম্পন্ন", en: "Completed" },
  { value: "CANCELLED", bn: "বাতিল", en: "Cancelled" },
];

const STEP_STATUS: { value: TrackedStepStatus; bn: string; en: string }[] = [
  { value: "NOT_STARTED", bn: "শুরু হয়নি", en: "Not Started" },
  { value: "IN_PROGRESS", bn: "চলমান", en: "In Progress" },
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
  steps: TrackedStepItem[];
}) {
  const { t } = useTranslation();
  const router = useRouter();

  const [service, setService] = useState<TrackedServiceItem>(trackedService);
  const [stepList, setStepList] = useState<TrackedStepItem[]>(steps);
  const [savingStepId, setSavingStepId] = useState<string | null>(null);
  const [savingService, setSavingService] = useState(false);
  const [editingRef, setEditingRef] = useState(false);
  const [refInput, setRefInput] = useState(trackedService.referenceNumber || "");
  const [savingRef, setSavingRef] = useState(false);
  const [activeNoteStepId, setActiveNoteStepId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const totalSteps = stepList.length;
  const completedSteps = stepList.filter((s) => s.status === "COMPLETED").length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setFeedbackMsg({ text, type });
    window.setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleServiceStatus = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as TrackedServiceStatus;
    const oldStatus = service.status;
    setService((prev) => ({ ...prev, status }));
    setSavingService(true);

    const res = await updateTrackedService(service.id, { status });
    setSavingService(false);

    if (res.success && res.data) {
      setService(res.data);
      showNotification(
        t({
          bn: "আবেদনের অবস্থা সফলভাবে আপডেট হয়েছে",
          en: "Application status updated successfully",
        }),
      );
      router.refresh();
    } else {
      setService((prev) => ({ ...prev, status: oldStatus }));
      showNotification(res.message || "Failed to update status", "error");
    }
  };

  const handleStepStatus = async (
    step: TrackedStepItem,
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newStatus = e.target.value as TrackedStepStatus;
    const oldStatus = step.status;

    // Optimistically update local state
    setStepList((prev) =>
      prev.map((s) =>
        s.serviceStepId === step.serviceStepId ? { ...s, status: newStatus } : s,
      ),
    );
    setSavingStepId(step.serviceStepId);

    const res = await updateTrackedStep(service.id, step.serviceStepId, {
      status: newStatus,
      note: step.note || undefined,
    });
    setSavingStepId(null);

    if (res.success) {
      if (res.data) {
        setStepList((prev) =>
          prev.map((s) =>
            s.serviceStepId === step.serviceStepId ? { ...s, ...res.data } : s,
          ),
        );
      }
      showNotification(
        t({
          bn: `ধাপ ${step.stepNumber ?? ""}: অবস্থা সংরক্ষিত হয়েছে`,
          en: `Step ${step.stepNumber ?? ""}: status updated`,
        }),
      );
      router.refresh();
    } else {
      // Revert optimistic update
      setStepList((prev) =>
        prev.map((s) =>
          s.serviceStepId === step.serviceStepId ? { ...s, status: oldStatus } : s,
        ),
      );
      showNotification(res.message || "Failed to update step", "error");
    }
  };

  const handleSaveReferenceNumber = async () => {
    setSavingRef(true);
    const res = await updateTrackedService(service.id, {
      referenceNumber: refInput.trim() || undefined,
    });
    setSavingRef(false);

    if (res.success && res.data) {
      setService(res.data);
      setEditingRef(false);
      showNotification(
        t({
          bn: "রেফারেন্স নম্বর সংরক্ষিত হয়েছে",
          en: "Reference number saved",
        }),
      );
      router.refresh();
    } else {
      showNotification(res.message || "Failed to save reference number", "error");
    }
  };

  const handleOpenNote = (step: TrackedStepItem) => {
    setActiveNoteStepId(step.serviceStepId);
    setNoteInput(step.note || "");
  };

  const handleSaveNote = async (step: TrackedStepItem) => {
    setSavingNote(true);
    const res = await updateTrackedStep(service.id, step.serviceStepId, {
      status: step.status,
      note: noteInput.trim(),
    });
    setSavingNote(false);

    if (res.success) {
      setStepList((prev) =>
        prev.map((s) =>
          s.serviceStepId === step.serviceStepId
            ? { ...s, note: noteInput.trim() }
            : s,
        ),
      );
      setActiveNoteStepId(null);
      showNotification(
        t({
          bn: "নোট সংরক্ষিত হয়েছে",
          en: "Note saved successfully",
        }),
      );
      router.refresh();
    } else {
      showNotification(res.message || "Failed to save note", "error");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      t({
        bn: "আপনি কি নিশ্চিত যে এই আবেদনটি ট্র্যাকিং তালিকা থেকে মুছে ফেলতে চান?",
        en: "Are you sure you want to remove this service from your tracking list?",
      }),
    );
    if (!confirmed) return;

    setDeleting(true);
    const res = await deleteTrackedService(service.id);
    setDeleting(false);

    if (res.success) {
      router.push("/dashboard/applications");
      router.refresh();
    } else {
      showNotification(res.message || "Failed to remove tracked service", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Feedback */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/applications"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <T bn="আমার আবেদনে ফিরুন" en="Back to applications" />
        </Link>

        {feedbackMsg && (
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
              feedbackMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {feedbackMsg.type === "success" ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : null}
            <span>{feedbackMsg.text}</span>
          </div>
        )}
      </div>

      {/* Main Service Status Card */}
      <Card>
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">
                  {service.service_name || service.title || "Untitled service"}
                </h2>
                <Badge
                  tone={(TONE[service.status] ?? "slate") as any}
                  className="whitespace-nowrap shrink-0"
                >
                  {t(
                    TRACKED_STATUS.find((s) => s.value === service.status) || {
                      bn: service.status,
                      en: service.status,
                    },
                  )}
                </Badge>
              </div>

              {/* Reference Number Row */}
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">
                  <T bn="আবেদন / প্রাপ্তিস্বীকার আইডি:" en="Reference ID:" />
                </span>
                {editingRef ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={refInput}
                      onChange={(e) => setRefInput(e.target.value)}
                      placeholder="e.g. NID-2026-XXXXXX"
                      className="px-2 py-1 text-xs font-mono rounded border border-brand-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                    <button
                      onClick={handleSaveReferenceNumber}
                      disabled={savingRef}
                      className="p-1 rounded bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50"
                      title="Save"
                    >
                      {savingRef ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Save className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingRef(false);
                        setRefInput(service.referenceNumber || "");
                      }}
                      className="p-1 rounded border border-line text-slate-500 hover:bg-slate-100"
                      title="Cancel"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {service.referenceNumber || t({ bn: "যুক্ত করা হয়নি", en: "Not set" })}
                    </span>
                    <button
                      onClick={() => setEditingRef(true)}
                      className="p-1 text-slate-400 hover:text-brand-600"
                      title="Edit reference ID"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <p className="mt-1.5 text-xs text-slate-500">
                {service.service_department ||
                  (service.service_category ? `${service.service_category}` : "Government Service")}
              </p>
            </div>

            {/* Actions: Guide Link & Untrack Button */}
            <div className="shrink-0 flex items-center gap-2 flex-wrap">
              {service.service_slug && (
                <Link
                  href={`/services/${service.service_slug}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-bold text-brand-700 shadow-sm hover:bg-brand-50 transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <T bn="সেবা নির্দেশিকা" en="Service Guide" />
                </Link>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                icon={<Trash2 className="h-3.5 w-3.5" />}
              >
                {deleting ? (
                  <T bn="মুছে ফেলা হচ্ছে…" en="Removing…" />
                ) : (
                  <T bn="ট্র্যাকিং বাতিল করুন" en="Untrack" />
                )}
              </Button>
            </div>
          </div>

          {/* Progress Tracker Bar */}
          <div className="mt-6 pt-5 border-t border-line">
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>
                  <T bn="সার্বিক অগ্রগতি" en="Overall Progress" />: {completedSteps} / {totalSteps}{" "}
                  <T bn="ধাপ সম্পন্ন" en="steps completed" />
                </span>
              </div>
              <span className="font-bold text-brand-700">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Service Overall Status Selector */}
          <div className="mt-5 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                <T bn="সার্বিক অবস্থা" en="Application Status" />:
              </span>
              <select
                value={service.status}
                onChange={handleServiceStatus}
                disabled={savingService}
                aria-label={t({ bn: "সার্বিক অবস্থা নির্বাচন করুন", en: "Select Application Status" })}
                className="rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-100 outline-none shadow-sm cursor-pointer"
              >
                {TRACKED_STATUS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {t({ bn: s.bn, en: s.en })}
                  </option>
                ))}
              </select>
              {savingService && (
                <span className="text-xs text-brand-600 font-medium flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <T bn="আপডেট হচ্ছে…" en="Updating…" />
                </span>
              )}
            </div>

            <div className="text-[11px] text-slate-400">
              <T bn="শেষ আপডেট" en="Last updated" />:{" "}
              {new Date(service.lastUpdatedAt || service.updatedAt || Date.now()).toLocaleString()}
            </div>
          </div>
        </div>
      </Card>

      {/* Service Information Overview Card */}
      {(service.service_short_description ||
        service.service_description ||
        service.service_processing_time ||
        service.service_eligibility ||
        service.service_official_url) && (
        <Card>
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                <T bn="সেবার মূল তথ্য" en="Service Information" />
              </h3>
              {service.service_slug && (
                <Link
                  href={`/services/${service.service_slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
                >
                  <T bn="পূর্ণাঙ্গ নির্দেশিকা পড়ুন →" en="Full guide & requirements →" />
                </Link>
              )}
            </div>

            {(service.service_short_description || service.service_description) && (
              <p className="text-sm text-slate-600 leading-relaxed">
                {service.service_short_description || service.service_description}
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-line/60">
              {service.service_processing_time && (
                <div className="flex items-start gap-2 text-xs">
                  <Clock2 className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-700">
                      <T bn="আনুমানিক সময়:" en="Processing Time:" />
                    </span>{" "}
                    <span className="text-slate-600">{service.service_processing_time}</span>
                  </div>
                </div>
              )}

              {service.service_official_url && (
                <div className="flex items-start gap-2 text-xs">
                  <ExternalLink className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-700">
                      <T bn="অফিসিয়াল ওয়েবসাইট:" en="Official Portal:" />
                    </span>{" "}
                    <a
                      href={service.service_official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:underline break-all font-medium"
                    >
                      {service.service_official_url}
                    </a>
                  </div>
                </div>
              )}

              {service.service_eligibility && (
                <div className="sm:col-span-2 flex items-start gap-2 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-700">
                      <T bn="যোগ্যতা:" en="Eligibility:" />
                    </span>{" "}
                    <span className="text-slate-600">{service.service_eligibility}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Interactive Step-by-Step Tracker */}
      <Card>
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                <T bn="সেবা গ্রহণের ধাপসমূহ" en="Service Action Steps" />
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                <T
                  bn="প্রতিটি ধাপ শেষ করে অবস্থা পরিবর্তন করুন এবং ব্যক্তিগত নোট সংরক্ষণ করুন।"
                  en="Track each step manually as you complete it and keep personal notes."
                />
              </p>
            </div>
          </div>

          {stepList.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-line rounded-xl">
              <p className="text-sm font-semibold text-slate-700">
                <T
                  bn="এই সেবার জন্য কোনো পৃথক ধাপ সংজ্ঞায়িত করা নেই।"
                  en="No individual action steps configured for this service."
                />
              </p>
              <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                <T
                  bn="আপনি উপরের 'সার্বিক অবস্থা' পরিবর্তন করে অগ্রগতি রেকর্ড করতে পারেন অথবা বিস্তারিত তথ্যের জন্য মূল সেবা পাতা দেখুন।"
                  en="You can still update the overall application status above and refer to the full service guide for instructions."
                />
              </p>
              {service.service_slug && (
                <div className="mt-4">
                  <Link
                    href={`/services/${service.service_slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
                  >
                    <T bn="সেবা নির্দেশিকা দেখুন" en="View service guide" />
                    <span>→</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {stepList.map((step) => {
                const isStepCompleted = step.status === "COMPLETED";
                const isStepInProgress = step.status === "IN_PROGRESS";
                const isSavingThis = savingStepId === step.serviceStepId;
                const isEditingThisNote = activeNoteStepId === step.serviceStepId;

                return (
                  <div
                    key={step.serviceStepId || step.id}
                    className={`rounded-2xl border transition-all p-4 ${
                      isStepCompleted
                        ? "border-emerald-200 bg-emerald-50/20"
                        : isStepInProgress
                        ? "border-amber-200 bg-amber-50/20"
                        : "border-line bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      {/* Step Number & Title */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span
                          className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-xl text-xs font-bold transition-colors ${
                            isStepCompleted
                              ? "bg-emerald-600 text-white"
                              : isStepInProgress
                              ? "bg-amber-100 text-amber-800 ring-2 ring-amber-400"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {isStepCompleted ? (
                            <Check className="h-4 w-4 stroke-[3]" />
                          ) : (
                            String(step.stepNumber ?? 1).padStart(2, "0")
                          )}
                        </span>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {step.step_title || "Untitled Step"}
                          </h4>
                          {step.step_description && (
                            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                              {step.step_description}
                            </p>
                          )}

                          {/* Action Portal / Official Link */}
                          {step.officialUrl && (
                            <div className="mt-2">
                              <a
                                href={step.officialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <T bn="অফিসিয়াল লিংকে যান" en="Open official link" />
                              </a>
                            </div>
                          )}

                          {/* Saved User Note */}
                          {step.note && !isEditingThisNote && (
                            <div className="mt-2.5 flex items-start gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                              <FileText className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="font-semibold text-slate-500">
                                  <T bn="আমার নোট:" en="My Note:" />{" "}
                                </span>
                                <span>{step.note}</span>
                              </div>
                              <button
                                onClick={() => handleOpenNote(step)}
                                className="text-slate-400 hover:text-brand-600 text-[11px] font-semibold ml-2 shrink-0"
                              >
                                <T bn="সম্পাদনা" en="Edit" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Selector & Controls */}
                      <div className="flex sm:flex-col items-end gap-2 shrink-0 pt-1">
                        <div className="flex items-center gap-2">
                          <select
                            value={step.status}
                            onChange={(e) => handleStepStatus(step, e)}
                            disabled={isSavingThis}
                            aria-label={t({
                              bn: `ধাপ ${step.stepNumber ?? ""} এর অবস্থা পরিবর্তন করুন`,
                              en: `Change status for step ${step.stepNumber ?? ""}`,
                            })}
                            className={`rounded-xl border px-3 py-1.5 text-xs font-semibold outline-none transition-colors shadow-sm cursor-pointer ${
                              isStepCompleted
                                ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                                : isStepInProgress
                                ? "border-amber-300 bg-amber-50 text-amber-900"
                                : "border-line bg-white text-slate-700 hover:border-slate-400"
                            }`}
                          >
                            {STEP_STATUS.map((s) => (
                              <option key={s.value} value={s.value}>
                                {t({ bn: s.bn, en: s.en })}
                              </option>
                            ))}
                          </select>

                          {isSavingThis && (
                            <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                          )}
                        </div>

                        {/* Add / Edit Note Button */}
                        {!step.note && !isEditingThisNote && (
                          <button
                            onClick={() => handleOpenNote(step)}
                            className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
                          >
                            <FileText className="h-3 w-3" />
                            <T bn="নোট যোগ করুন" en="Add note" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Inline Note Editor */}
                    {isEditingThisNote && (
                      <div className="mt-3 pt-3 border-t border-line/60">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          <T
                            bn="এই ধাপের জন্য আপনার ব্যক্তিগত নোট লিখুন:"
                            en="Add your personal note for this step:"
                          />
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            placeholder={t({
                              bn: "যেমন: ফি জমা দিয়েছি, স্লিপ নম্বর #১২৩৪৫",
                              en: "e.g. Paid fee, receipt slip #12345",
                            })}
                            className="flex-1 rounded-xl border border-line bg-white px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-200"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSaveNote(step)}
                            disabled={savingNote}
                            className="text-xs shrink-0"
                          >
                            {savingNote ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <T bn="সংরক্ষণ" en="Save" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveNoteStepId(null)}
                            className="text-xs shrink-0"
                          >
                            <T bn="বাতিল" en="Cancel" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default TrackedServiceDetail;
