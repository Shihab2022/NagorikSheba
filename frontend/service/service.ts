/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { apiMethods } from "@/constant";
import { apiHandler } from "@/lib/apiHandler";
import type { ServiceFeeItem, ServiceItem, ServiceQueryParams, ServiceRequirementItem, ServiceResponse, ServiceSourceItem, ServiceStepItem } from "@/types/service";
export type { ServiceFeeItem, ServiceItem, ServiceQueryParams, ServiceRequirementItem, ServiceResponse, ServiceSourceItem, ServiceStepItem };
import { revalidatePath } from "next/cache";



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
