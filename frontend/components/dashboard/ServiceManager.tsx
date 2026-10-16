"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Layers,
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  FolderOpen,
  FileText,
  ListOrdered,
  CreditCard,
  Link2,
  X,
  Info,
} from "lucide-react";
import {
  ServiceItem,
  ServiceRequirementItem,
  ServiceStepItem,
  ServiceFeeItem,
  ServiceSourceItem,
  createService,
  updateService,
  deleteService,
  getSingleService,
} from "@/service/service";
import { CategoryItem } from "@/service/category";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Textarea, Select } from "@/components/ui/Input";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STRINGS = {
  bn: {
    title: "সেবা ব্যবস্থাপনা",
    subtitle: "নাগরিক সেবাসমূহের পূর্ণাঙ্গ তথ্য, ধাপ, ফি ও প্রয়োজনীয় কাগজপত্র নিয়ন্ত্রণ করুন।",
    addService: "নতুন সেবা যুক্ত করুন (পূর্ণাঙ্গ স্কিমা)",
    searchPlaceholder: "সেবার নাম বা সংক্ষিপ্ত বিবরণ দিয়ে খুঁজুন...",
    filterCategory: "সকল ক্যাটাগরি",
    filterStatus: "সকল অবস্থা",
    published: "প্রকাশিত",
    draft: "খসড়া (Draft)",
    totalServices: "মোট সেবা",
    publishedServices: "প্রকাশিত সেবা",
    colName: "সেবার নাম ও ক্যাটাগরি",
    colComponents: "সম্পৃক্ত স্কিমা উপাদান",
    colProcessing: "সময়সীমা",
    colStatus: "যাচাই অবস্থা",
    colPublish: "প্রকাশ",
    colActions: "পদক্ষেপ",
    noData: "কোনো সেবা পাওয়া যায়নি",
    createFirst: "প্রথম সেবা তৈরি করুন",
    needCategoryFirst: "সেবা তৈরি করার আগে অন্তত একটি ক্যাটাগরি তৈরি করতে হবে।",
    goToCategory: "ক্যাটাগরি তৈরি করুন",
    editService: "সেবা সম্পাদনা ও পূর্ণাঙ্গ স্কিমা",
    deleteService: "সেবা মুছে ফেলুন",
    deleteConfirm: "আপনি কি নিশ্চিত যে এই সেবা মুছে ফেলতে চান?",
    deleteWarning: "এটি মুছে ফেললে সেবা ও এর সকল ধাপ, ফি ও প্রয়োজনীয় কাগজের রেকর্ড অপসারিত হবে।",
    cancel: "বাতিল",
    save: "সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    delete: "মুছে ফেলুন",
    deleting: "মুছে ফেলা হচ্ছে...",
    tabBasic: "প্রাথমিক তথ্য",
    tabReqs: "প্রয়োজনীয় কাগজপত্র",
    tabSteps: "আবেদন ধাপ",
    tabFees: "ফি ও চার্জ",
    tabSources: "তথ্যসূত্র ও গেজেট",
    nameLabel: "সেবার নাম",
    namePlaceholder: "উদাঃ জাতীয় পরিচয়পত্র সংশোধন",
    slugLabel: "ইউআরএল স্ল্যাগ (Slug)",
    slugPlaceholder: "উদাঃ nid-correction",
    categoryLabel: "ক্যাটাগরি নির্ধারণ",
    shortDescLabel: "সংক্ষিপ্ত বিবরণ (Short Description)",
    shortDescPlaceholder: "এক লাইনে সেবার মূল উদ্দেশ্য লিখুন...",
    descLabel: "বিস্তারিত বিবরণ ও উদ্দেশ্য (Description)",
    descPlaceholder: "সেবাটি কীভাবে গ্রহণ করতে হবে, নিয়মাবলী ও পটভূমি...",
    eligibilityLabel: "যোগ্যতা (Eligibility)",
    eligibilityPlaceholder: "উদাঃ ১৮ বছর বা তদূর্ধ্ব নাগরিক",
    processingTimeLabel: "প্রক্রিয়াকরণ সময়সীমা (Processing Time)",
    processingTimePlaceholder: "উদাঃ ৭-১৫ কার্যদিবস",
    officialUrlLabel: "অফিসিয়াল পোর্টাল লিংক (Official URL)",
    officialUrlPlaceholder: "https://...",
    verificationLabel: "যাচাইকরণের অবস্থা",
    verified: "যাচাইকৃত (Verified)",
    unverified: "অযাচাইকৃত (Unverified)",
    needsReview: "পুনর্বিবেচনা প্রয়োজন (Needs Review)",
    isPublishedLabel: "পাবলিক সাইটে অবিলম্বে প্রকাশ করুন",
    successCreate: "সেবা ও এর সকল উপাদান সফলভাবে তৈরি হয়েছে",
    successUpdate: "সেবা ও এর সকল উপাদান সফলভাবে আপডেট হয়েছে",
    successDelete: "সেবা সফলভাবে মুছে ফেলা হয়েছে",
    addReqBtn: "+ নতুন প্রয়োজনীয় কাগজ যুক্ত করুন",
    addStepBtn: "+ পরবর্তী ধাপ যুক্ত করুন",
    addFeeBtn: "+ নতুন ফি যুক্ত করুন",
    addSourceBtn: "+ নতুন তথ্যসূত্র যুক্ত করুন",
    noReqs: "এখনও কোনো প্রয়োজনীয় কাগজপত্র যুক্ত করা হয়নি।",
    noSteps: "এখনও কোনো ধাপ যুক্ত করা হয়নি।",
    noFees: "কোনো সরকারি ফি যোগ করা হয়নি (সেবাটি বিনামূল্যে হতে পারে)।",
    noSources: "কোনো তথ্যসূত্র যোগ করা হয়নি।",
  },
  en: {
    title: "Services Management",
    subtitle: "Manage complete citizen services: requirements, steps, fees, and official sources.",
    addService: "Add Service (Full Schema)",
    searchPlaceholder: "Search by service name or description...",
    filterCategory: "All Categories",
    filterStatus: "All Status",
    published: "Published",
    draft: "Draft",
    totalServices: "Total Services",
    publishedServices: "Published",
    colName: "Service & Category",
    colComponents: "Related Schemas",
    colProcessing: "Processing Time",
    colStatus: "Verification",
    colPublish: "Published",
    colActions: "Actions",
    noData: "No services found",
    createFirst: "Create First Service",
    needCategoryFirst: "You need at least one category before creating a service.",
    goToCategory: "Create a Category",
    editService: "Edit Service (Full Schema)",
    deleteService: "Delete Service",
    deleteConfirm: "Are you sure you want to delete this service?",
    deleteWarning: "Deleting will soft-delete this service and its steps, requirements, fees, and sources.",
    cancel: "Cancel",
    save: "Save Full Service",
    saving: "Saving...",
    delete: "Delete",
    deleting: "Deleting...",
    tabBasic: "Basic Details",
    tabReqs: "Requirements",
    tabSteps: "Procedure Steps",
    tabFees: "Fees & Charges",
    tabSources: "Official Sources",
    nameLabel: "Service Name",
    namePlaceholder: "e.g. National ID Card Correction",
    slugLabel: "URL Slug",
    slugPlaceholder: "e.g. nid-correction",
    categoryLabel: "Select Category",
    shortDescLabel: "Short Description",
    shortDescPlaceholder: "A concise summary of the service...",
    descLabel: "Full Description & Purpose",
    descPlaceholder: "Detailed background, instructions and context...",
    eligibilityLabel: "Eligibility",
    eligibilityPlaceholder: "e.g. Bangladeshi citizens aged 18+",
    processingTimeLabel: "Processing Time",
    processingTimePlaceholder: "e.g. 7-15 Working Days",
    officialUrlLabel: "Official Portal URL",
    officialUrlPlaceholder: "https://...",
    verificationLabel: "Verification Status",
    verified: "Verified",
    unverified: "Unverified",
    needsReview: "Needs Review",
    isPublishedLabel: "Publish immediately on public portal",
    successCreate: "Full service with all schemas created successfully",
    successUpdate: "Full service with all schemas updated successfully",
    successDelete: "Service deleted successfully",
    addReqBtn: "+ Add Document / Requirement",
    addStepBtn: "+ Add Next Step",
    addFeeBtn: "+ Add Fee Item",
    addSourceBtn: "+ Add Source",
    noReqs: "No requirements added yet.",
    noSteps: "No steps added yet.",
    noFees: "No fee items added yet (service may be free of charge).",
    noSources: "No official sources added yet.",
  },
};

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type TabKey = "basic" | "requirements" | "steps" | "fees" | "sources";

export function ServiceManager({
  initialServices = [],
  categories = [],
  initialTotal = 0,
}: {
  initialServices: ServiceItem[];
  categories: CategoryItem[];
  initialTotal: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const s = t(STRINGS);

  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [totalCount, setTotalCount] = useState<number>(initialTotal);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("categoryId") || "ALL"
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Active Tab in Modal
  const [activeTab, setActiveTab] = useState<TabKey>("basic");

  // Modal dialog states
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

  // Form State: 2. Requirements (`serviceRequirement`)
  const [formRequirements, setFormRequirements] = useState<ServiceRequirementItem[]>([]);

  // Form State: 3. Steps (`serviceStep`)
  const [formSteps, setFormSteps] = useState<ServiceStepItem[]>([]);

  // Form State: 4. Fees (`serviceFee`)
  const [formFees, setFormFees] = useState<ServiceFeeItem[]>([]);

  // Form State: 5. Sources (`serviceSource`)
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

  const handleOpenEdit = async (svc: ServiceItem) => {
    resetForm();
    setEditingService(svc);
    setFormCategoryId(svc.categoryId);
    setFormName(svc.name);
    setFormSlug(svc.slug);
    setFormShortDesc(svc.shortDescription || "");
    setFormDesc(svc.description || "");
    setFormEligibility(svc.eligibility || "");
    setFormProcessingTime(svc.processingTime || "");
    setFormOfficialUrl(svc.officialUrl || "");
    setFormVerificationStatus(svc.verificationStatus || "UNVERIFIED");
    setFormIsPublished(svc.isPublished);

    // Fetch full details (requirements, steps, fees, sources)
    setIsLoadingDetails(true);
    try {
      const fullRes = await getSingleService(svc.id);
      if (fullRes.success && fullRes.data) {
        const d = fullRes.data;
        setFormRequirements(d.requirements || []);
        setFormSteps(d.steps || []);
        setFormFees(d.fees || []);
        setFormSources(d.sources || []);
      }
    } catch {
      // fallback to existing
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // -------------------------------------------------------------
  // Helpers to add & update dynamic relational items
  // -------------------------------------------------------------
  const addRequirement = () => {
    setFormRequirements((prev) => [
      ...prev,
      {
        name: "",
        description: "",
        isMandatory: true,
        conditionDescription: "",
        sortOrder: prev.length + 1,
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

  const addStep = () => {
    setFormSteps((prev) => [
      ...prev,
      {
        stepNumber: prev.length + 1,
        title: "",
        description: "",
        actionType: "VISIT_OFFICIAL_PORTAL",
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
    setFormSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const addFee = () => {
    setFormFees((prev) => [
      ...prev,
      {
        name: "",
        amount: "",
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

  // -------------------------------------------------------------
  // Quick Toggle Publish Status
  // -------------------------------------------------------------
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

  // -------------------------------------------------------------
  // Submit Full Service Creation
  // -------------------------------------------------------------
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCategoryId) {
      setActiveTab("basic");
      setFeedback({ type: "error", message: "Please select a category." });
      return;
    }
    if (!formName.trim() || !formShortDesc.trim() || !formDesc.trim()) {
      setActiveTab("basic");
      setFeedback({ type: "error", message: "Name, short description, and full description are required." });
      return;
    }
    const slug = formSlug.trim() || generateSlug(formName) || `svc-${Date.now()}`;

    // Clean valid items
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
      setFeedback({ type: "success", message: s.successCreate });
      router.refresh();
    } else {
      setFeedback({ type: "error", message: res.message || "Failed to create service" });
    }
  };

  // -------------------------------------------------------------
  // Submit Full Service Edit
  // -------------------------------------------------------------
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    if (!formCategoryId) {
      setActiveTab("basic");
      setFeedback({ type: "error", message: "Please select a category." });
      return;
    }
    if (!formName.trim() || !formShortDesc.trim() || !formDesc.trim()) {
      setActiveTab("basic");
      setFeedback({ type: "error", message: "Name, short description, and full description are required." });
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
      const updated: ServiceItem = {
        ...res.data,
        category_name: cat?.name,
        category_slug: cat?.slug,
        requirementCount: validRequirements.length,
        stepCount: validSteps.length,
        feeCount: validFees.length,
        sourceCount: validSources.length,
      };

      setServices((prev) =>
        prev.map((item) => (item.id === editingService.id ? { ...item, ...updated } : item))
      );
      setEditingService(null);
      resetForm();
      setFeedback({ type: "success", message: s.successUpdate });
      router.refresh();
    } else {
      setFeedback({ type: "error", message: res.message || "Failed to update service" });
    }
  };

  // -------------------------------------------------------------
  // Delete Service
  // -------------------------------------------------------------
  const handleDeleteSubmit = async () => {
    if (!deletingService) return;
    setIsSubmitting(true);

    const res = await deleteService(deletingService.id);
    setIsSubmitting(false);

    if (res.success) {
      setServices((prev) => prev.filter((item) => item.id !== deletingService.id));
      setTotalCount((prev) => Math.max(0, prev - 1));
      setDeletingService(null);
      setFeedback({ type: "success", message: s.successDelete });
      router.refresh();
    } else {
      setFeedback({ type: "error", message: res.message || "Failed to delete service" });
    }
  };

  // -------------------------------------------------------------
  // Search & Filter
  // -------------------------------------------------------------
  const filteredServices = useMemo(() => {
    const q = search.trim().toLowerCase();
    return services.filter((svc) => {
      const matchesSearch =
        !q ||
        svc.name.toLowerCase().includes(q) ||
        svc.slug.toLowerCase().includes(q) ||
        (svc.shortDescription && svc.shortDescription.toLowerCase().includes(q)) ||
        (svc.category_name && svc.category_name.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === "ALL" || svc.categoryId === selectedCategory;

      const matchesStatus =
        selectedStatus === "ALL" ||
        (selectedStatus === "PUBLISHED" && svc.isPublished) ||
        (selectedStatus === "DRAFT" && !svc.isPublished);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [services, search, selectedCategory, selectedStatus]);

  const publishedCount = useMemo(() => {
    return services.filter((s) => s.isPublished).length;
  }, [services]);

  // -------------------------------------------------------------
  // Modal Tab Bar
  // -------------------------------------------------------------
  const renderTabHeader = () => (
    <div className="flex flex-wrap items-center gap-1.5 border-b border-line pb-3 mb-4">
      <button
        type="button"
        onClick={() => setActiveTab("basic")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer",
          activeTab === "basic"
            ? "bg-brand-900 text-white shadow-xs"
            : "text-slate-600 hover:bg-slate-100"
        )}
      >
        <Info className="h-3.5 w-3.5" />
        <span>{s.tabBasic}</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("requirements")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer",
          activeTab === "requirements"
            ? "bg-brand-900 text-white shadow-xs"
            : "text-slate-600 hover:bg-slate-100"
        )}
      >
        <FileText className="h-3.5 w-3.5" />
        <span>{s.tabReqs}</span>
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
            : "text-slate-600 hover:bg-slate-100"
        )}
      >
        <ListOrdered className="h-3.5 w-3.5" />
        <span>{s.tabSteps}</span>
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
            : "text-slate-600 hover:bg-slate-100"
        )}
      >
        <CreditCard className="h-3.5 w-3.5" />
        <span>{s.tabFees}</span>
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
            : "text-slate-600 hover:bg-slate-100"
        )}
      >
        <Link2 className="h-3.5 w-3.5" />
        <span>{s.tabSources}</span>
        {formSources.length > 0 && (
          <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-mono">
            {formSources.length}
          </span>
        )}
      </button>
    </div>
  );

  // -------------------------------------------------------------
  // Tab 1 Body: Basic Fields
  // -------------------------------------------------------------
  const renderBasicTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={s.categoryLabel} htmlFor="svc-cat" required>
          <Select
            id="svc-cat"
            required
            value={formCategoryId}
            onChange={(e) => setFormCategoryId(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label={s.nameLabel} htmlFor="svc-name" required>
          <Input
            id="svc-name"
            type="text"
            required
            value={formName}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder={s.namePlaceholder}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={s.slugLabel} htmlFor="svc-slug" hint="ইংরেজি ইউআরএল শনাক্তকারী">
          <Input
            id="svc-slug"
            type="text"
            value={formSlug}
            onChange={(e) => {
              setIsSlugTouched(true);
              setFormSlug(e.target.value);
            }}
            placeholder={s.slugPlaceholder}
          />
        </Field>

        <Field label={s.processingTimeLabel} htmlFor="svc-proc">
          <Input
            id="svc-proc"
            type="text"
            value={formProcessingTime}
            onChange={(e) => setFormProcessingTime(e.target.value)}
            placeholder={s.processingTimePlaceholder}
          />
        </Field>
      </div>

      <Field label={s.shortDescLabel} htmlFor="svc-short" required>
        <Input
          id="svc-short"
          type="text"
          required
          value={formShortDesc}
          onChange={(e) => setFormShortDesc(e.target.value)}
          placeholder={s.shortDescPlaceholder}
        />
      </Field>

      <Field label={s.descLabel} htmlFor="svc-desc" required>
        <Textarea
          id="svc-desc"
          required
          value={formDesc}
          onChange={(e) => setFormDesc(e.target.value)}
          placeholder={s.descPlaceholder}
          rows={3}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={s.eligibilityLabel} htmlFor="svc-elig">
          <Input
            id="svc-elig"
            type="text"
            value={formEligibility}
            onChange={(e) => setFormEligibility(e.target.value)}
            placeholder={s.eligibilityPlaceholder}
          />
        </Field>

        <Field label={s.officialUrlLabel} htmlFor="svc-url">
          <Input
            id="svc-url"
            type="url"
            value={formOfficialUrl}
            onChange={(e) => setFormOfficialUrl(e.target.value)}
            placeholder={s.officialUrlPlaceholder}
          />
        </Field>
      </div>

      {editingService && (
        <Field label={s.verificationLabel} htmlFor="edit-verif">
          <Select
            id="edit-verif"
            value={formVerificationStatus}
            onChange={(e) =>
              setFormVerificationStatus(
                e.target.value as "UNVERIFIED" | "VERIFIED" | "NEEDS_REVIEW"
              )
            }
          >
            <option value="VERIFIED">{s.verified}</option>
            <option value="UNVERIFIED">{s.unverified}</option>
            <option value="NEEDS_REVIEW">{s.needsReview}</option>
          </Select>
        </Field>
      )}

      <div className="rounded-xl border border-line bg-slate-50/70 p-3.5">
        <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer">
          <input
            type="checkbox"
            checked={formIsPublished}
            onChange={(e) => setFormIsPublished(e.target.checked)}
            className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500"
          />
          <span>{s.isPublishedLabel}</span>
        </label>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // Tab 2 Body: Requirements (`serviceRequirement`)
  // -------------------------------------------------------------
  const renderRequirementsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          নাগরিকদের আবেদন করার জন্য প্রয়োজনীয় সনদ, ডকুমেন্ট ও শর্তাবলী।
        </p>
        <button
          type="button"
          onClick={addRequirement}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-800 border border-brand-200 hover:bg-brand-100 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{s.addReqBtn}</span>
        </button>
      </div>

      {formRequirements.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-8 text-center text-xs text-slate-400">
          <FileText className="mx-auto h-8 w-8 text-slate-300 mb-2" />
          <p>{s.noReqs}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {formRequirements.map((req, idx) => (
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
                  onClick={() => removeRequirement(idx)}
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
                  onChange={(e) => updateRequirement(idx, { name: e.target.value })}
                  placeholder="কাগজ বা সনদের নাম (উদাঃ জন্ম সনদ)"
                  className="h-10 text-xs"
                />
                <Input
                  type="text"
                  value={req.conditionDescription || ""}
                  onChange={(e) => updateRequirement(idx, { conditionDescription: e.target.value })}
                  placeholder="শর্ত (উদাঃ মূল কপি অথবা সত্যায়িত অনুলিপি)"
                  className="h-10 text-xs"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <Input
                  type="text"
                  value={req.description || ""}
                  onChange={(e) => updateRequirement(idx, { description: e.target.value })}
                  placeholder="সংক্ষিপ্ত নির্দেশনা (ঐচ্ছিক)"
                  className="h-9 text-xs flex-1"
                />
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={req.isMandatory !== false}
                    onChange={(e) => updateRequirement(idx, { isMandatory: e.target.checked })}
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

  // -------------------------------------------------------------
  // Tab 3 Body: Procedure Steps (`serviceStep`)
  // -------------------------------------------------------------
  const renderStepsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          সেবাটি পাওয়ার ধাপে ধাপে নির্দেশনাবলী (Workflow)।
        </p>
        <button
          type="button"
          onClick={addStep}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-800 border border-brand-200 hover:bg-brand-100 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{s.addStepBtn}</span>
        </button>
      </div>

      {formSteps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-8 text-center text-xs text-slate-400">
          <ListOrdered className="mx-auto h-8 w-8 text-slate-300 mb-2" />
          <p>{s.noSteps}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {formSteps.map((step, idx) => (
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
                  onClick={() => removeStep(idx)}
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
                  onChange={(e) => updateStep(idx, { title: e.target.value })}
                  placeholder="ধাপের শিরোনাম (উদাঃ অনলাইন পোর্টালে নিবন্ধন)"
                  className="h-10 text-xs"
                />
                <Select
                  value={step.actionType || "READ_GUIDE"}
                  onChange={(e) =>
                    updateStep(idx, {
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
                onChange={(e) => updateStep(idx, { description: e.target.value })}
                placeholder="এই ধাপে নাগরিককে কী করতে হবে তার বিস্তারিত নির্দেশনা..."
                rows={2}
                className="text-xs"
              />

              <Input
                type="url"
                value={step.officialUrl || ""}
                onChange={(e) => updateStep(idx, { officialUrl: e.target.value })}
                placeholder="নির্দিষ্ট ধাপের ওয়েবলিংক (উদাঃ https://...)"
                className="h-9 text-xs"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // -------------------------------------------------------------
  // Tab 4 Body: Fees & Charges (`serviceFee`)
  // -------------------------------------------------------------
  const renderFeesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          সরকারি ফি, ভ্যাট বা চার্জের বিবরণ।
        </p>
        <button
          type="button"
          onClick={addFee}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-800 border border-brand-200 hover:bg-brand-100 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{s.addFeeBtn}</span>
        </button>
      </div>

      {formFees.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-8 text-center text-xs text-slate-400">
          <CreditCard className="mx-auto h-8 w-8 text-slate-300 mb-2" />
          <p>{s.noFees}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {formFees.map((fee, idx) => (
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
                  onClick={() => removeFee(idx)}
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
                    onChange={(e) => updateFee(idx, { name: e.target.value })}
                    placeholder="ফি এর নাম (উদাঃ নিয়মিত আবেদন ফি)"
                    className="h-10 text-xs"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    step="0.01"
                    value={fee.amount !== undefined && fee.amount !== null ? String(fee.amount) : ""}
                    onChange={(e) => updateFee(idx, { amount: e.target.value })}
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
                onChange={(e) => updateFee(idx, { description: e.target.value })}
                placeholder="পরিশোধ পদ্ধতি বা অতিরিক্ত নোট (উদাঃ চালান কোড বা মোবাইল ব্যাংকিং)"
                className="h-9 text-xs"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // -------------------------------------------------------------
  // Tab 5 Body: Sources (`serviceSource`)
  // -------------------------------------------------------------
  const renderSourcesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          তথ্য যাচাইকরণের সরকারি উৎস, পরিপত্র ও গেজেট।
        </p>
        <button
          type="button"
          onClick={addSource}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-800 border border-brand-200 hover:bg-brand-100 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{s.addSourceBtn}</span>
        </button>
      </div>

      {formSources.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-8 text-center text-xs text-slate-400">
          <Link2 className="mx-auto h-8 w-8 text-slate-300 mb-2" />
          <p>{s.noSources}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {formSources.map((source, idx) => (
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
                  onClick={() => removeSource(idx)}
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
                  onChange={(e) => updateSource(idx, { title: e.target.value })}
                  placeholder="উৎস বা পরিপত্রের নাম (উদাঃ গেজেট বিজ্ঞপ্তি ২০২৪)"
                  className="h-10 text-xs"
                />
                <Select
                  value={source.sourceType || "OFFICIAL_PORTAL"}
                  onChange={(e) =>
                    updateSource(idx, {
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
                onChange={(e) => updateSource(idx, { url: e.target.value })}
                placeholder="ওয়েব লিংক (উদাঃ https://...)"
                className="h-9 text-xs"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
      {feedback && (
        <div
          className={cn(
            "flex items-center justify-between rounded-xl p-4 text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-top-1",
            feedback.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-800"
          )}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-700 ml-4 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-line bg-white p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200">
              <Layers className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-black text-slate-900">{s.title}</h1>
              <p className="text-xs text-slate-500">{s.subtitle}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-brand-800 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{s.addService}</span>
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-white p-4 shadow-card">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {s.totalServices}
          </p>
          <p className="mt-1 text-2xl font-black text-slate-900">{totalCount || services.length}</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-4 shadow-card">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {s.publishedServices}
          </p>
          <p className="mt-1 text-2xl font-black text-emerald-600">{publishedCount}</p>
        </div>
        <div className="col-span-2 sm:col-span-1 rounded-xl border border-line bg-white p-4 shadow-card">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            খসড়া / ড্রাফট
          </p>
          <p className="mt-1 text-2xl font-black text-amber-600">
            {services.length - publishedCount}
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="rounded-2xl border border-line bg-white shadow-card overflow-hidden">
        <div className="border-b border-line p-4 bg-slate-50/50 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={s.searchPlaceholder}
              className="h-10 w-full rounded-xl border border-line bg-white pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 rounded-xl border border-line bg-white px-3 text-xs font-semibold text-slate-700 focus:border-brand-500 focus:outline-none"
            >
              <option value="ALL">{s.filterCategory}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 rounded-xl border border-line bg-white px-3 text-xs font-semibold text-slate-700 focus:border-brand-500 focus:outline-none"
            >
              <option value="ALL">{s.filterStatus}</option>
              <option value="PUBLISHED">{s.published}</option>
              <option value="DRAFT">{s.draft}</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-line">
              <tr>
                <th scope="col" className="px-5 py-3.5">{s.colName}</th>
                <th scope="col" className="px-5 py-3.5">{s.colComponents}</th>
                <th scope="col" className="px-5 py-3.5">{s.colProcessing}</th>
                <th scope="col" className="px-5 py-3.5">{s.colStatus}</th>
                <th scope="col" className="px-5 py-3.5 text-center">{s.colPublish}</th>
                <th scope="col" className="px-5 py-3.5 text-right">{s.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredServices.length > 0 ? (
                filteredServices.map((svc) => (
                  <tr key={svc.id} className="transition-colors hover:bg-slate-50/70">
                    {/* Service Name & Category */}
                    <td className="px-5 py-4 max-w-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{svc.name}</span>
                          {svc.category_name && (
                            <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-800 border border-brand-200">
                              {svc.category_name}
                            </span>
                          )}
                        </div>
                        <p className="line-clamp-1 text-slate-500 text-[11px]">
                          {svc.shortDescription}
                        </p>
                        <code className="text-[10px] font-mono text-slate-400">/{svc.slug}</code>
                      </div>
                    </td>

                    {/* Related Schemas Indicators */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                            (svc.requirementCount || 0) > 0
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-slate-100 text-slate-400"
                          )}
                          title="Requirements / Documents"
                        >
                          <FileText className="h-3 w-3" />
                          <span>{svc.requirementCount || 0} Req</span>
                        </span>

                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                            (svc.stepCount || 0) > 0
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-slate-100 text-slate-400"
                          )}
                          title="Procedure Steps"
                        >
                          <ListOrdered className="h-3 w-3" />
                          <span>{svc.stepCount || 0} Steps</span>
                        </span>

                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                            (svc.feeCount || 0) > 0
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-400"
                          )}
                          title="Fees"
                        >
                          <CreditCard className="h-3 w-3" />
                          <span>{svc.feeCount || 0} Fees</span>
                        </span>
                      </div>
                    </td>

                    {/* Processing Time */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {svc.processingTime ? (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>{svc.processingTime}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Verification Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {svc.verificationStatus === "VERIFIED" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                          <ShieldCheck className="h-3 w-3 text-emerald-600" />
                          <span>{s.verified}</span>
                        </span>
                      ) : svc.verificationStatus === "NEEDS_REVIEW" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">
                          <ShieldAlert className="h-3 w-3 text-amber-600" />
                          <span>{s.needsReview}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 ring-1 ring-slate-200">
                          <span>{s.unverified}</span>
                        </span>
                      )}
                    </td>

                    {/* Published Toggle */}
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(svc)}
                        className={cn(
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          svc.isPublished ? "bg-emerald-600" : "bg-slate-300"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                            svc.isPublished ? "translate-x-4" : "translate-x-0"
                          )}
                        />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {svc.officialUrl && (
                          <a
                            href={svc.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700"
                            title="Official Portal"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(svc)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 cursor-pointer"
                          title={s.editService}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingService(svc)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                          title={s.deleteService}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <FolderOpen className="h-10 w-10 text-slate-300 mb-3" />
                      <p className="font-bold text-slate-700">{s.noData}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {search || selectedCategory !== "ALL" || selectedStatus !== "ALL"
                          ? "কোনো সেবা মেলেনি"
                          : categories.length === 0
                          ? s.needCategoryFirst
                          : "শুরু করতে একটি সেবা যুক্ত করুন"}
                      </p>
                      {!search && selectedCategory === "ALL" && selectedStatus === "ALL" && (
                        categories.length === 0 ? (
                          <Link
                            href="/admin/categories?action=create"
                            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-brand-800"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>{s.goToCategory}</span>
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={handleOpenCreate}
                            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-brand-800 cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>{s.createFirst}</span>
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE FULL SERVICE MODAL */}
      <Modal
        open={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          resetForm();
        }}
        title={s.addService}
        className="sm:max-w-2xl max-h-[90vh]"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {feedback?.type === "error" && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {feedback.message}
            </div>
          )}

          {renderTabHeader()}

          {activeTab === "basic" && renderBasicTab()}
          {activeTab === "requirements" && renderRequirementsTab()}
          {activeTab === "steps" && renderStepsTab()}
          {activeTab === "fees" && renderFeesTab()}
          {activeTab === "sources" && renderSourcesTab()}

          <div className="mt-6 flex items-center justify-between gap-3 pt-3 border-t border-line">
            <div className="text-[11px] text-slate-400">
              {formRequirements.length} Req • {formSteps.length} Steps • {formFees.length} Fees
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                disabled={isSubmitting}
                className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                {s.cancel}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-800 transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>{isSubmitting ? s.saving : s.save}</span>
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* EDIT FULL SERVICE MODAL */}
      <Modal
        open={!!editingService}
        onClose={() => {
          setEditingService(null);
          resetForm();
        }}
        title={s.editService}
        className="sm:max-w-2xl max-h-[90vh]"
      >
        {isLoadingDetails ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600 mb-2" />
            <p className="text-xs font-bold">সম্পূর্ণ স্কিমা লোড হচ্ছে...</p>
          </div>
        ) : (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {feedback?.type === "error" && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {feedback.message}
              </div>
            )}

            {renderTabHeader()}

            {activeTab === "basic" && renderBasicTab()}
            {activeTab === "requirements" && renderRequirementsTab()}
            {activeTab === "steps" && renderStepsTab()}
            {activeTab === "fees" && renderFeesTab()}
            {activeTab === "sources" && renderSourcesTab()}

            <div className="mt-6 flex items-center justify-between gap-3 pt-3 border-t border-line">
              <div className="text-[11px] text-slate-400">
                {formRequirements.length} Req • {formSteps.length} Steps • {formFees.length} Fees
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  disabled={isSubmitting}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  {s.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-800 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{isSubmitting ? s.saving : s.save}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <Modal
        open={!!deletingService}
        onClose={() => setDeletingService(null)}
        title={s.deleteService}
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-900">{s.deleteConfirm}</p>
                <p className="mt-1 text-xs text-red-700">{s.deleteWarning}</p>
                {deletingService && (
                  <p className="mt-2 text-xs font-bold text-slate-800">
                    &ldquo;{deletingService.name}&rdquo; ({deletingService.slug})
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeletingService(null)}
              disabled={isSubmitting}
              className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              {s.cancel}
            </button>
            <button
              type="button"
              onClick={handleDeleteSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{isSubmitting ? s.deleting : s.delete}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
