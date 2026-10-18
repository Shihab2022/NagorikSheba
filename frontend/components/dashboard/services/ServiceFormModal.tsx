"use client";

import React, { useState } from "react";
import {
  FileText,
  Info,
  ListOrdered,
  CreditCard,
  Link2,
  Loader2,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { T } from "@/components/ui/T";
import { BasicDetailsTab } from "./tabs/BasicDetailsTab";
import { RequirementsTab } from "./tabs/RequirementsTab";
import { StepsTab } from "./tabs/StepsTab";
import { FeesTab } from "./tabs/FeesTab";
import { SourcesTab } from "./tabs/SourcesTab";
import type { CategoryItem } from "@/types/category";
import type {
  ServiceRequirementItem,
  ServiceStepItem,
  ServiceFeeItem,
  ServiceSourceItem,
} from "@/types/service";

export type TabKey = "basic" | "requirements" | "steps" | "fees" | "sources";

export interface ServiceFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  isLoadingDetails: boolean;
  isSubmitting: boolean;
  errorMessage?: string | null;
  categories: CategoryItem[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  // Form State
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  // Basic Fields
  formCategoryId: string;
  setFormCategoryId: (val: string) => void;
  formName: string;
  setFormName: (val: string) => void;
  formSlug: string;
  setFormSlug: (val: string) => void;
  onSlugTouched: () => void;
  formShortDesc: string;
  setFormShortDesc: (val: string) => void;
  formDesc: string;
  setFormDesc: (val: string) => void;
  formEligibility: string;
  setFormEligibility: (val: string) => void;
  formProcessingTime: string;
  setFormProcessingTime: (val: string) => void;
  formOfficialUrl: string;
  setFormOfficialUrl: (val: string) => void;
  formVerificationStatus: "UNVERIFIED" | "VERIFIED" | "NEEDS_REVIEW";
  setFormVerificationStatus: (
    val: "UNVERIFIED" | "VERIFIED" | "NEEDS_REVIEW",
  ) => void;
  formIsPublished: boolean;
  setFormIsPublished: (val: boolean) => void;
  // Schemas
  formRequirements: ServiceRequirementItem[];
  addRequirement: () => void;
  updateRequirement: (
    index: number,
    patch: Partial<ServiceRequirementItem>,
  ) => void;
  removeRequirement: (index: number) => void;
  formSteps: ServiceStepItem[];
  addStep: () => void;
  updateStep: (index: number, patch: Partial<ServiceStepItem>) => void;
  removeStep: (index: number) => void;
  formFees: ServiceFeeItem[];
  addFee: () => void;
  updateFee: (index: number, patch: Partial<ServiceFeeItem>) => void;
  removeFee: (index: number) => void;
  formSources: ServiceSourceItem[];
  addSource: () => void;
  updateSource: (index: number, patch: Partial<ServiceSourceItem>) => void;
  removeSource: (index: number) => void;
}

export function ServiceFormModal({
  isOpen,
  isEditing,
  isLoadingDetails,
  isSubmitting,
  errorMessage,
  categories,
  onClose,
  onSubmit,
  activeTab,
  setActiveTab,
  formCategoryId,
  setFormCategoryId,
  formName,
  setFormName,
  formSlug,
  setFormSlug,
  onSlugTouched,
  formShortDesc,
  setFormShortDesc,
  formDesc,
  setFormDesc,
  formEligibility,
  setFormEligibility,
  formProcessingTime,
  setFormProcessingTime,
  formOfficialUrl,
  setFormOfficialUrl,
  formVerificationStatus,
  setFormVerificationStatus,
  formIsPublished,
  setFormIsPublished,
  formRequirements,
  addRequirement,
  updateRequirement,
  removeRequirement,
  formSteps,
  addStep,
  updateStep,
  removeStep,
  formFees,
  addFee,
  updateFee,
  removeFee,
  formSources,
  addSource,
  updateSource,
  removeSource,
}: ServiceFormModalProps) {
  const modalTitle = isEditing
    ? "সেবা সম্পাদনা ও পূর্ণাঙ্গ স্কিমা"
    : "নতুন সেবা যুক্ত করুন (পূর্ণাঙ্গ স্কিমা)";

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={modalTitle}
      className="sm:max-w-2xl max-h-[90vh]"
    >
      {isLoadingDetails ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600 mb-2" />
          <p className="text-xs font-bold">সম্পূর্ণ স্কিমা লোড হচ্ছে...</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Tab Navigation Header */}
          <div className="flex items-center gap-1.5 border-b border-line pb-3 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer",
                activeTab === "basic"
                  ? "bg-brand-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              <Info className="h-3.5 w-3.5" />
              <span>প্রাথমিক তথ্য</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("requirements")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer",
                activeTab === "requirements"
                  ? "bg-brand-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>প্রয়োজনীয় কাগজপত্র</span>
              {formRequirements.length > 0 && (
                <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-mono">
                  {formRequirements.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("steps")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer",
                activeTab === "steps"
                  ? "bg-brand-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              <ListOrdered className="h-3.5 w-3.5" />
              <span>আবেদন ধাপ</span>
              {formSteps.length > 0 && (
                <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-mono">
                  {formSteps.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("fees")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer",
                activeTab === "fees"
                  ? "bg-brand-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>ফি ও চার্জ</span>
              {formFees.length > 0 && (
                <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-mono">
                  {formFees.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("sources")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer",
                activeTab === "sources"
                  ? "bg-brand-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              <Link2 className="h-3.5 w-3.5" />
              <span>তথ্যসূত্র ও গেজেট</span>
              {formSources.length > 0 && (
                <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-mono">
                  {formSources.length}
                </span>
              )}
            </button>
          </div>

          {/* Tab Content Panes */}
          {activeTab === "basic" && (
            <BasicDetailsTab
              categories={categories}
              categoryId={formCategoryId}
              onCategoryIdChange={setFormCategoryId}
              name={formName}
              onNameChange={setFormName}
              slug={formSlug}
              onSlugChange={setFormSlug}
              onSlugTouched={onSlugTouched}
              shortDesc={formShortDesc}
              onShortDescChange={setFormShortDesc}
              desc={formDesc}
              onDescChange={setFormDesc}
              eligibility={formEligibility}
              onEligibilityChange={setFormEligibility}
              processingTime={formProcessingTime}
              onProcessingTimeChange={setFormProcessingTime}
              officialUrl={formOfficialUrl}
              onOfficialUrlChange={setFormOfficialUrl}
              verificationStatus={formVerificationStatus}
              onVerificationStatusChange={setFormVerificationStatus}
              isPublished={formIsPublished}
              onIsPublishedChange={setFormIsPublished}
              isEditing={isEditing}
            />
          )}

          {activeTab === "requirements" && (
            <RequirementsTab
              requirements={formRequirements}
              onAdd={addRequirement}
              onUpdate={updateRequirement}
              onRemove={removeRequirement}
            />
          )}

          {activeTab === "steps" && (
            <StepsTab
              steps={formSteps}
              onAdd={addStep}
              onUpdate={updateStep}
              onRemove={removeStep}
            />
          )}

          {activeTab === "fees" && (
            <FeesTab
              fees={formFees}
              onAdd={addFee}
              onUpdate={updateFee}
              onRemove={removeFee}
            />
          )}

          {activeTab === "sources" && (
            <SourcesTab
              sources={formSources}
              onAdd={addSource}
              onUpdate={updateSource}
              onRemove={removeSource}
            />
          )}

          {/* Form Actions Footer */}
          <div className="mt-6 flex items-center justify-between gap-3 pt-3 border-t border-line">
            <div className="text-[11px] text-slate-400">
              {formRequirements.length} Req • {formSteps.length} Steps •{" "}
              {formFees.length} Fees
            </div>
            <div className="flex items-center gap-3">
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
                {isSubmitting && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                <span>
                  <T
                    bn={isSubmitting ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                    en={isSubmitting ? "Saving..." : "Save Full Service"}
                  />
                </span>
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}

export default ServiceFormModal;
