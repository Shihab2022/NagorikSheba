/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ServiceRequirementItem {
  id?: string;
  serviceId?: string;
  name: string;
  description?: string | null;
  isMandatory?: boolean;
  conditionDescription?: string | null;
  sortOrder?: number;
}

export interface ServiceStepItem {
  id?: string;
  serviceId?: string;
  stepNumber: number;
  title: string;
  description: string;
  actionType?: "READ_GUIDE" | "VISIT_OFFICIAL_PORTAL" | "VISIT_OFFICE" | "PREPARE_DOCUMENTS" | "OTHER";
  officialUrl?: string | null;
}

export interface ServiceFeeItem {
  id?: string;
  serviceId?: string;
  name: string;
  amount?: number | string | null;
  currency?: string;
  description?: string | null;
  effectiveFrom?: string | null;
  effectiveUntil?: string | null;
}

export interface ServiceSourceItem {
  id?: string;
  serviceId?: string;
  title: string;
  url: string;
  sourceType?: "OFFICIAL_PORTAL" | "OFFICIAL_NOTICE" | "OFFICIAL_DOCUMENT" | "OTHER";
  lastCheckedAt?: string;
}

export interface ServiceItem {
  id: string;
  categoryId: string;
  category_name?: string;
  category_slug?: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  eligibility: string | null;
  processingTime: string | null;
  officialUrl: string | null;
  verificationStatus: "UNVERIFIED" | "VERIFIED" | "NEEDS_REVIEW";
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  requirementCount?: number;
  stepCount?: number;
  feeCount?: number;
  sourceCount?: number;
  requirements?: ServiceRequirementItem[];
  steps?: ServiceStepItem[];
  fees?: ServiceFeeItem[];
  sources?: ServiceSourceItem[];
}

export interface ServiceResponse<T = any> {
  success: boolean;
  message?: string;
  status?: number;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ServiceQueryParams {
  categoryId?: string;
  isPublished?: boolean | string;
  search?: string;
  page?: number;
  limit?: number;
}