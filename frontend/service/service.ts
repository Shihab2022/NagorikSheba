/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { apiMethods } from "@/constant";
import { apiHandler } from "@/lib/apiHandler";
import { revalidatePath } from "next/cache";

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

export const getAllServices = async (
  query?: ServiceQueryParams
): Promise<ServiceResponse<ServiceItem[]>> => {
  const res = await apiHandler({
    path: "service",
    method: apiMethods.GET as keyof typeof apiMethods,
    params: (query as Record<string, any>) || {},
  });

  return {
    success: res.success,
    message: res.message,
    status: res.status,
    data: res?.data?.data || [],
    meta: res?.data?.meta,
  };
};

export const getSingleService = async (
  serviceId: string
): Promise<ServiceResponse<ServiceItem>> => {
  const res = await apiHandler({
    path: `service/${serviceId}`,
    method: apiMethods.GET as keyof typeof apiMethods,
  });

  return {
    success: res.success,
    message: res.message,
    status: res.status,
    data: res?.data?.data,
  };
};

export const createService = async (payload: {
  categoryId: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  eligibility?: string;
  processingTime?: string;
  officialUrl?: string;
  isPublished?: boolean;
  requirements?: ServiceRequirementItem[];
  steps?: ServiceStepItem[];
  fees?: ServiceFeeItem[];
  sources?: ServiceSourceItem[];
}): Promise<ServiceResponse<ServiceItem>> => {
  const res = await apiHandler({
    path: "service",
    method: apiMethods.POST as keyof typeof apiMethods,
    params: payload,
  });

  if (res.success) {
    revalidatePath("/admin/services");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/dashboard");
    revalidatePath("/services");
  }

  return {
    success: res.success,
    message: res.message || (res.success ? "Service created successfully" : "Failed to create service"),
    status: res.status,
    data: res?.data?.data,
  };
};

export const updateService = async (
  serviceId: string,
  payload: Partial<{
    categoryId: string;
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    eligibility: string;
    processingTime: string;
    officialUrl: string;
    verificationStatus: "UNVERIFIED" | "VERIFIED" | "NEEDS_REVIEW";
    isPublished: boolean;
    requirements: ServiceRequirementItem[];
    steps: ServiceStepItem[];
    fees: ServiceFeeItem[];
    sources: ServiceSourceItem[];
  }>
): Promise<ServiceResponse<ServiceItem>> => {
  const res = await apiHandler({
    path: `service/${serviceId}`,
    method: apiMethods.PATCH as keyof typeof apiMethods,
    params: payload,
  });

  if (res.success) {
    revalidatePath("/admin/services");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/dashboard");
    revalidatePath("/services");
  }

  return {
    success: res.success,
    message: res.message || (res.success ? "Service updated successfully" : "Failed to update service"),
    status: res.status,
    data: res?.data?.data,
  };
};

export const deleteService = async (
  serviceId: string
): Promise<ServiceResponse<ServiceItem>> => {
  const res = await apiHandler({
    path: `service/${serviceId}`,
    method: apiMethods.DELETE as keyof typeof apiMethods,
  });

  if (res.success) {
    revalidatePath("/admin/services");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/dashboard");
    revalidatePath("/services");
  }

  return {
    success: res.success,
    message: res.message || (res.success ? "Service deleted successfully" : "Failed to delete service"),
    status: res.status,
    data: res?.data?.data,
  };
};
