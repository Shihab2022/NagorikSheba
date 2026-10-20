/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { apiMethods } from "@/constant";
import { apiHandler } from "@/lib/apiHandler";
import type {
  CreateTrackedServicePayload,
  TrackedServiceItem,
  TrackedStepItem,
  TrackedServiceResponse,
  UpdateTrackedServicePayload,
  UpdateTrackedStepPayload,
} from "@/types/tracked-service";
export type {
  CreateTrackedServicePayload,
  TrackedServiceItem,
  TrackedStepItem,
  TrackedServiceResponse,
  UpdateTrackedServicePayload,
  UpdateTrackedStepPayload,
};
import { revalidatePath } from "next/cache";

export const getMyTrackedServices = async (): Promise<
  TrackedServiceResponse<TrackedServiceItem[]>
> => {
  const res = await apiHandler({
    path: "tracked-service",
    method: apiMethods.GET as keyof typeof apiMethods,
  });

  return {
    success: res.success,
    message: res.message,
    status: res.status,
    data: res?.data?.data || [],
  };
};

export const getSingleTrackedService = async (
  trackedServiceId: string,
): Promise<TrackedServiceResponse<TrackedServiceItem>> => {
  const res = await apiHandler({
    path: `tracked-service/${trackedServiceId}`,
    method: apiMethods.GET as keyof typeof apiMethods,
  });

  return {
    success: res.success,
    message: res.message,
    status: res.status,
    data: res?.data?.data,
  };
};

export const getTrackedSteps = async (
  trackedServiceId: string,
): Promise<TrackedServiceResponse<TrackedStepItem[]>> => {
  const res = await apiHandler({
    path: `tracked-service/${trackedServiceId}/steps`,
    method: apiMethods.GET as keyof typeof apiMethods,
  });

  return {
    success: res.success,
    message: res.message,
    status: res.status,
    data: res?.data?.data || [],
  };
};

export const createTrackedService = async (
  payload: CreateTrackedServicePayload,
): Promise<TrackedServiceResponse<TrackedServiceItem>> => {
  const res = await apiHandler({
    path: "tracked-service",
    method: apiMethods.POST as keyof typeof apiMethods,
    params: payload,
  });

  if (res.success) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/applications");
    revalidatePath("/application-tracker");
  }

  return {
    success: res.success,
    message:
      res.message ||
      (res.success ? "Tracked successfully" : "Failed to track service"),
    status: res.status,
    data: res?.data?.data,
  };
};

export const updateTrackedService = async (
  trackedServiceId: string,
  payload: UpdateTrackedServicePayload,
): Promise<TrackedServiceResponse<TrackedServiceItem>> => {
  const res = await apiHandler({
    path: `tracked-service/${trackedServiceId}`,
    method: apiMethods.PATCH as keyof typeof apiMethods,
    params: payload,
  });

  if (res.success) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/applications");
    revalidatePath(`/dashboard/applications/${trackedServiceId}`);
  }

  return {
    success: res.success,
    message:
      res.message ||
      (res.success ? "Updated successfully" : "Failed to update service"),
    status: res.status,
    data: res?.data?.data,
  };
};

export const deleteTrackedService = async (
  trackedServiceId: string,
): Promise<TrackedServiceResponse<null>> => {
  const res = await apiHandler({
    path: `tracked-service/${trackedServiceId}`,
    method: apiMethods.DELETE as keyof typeof apiMethods,
  });

  if (res.success) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/applications");
    revalidatePath("/application-tracker");
  }

  return {
    success: res.success,
    message:
      res.message ||
      (res.success ? "Deleted successfully" : "Failed to delete service"),
    status: res.status,
    data: null,
  };
};

export const updateTrackedStep = async (
  trackedServiceId: string,
  serviceStepId: string,
  payload: UpdateTrackedStepPayload,
): Promise<TrackedServiceResponse<TrackedStepItem>> => {
  const res = await apiHandler({
    path: `tracked-service/${trackedServiceId}/steps/${serviceStepId}`,
    method: apiMethods.PATCH as keyof typeof apiMethods,
    params: payload,
  });

  if (res.success) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/applications");
    revalidatePath(`/dashboard/applications/${trackedServiceId}`);
  }

  return {
    success: res.success,
    message:
      res.message || (res.success ? "Step updated" : "Failed to update step"),
    status: res.status,
    data: res?.data?.data,
  };
};
