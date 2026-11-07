"use server";
import { apiMethods } from "@/constant";
import { apiHandler } from "@/lib/apiHandler";
import type {
  NearbyOffice,
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
    data: res.data?.data
      ? {
          ...res.data.data,
          offices: (res.data.data.offices ?? []).map(
            (office: NearbyOffice) => ({
              id: office.id ?? `${office.latitude}-${office.longitude}`,
              name: office.name,
              officeType: "PASSPORT_OFFICE",
              address: office.address ?? "",
              division: null,
              district: office.district ?? "",
              upazila: null,
              latitude: office.latitude,
              longitude: office.longitude,
              phone: office.phone ?? null,
              officialUrl: office.officialUrl ?? null,
              lastVerifiedAt: null,
              distanceKm: office.distanceKm ?? null,
              drivingDistanceKm: office.drivingDistanceKm ?? null,
            }),
          ),
        }
      : undefined,
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
  districtBn?: string;
  upazila?: string | null;
  upazilaBn?: string | null;
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
      districtBn: params.districtBn ?? undefined,
      upazilaBn: params.upazilaBn ?? undefined,
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
