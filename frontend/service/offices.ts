"use server";
import { apiMethods } from "@/constant";
import { apiHandler } from "@/lib/apiHandler";
import type {
  NearbyOfficesResult,
  OfficeArea,
  OfficeServiceKey,
} from "@/lib/types";

const baseURL = process.env.NEXT_PUBLIC_API_SERVER_API;

export interface NearbyOfficesResponse {
  success: boolean;
  message?: string;
  status?: number;
  data?: NearbyOfficesResult;
  meta?: { page: number; limit: number; total: number } | null;
}

/**
 * Fetch offices supporting `service` near the given GPS coordinates,
 * sorted by approximate straight-line distance (nearest first).
 */
export const getNearbyOffices = async (params: {
  service: OfficeServiceKey;
  lat: number;
  lng: number;
  radiusKm?: number;
  page?: number;
  limit?: number;
}): Promise<NearbyOfficesResponse> => {
  const res = await apiHandler({
    baseURL,
    path: "government-offices/nearby",
    method: apiMethods.GET as keyof typeof apiMethods,
    params: {
      service: params.service,
      lat: params.lat,
      lng: params.lng,
      radiusKm: params.radiusKm,
      page: params.page,
      limit: params.limit,
    },
  });

  return {
    success: res.success,
    message: res.message,
    status: res.status,
    data: res.data?.data,
    meta: res.data?.meta ?? null,
  };
};

/**
 * Fetch offices supporting `service` inside a manually selected
 * district/upazila (no GPS shared). Distances are not available in
 * this mode.
 */
export const getOfficesByArea = async (params: {
  service: OfficeServiceKey;
  district: string;
  upazila?: string | null;
  page?: number;
  limit?: number;
}): Promise<NearbyOfficesResponse> => {
  const res = await apiHandler({
    baseURL,
    path: "government-offices/by-area",
    method: apiMethods.GET as keyof typeof apiMethods,
    params: {
      service: params.service,
      district: params.district,
      upazila: params.upazila ?? undefined,
      page: params.page,
      limit: params.limit,
    },
  });

  return {
    success: res.success,
    message: res.message,
    status: res.status,
    data: res.data?.data,
    meta: res.data?.meta ?? null,
  };
};

export interface OfficeAreasResponse {
  success: boolean;
  message?: string;
  status?: number;
  data?: OfficeArea[];
}

/** Distinct district/upazila pairs with offices for the given service. */
export const getOfficeAreas = async (
  service: OfficeServiceKey,
): Promise<OfficeAreasResponse> => {
  const res = await apiHandler({
    baseURL,
    path: "government-offices/areas",
    method: apiMethods.GET as keyof typeof apiMethods,
    params: { service },
  });

  return {
    success: res.success,
    message: res.message,
    status: res.status,
    data: Array.isArray(res.data?.data) ? (res.data.data as OfficeArea[]) : [],
  };
};
