export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
}

export interface ServiceRequirement {
  id: string;
  serviceId: string;
  name: string;
  description: string | null;
  isMandatory: boolean;
  conditionDescription: string | null;
  sortOrder: number;
}

export interface ServiceStep {
  id: string;
  serviceId: string;
  stepNumber: number;
  title: string;
  description: string;
  actionType:
    | "READ_GUIDE"
    | "VISIT_OFFICIAL_PORTAL"
    | "VISIT_OFFICE"
    | "PREPARE_DOCUMENTS"
    | "OTHER";
  officialUrl: string | null;
}

export interface ServiceFee {
  id: string;
  serviceId: string;
  name: string;
  amount: string | null;
  currency: string;
  description: string | null;
  effectiveFrom: string | null;
  effectiveUntil: string | null;
}

export interface ServiceSource {
  id: string;
  serviceId: string;
  title: string;
  url: string;
  sourceType:
    | "OFFICIAL_PORTAL"
    | "OFFICIAL_NOTICE"
    | "OFFICIAL_DOCUMENT"
    | "OTHER";
  lastCheckedAt: string | null;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  eligibility: string | null;
  processingTime: string | null;
  officialUrl: string | null;
  verificationStatus: "UNVERIFIED" | "VERIFIED" | "NEEDS_REVIEW";
  lastVerifiedAt: string | null;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  category?: ServiceCategory;
  requirements?: ServiceRequirement[];
  steps?: ServiceStep[];
  fees?: ServiceFee[];
  sources?: ServiceSource[];
}

export interface CreateServicePayload {
  categoryId: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  eligibility?: string;
  processingTime?: string;
  officialUrl?: string;
}