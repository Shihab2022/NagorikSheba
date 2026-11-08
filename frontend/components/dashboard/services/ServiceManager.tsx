"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Layers, Plus } from "lucide-react";
import {
  createService,
  updateService,
  deleteService,
  getSingleService,
} from "@/service/service";
import type {
  ServiceItem,
  ServiceRequirementItem,
  ServiceStepItem,
  ServiceFeeItem,
  ServiceSourceItem,
} from "@/types/service";
import type { CategoryItem } from "@/types/category";
import { DashboardAlert } from "@/components/dashboard/common/DashboardAlert";
import { T } from "@/components/ui/T";
import { ServiceStats } from "./ServiceStats";
import { ServiceFilters } from "./ServiceFilters";
import { ServiceTable } from "./ServiceTable";
import { ServiceFormModal, type TabKey } from "./ServiceFormModal";
import { ServiceDeleteModal } from "./ServiceDeleteModal";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface ServiceManagerProps {
  initialServices: ServiceItem[];
  categories: CategoryItem[];
  initialTotal: number;
}

export function ServiceManager({
  initialServices = [],
  categories = [],
  initialTotal = 0,
}: ServiceManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [totalCount, setTotalCount] = useState<number>(initialTotal);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("categoryId") || "ALL"
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Active Tab in Modal
  const [activeTab, setActiveTab] = useState<TabKey>("basic");

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [deletingService, setDeletingService] = useState<ServiceItem | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Form State: 1. Basic Fields
  const [formCategoryId, setFormCategoryId] = useState(categories[0]?.id || "");
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [isSlugTouched, setIsSlugTouched] = useState(false);
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formEligibility, setFormEligibility] = useState("");
  const [formProcessingTime, setFormProcessingTime] = useState("");
  const [formOfficialUrl, setFormOfficialUrl] = useState("");
  const [formVerificationStatus, setFormVerificationStatus] = useState<
    "UNVERIFIED" | "VERIFIED" | "NEEDS_REVIEW"
  >("VERIFIED");
  const [formIsPublished, setFormIsPublished] = useState(true);

  // Form State: Schemas
  const [formRequirements, setFormRequirements] = useState<ServiceRequirementItem[]>([]);
  const [formSteps, setFormSteps] = useState<ServiceStepItem[]>([]);
  const [formFees, setFormFees] = useState<ServiceFeeItem[]>([]);
  const [formSources, setFormSources] = useState<ServiceSourceItem[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const resetForm = useCallback(() => {
    setActiveTab("basic");
    setFormCategoryId(categories[0]?.id || "");
    setFormName("");
    setFormSlug("");
    setIsSlugTouched(false);
    setFormShortDesc("");
    setFormDesc("");
    setFormEligibility("");
    setFormProcessingTime("");
    setFormOfficialUrl("");
    setFormVerificationStatus("VERIFIED");
    setFormIsPublished(true);
    setFormRequirements([]);
    setFormSteps([]);
    setFormFees([]);
    setFormSources([]);
    setFeedback(null);
  }, [categories]);

  // Auto-open modal if URL has ?action=create
  useEffect(() => {
    if (searchParams.get("action") === "create") {
      const timer = setTimeout(() => {
        resetForm();
        setIsCreateOpen(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams, resetForm]);

  const handleOpenCreate = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!isSlugTouched && !editingService) {
      setFormSlug(generateSlug(val));
    }
  };

  // Requirements handlers
  const addRequirement = () => {
    setFormRequirements((prev) => [
      ...prev,
      {
        name: "",
        isMandatory: true,
        conditionDescription: "",
        description: "",
      },
    ]);
  };

  const updateRequirement = (index: number, patch: Partial<ServiceRequirementItem>) => {
    setFormRequirements((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  };

  const removeRequirement = (index: number) => {
    setFormRequirements((prev) => prev.filter((_, i) => i !== index));
  };

  // Steps handlers
  const addStep = () => {
    setFormSteps((prev) => [
      ...prev,
      {
        stepNumber: prev.length + 1,
        title: "",
        description: "",
        actionType: "READ_GUIDE",
        officialUrl: "",
      },
    ]);
  };

  const updateStep = (index: number, patch: Partial<ServiceStepItem>) => {
    setFormSteps((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  };

  const removeStep = (index: number) => {
    setFormSteps((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((step, idx) => ({ ...step, stepNumber: idx + 1 }))
    );
  };

  // Fees handlers
  const addFee = () => {
    setFormFees((prev) => [
      ...prev,
      {
        name: "",
        amount: 0,
        currency: "BDT",
        description: "",
      },
    ]);
  };

  const updateFee = (index: number, patch: Partial<ServiceFeeItem>) => {
    setFormFees((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  };

  const removeFee = (index: number) => {
    setFormFees((prev) => prev.filter((_, i) => i !== index));
  };

  // Sources handlers
  const addSource = () => {
    setFormSources((prev) => [
      ...prev,
      {
        title: "",
        url: "",
        sourceType: "OFFICIAL_PORTAL",
      },
    ]);
  };

  const updateSource = (index: number, patch: Partial<ServiceSourceItem>) => {
    setFormSources((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  };

  const removeSource = (index: number) => {
    setFormSources((prev) => prev.filter((_, i) => i !== index));
  };

  // Quick Toggle Publish Status
  const handleTogglePublish = async (svc: ServiceItem) => {
    const nextState = !svc.isPublished;
    setServices((prev) =>
      prev.map((item) => (item.id === svc.id ? { ...item, isPublished: nextState } : item))
    );

    const res = await updateService(svc.id, { isPublished: nextState });
    if (!res.success) {
      setServices((prev) =>
        prev.map((item) => (item.id === svc.id ? { ...item, isPublished: svc.isPublished } : item))
      );
      setFeedback({ type: "error", message: res.message || "Failed to toggle status" });
    } else {
      router.refresh();
    }
  };

  // Submit Full Service Creation
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCategoryId) {
      setActiveTab("basic");
      setFeedback({ type: "error", message: "Please select a category." });
      return;
    }
    if (!formName.trim() || !formShortDesc.trim() || !formDesc.trim()) {
      setActiveTab("basic");
      setFeedback({
        type: "error",
        message: "Name, short description, and full description are required.",
      });
      return;
    }
    const slug = formSlug.trim() || generateSlug(formName) || `svc-${Date.now()}`;

    const validRequirements = formRequirements.filter((r) => r.name.trim());
    const validSteps = formSteps.filter((s) => s.title.trim() && s.description.trim());
    const validFees = formFees.filter((f) => f.name.trim());
    const validSources = formSources.filter((s) => s.title.trim() && s.url.trim());

    setIsSubmitting(true);
    setFeedback(null);

    const res = await createService({
      categoryId: formCategoryId,
      name: formName.trim(),
      slug,
      shortDescription: formShortDesc.trim(),
      description: formDesc.trim(),
      eligibility: formEligibility.trim() || undefined,
      processingTime: formProcessingTime.trim() || undefined,
      officialUrl: formOfficialUrl.trim() || undefined,
      isPublished: formIsPublished,
      requirements: validRequirements,
      steps: validSteps,
      fees: validFees,
      sources: validSources,
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      const cat = categories.find((c) => c.id === formCategoryId);
      const newService: ServiceItem = {
        ...res.data,
        category_name: cat?.name,
        category_slug: cat?.slug,
        requirementCount: validRequirements.length,
        stepCount: validSteps.length,
        feeCount: validFees.length,
        sourceCount: validSources.length,
      };

      setServices((prev) => [newService, ...prev]);
      setTotalCount((prev) => prev + 1);
      setIsCreateOpen(false);
      resetForm();
      setFeedback({
        type: "success",
        message: "সেবা ও এর সকল উপাদান সফলভাবে তৈরি হয়েছে",
      });
      router.refresh();
    } else {
      setFeedback({ type: "error", message: res.message || "Failed to create service" });
    }
  };

  // Open Edit Dialog
  const handleOpenEdit = async (svc: ServiceItem) => {
    setEditingService(svc);
    setActiveTab("basic");
    setFeedback(null);

    setFormCategoryId(svc.categoryId || categories[0]?.id || "");
    setFormName(svc.name || "");
    setFormSlug(svc.slug || "");
    setIsSlugTouched(true);
    setFormShortDesc(svc.shortDescription || "");
    setFormDesc(svc.description || "");
    setFormEligibility(svc.eligibility || "");
    setFormProcessingTime(svc.processingTime || "");
    setFormOfficialUrl(svc.officialUrl || "");
    setFormVerificationStatus(svc.verificationStatus || "VERIFIED");
    setFormIsPublished(svc.isPublished ?? true);

    setFormRequirements([]);
    setFormSteps([]);
    setFormFees([]);
    setFormSources([]);

    setIsLoadingDetails(true);
    try {
      const detailRes = await getSingleService(svc.id);
      if (detailRes.success && detailRes.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const d = detailRes.data as any;
        if (d.serviceRequirement || d.requirements) {
          setFormRequirements(d.serviceRequirement || d.requirements);
        }
        if (d.serviceStep || d.steps) {
          setFormSteps(d.serviceStep || d.steps);
        }
        if (d.serviceFee || d.fees) {
          setFormFees(d.serviceFee || d.fees);
        }
        if (d.serviceSource || d.sources) {
          setFormSources(d.serviceSource || d.sources);
        }
      }
    } catch {
      // Keep empty arrays
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Submit Edit Service
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    if (!formName.trim() || !formShortDesc.trim() || !formDesc.trim()) {
      setActiveTab("basic");
      setFeedback({
        type: "error",
        message: "Name, short description, and full description are required.",
      });
      return;
    }

    const validRequirements = formRequirements.filter((r) => r.name.trim());
    const validSteps = formSteps.filter((s) => s.title.trim() && s.description.trim());
    const validFees = formFees.filter((f) => f.name.trim());
    const validSources = formSources.filter((s) => s.title.trim() && s.url.trim());

    setIsSubmitting(true);
    setFeedback(null);

    const res = await updateService(editingService.id, {
      categoryId: formCategoryId,
      name: formName.trim(),
      slug: formSlug.trim() || editingService.slug,
      shortDescription: formShortDesc.trim(),
      description: formDesc.trim(),
      eligibility: formEligibility.trim() || undefined,
      processingTime: formProcessingTime.trim() || undefined,
      officialUrl: formOfficialUrl.trim() || undefined,
      verificationStatus: formVerificationStatus,
      isPublished: formIsPublished,
      requirements: validRequirements,
      steps: validSteps,
      fees: validFees,
      sources: validSources,
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      const cat = categories.find((c) => c.id === formCategoryId);
      const updatedItem: ServiceItem = {
        ...res.data,
        category_name: cat?.name || editingService.category_name,
        category_slug: cat?.slug || editingService.category_slug,
        requirementCount: validRequirements.length,
        stepCount: validSteps.length,
        feeCount: validFees.length,
        sourceCount: validSources.length,
      };

      setServices((prev) =>
        prev.map((item) => (item.id === editingService.id ? updatedItem : item))
      );
      setEditingService(null);
      resetForm();
      setFeedback({
        type: "success",
        message: "সেবা ও এর সকল উপাদান সফলভাবে আপডেট হয়েছে",
      });
      router.refresh();
    } else {
      setFeedback({ type: "error", message: res.message || "Failed to update service" });
    }
  };

  // Submit Delete
  const handleDeleteSubmit = async () => {
    if (!deletingService) return;
    setIsSubmitting(true);

    const res = await deleteService(deletingService.id);
    setIsSubmitting(false);

    if (res.success) {
      setServices((prev) => prev.filter((item) => item.id !== deletingService.id));
      setTotalCount((prev) => Math.max(0, prev - 1));
      setDeletingService(null);
      setFeedback({ type: "success", message: "সেবা সফলভাবে মুছে ফেলা হয়েছে" });
      router.refresh();
    } else {
      setFeedback({ type: "error", message: res.message || "Failed to delete service" });
    }
  };

  // Filters
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      if (selectedCategory !== "ALL" && s.categoryId !== selectedCategory) {
        return false;
      }
      if (selectedStatus === "PUBLISHED" && !s.isPublished) return false;
      if (selectedStatus === "DRAFT" && s.isPublished) return false;

      const q = search.trim().toLowerCase();
      if (!q) return true;

      return (
        s.name.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        (s.shortDescription && s.shortDescription.toLowerCase().includes(q)) ||
        (s.category_name && s.category_name.toLowerCase().includes(q))
      );
    });
  }, [services, search, selectedCategory, selectedStatus]);

  const publishedCount = useMemo(() => {
    return services.filter((s) => s.isPublished).length;
  }, [services]);

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
      {feedback && (
        <DashboardAlert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      {/* Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-line bg-white p-6 shadow-card">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200">
            <Layers className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-black text-slate-900">
              <T bn="সেবা ব্যবস্থাপনা" en="Services Management" />
            </h1>
            <p className="text-xs text-slate-500">
              <T
                bn="নাগরিক সেবাসমূহের পূর্ণাঙ্গ তথ্য, ধাপ, ফি ও প্রয়োজনীয় কাগজপত্র নিয়ন্ত্রণ করুন।"
                en="Manage complete citizen services: requirements, steps, fees, and official sources."
              />
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-brand-800 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>
            <T
              bn="নতুন সেবা যুক্ত করুন (পূর্ণাঙ্গ স্কিমা)"
              en="Add Service (Full Schema)"
            />
          </span>
        </button>
      </div>

      {/* Stats Summary Cards */}
      <ServiceStats
        totalCount={totalCount || services.length}
        publishedCount={publishedCount}
        draftCount={services.length - publishedCount}
      />

      {/* Search & Filter Toolbar + Table Container */}
      <div className="rounded-2xl border border-line bg-white shadow-card overflow-hidden">
        <ServiceFilters
          search={search}
          onSearchChange={setSearch}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          categories={categories}
        />

        <ServiceTable
          services={filteredServices}
          categories={categories}
          search={search}
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          onEdit={handleOpenEdit}
          onDelete={(svc) => setDeletingService(svc)}
          onTogglePublish={handleTogglePublish}
          onCreateOpen={handleOpenCreate}
        />
      </div>

      {/* Create Modal */}
      <ServiceFormModal
        isOpen={isCreateOpen}
        isEditing={false}
        isLoadingDetails={false}
        isSubmitting={isSubmitting}
        errorMessage={feedback?.type === "error" ? feedback.message : null}
        categories={categories}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formCategoryId={formCategoryId}
        setFormCategoryId={setFormCategoryId}
        formName={formName}
        setFormName={handleNameChange}
        formSlug={formSlug}
        setFormSlug={setFormSlug}
        onSlugTouched={() => setIsSlugTouched(true)}
        formShortDesc={formShortDesc}
        setFormShortDesc={setFormShortDesc}
        formDesc={formDesc}
        setFormDesc={setFormDesc}
        formEligibility={formEligibility}
        setFormEligibility={setFormEligibility}
        formProcessingTime={formProcessingTime}
        setFormProcessingTime={setFormProcessingTime}
        formOfficialUrl={formOfficialUrl}
        setFormOfficialUrl={setFormOfficialUrl}
        formVerificationStatus={formVerificationStatus}
        setFormVerificationStatus={setFormVerificationStatus}
        formIsPublished={formIsPublished}
        setFormIsPublished={setFormIsPublished}
        formRequirements={formRequirements}
        addRequirement={addRequirement}
        updateRequirement={updateRequirement}
        removeRequirement={removeRequirement}
        formSteps={formSteps}
        addStep={addStep}
        updateStep={updateStep}
        removeStep={removeStep}
        formFees={formFees}
        addFee={addFee}
        updateFee={updateFee}
        removeFee={removeFee}
        formSources={formSources}
        addSource={addSource}
        updateSource={updateSource}
        removeSource={removeSource}
      />

      {/* Edit Modal */}
      <ServiceFormModal
        isOpen={!!editingService}
        isEditing={true}
        isLoadingDetails={isLoadingDetails}
        isSubmitting={isSubmitting}
        errorMessage={feedback?.type === "error" ? feedback.message : null}
        categories={categories}
        onClose={() => setEditingService(null)}
        onSubmit={handleEditSubmit}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formCategoryId={formCategoryId}
        setFormCategoryId={setFormCategoryId}
        formName={formName}
        setFormName={setFormName}
        formSlug={formSlug}
        setFormSlug={setFormSlug}
        onSlugTouched={() => setIsSlugTouched(true)}
        formShortDesc={formShortDesc}
        setFormShortDesc={setFormShortDesc}
        formDesc={formDesc}
        setFormDesc={setFormDesc}
        formEligibility={formEligibility}
        setFormEligibility={setFormEligibility}
        formProcessingTime={formProcessingTime}
        setFormProcessingTime={setFormProcessingTime}
        formOfficialUrl={formOfficialUrl}
        setFormOfficialUrl={setFormOfficialUrl}
        formVerificationStatus={formVerificationStatus}
        setFormVerificationStatus={setFormVerificationStatus}
        formIsPublished={formIsPublished}
        setFormIsPublished={setFormIsPublished}
        formRequirements={formRequirements}
        addRequirement={addRequirement}
        updateRequirement={updateRequirement}
        removeRequirement={removeRequirement}
        formSteps={formSteps}
        addStep={addStep}
        updateStep={updateStep}
        removeStep={removeStep}
        formFees={formFees}
        addFee={addFee}
        updateFee={updateFee}
        removeFee={removeFee}
        formSources={formSources}
        addSource={addSource}
        updateSource={updateSource}
        removeSource={removeSource}
      />

      {/* Delete Confirmation Modal */}
      <ServiceDeleteModal
        service={deletingService}
        isOpen={!!deletingService}
        isSubmitting={isSubmitting}
        onClose={() => setDeletingService(null)}
        onConfirm={handleDeleteSubmit}
      />
    </div>
  );
}

export default ServiceManager;
