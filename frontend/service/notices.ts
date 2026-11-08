"use server";

import { apiMethods } from "@/constant";
import { apiHandler } from "@/lib/apiHandler";
import { revalidatePath } from "next/cache";
import type { NoticeItem, NoticeSourceItem } from "@/lib/types";

export interface CategoryNoticesResponse {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
  };
  items: NoticeItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const getCategoryNotices = async (
  slug: string,
  page = 1,
  limit = 20
): Promise<{ success: boolean; data?: CategoryNoticesResponse; status?: number; message?: string }> => {
  const res = await apiHandler({
    path: `category/${encodeURIComponent(slug)}/notices?page=${page}&limit=${limit}`,
    method: apiMethods.GET as keyof typeof apiMethods,
  });

  return {
    success: res.success,
    status: res.status,
    message: res.message,
    data: res.data?.data,
  };
};

export const getLatestNotices = async (query: {
  categoryId?: string;
  slug?: string;
  limit?: number;
}): Promise<{ success: boolean; data?: NoticeItem[] }> => {
  const params = new URLSearchParams();
  if (query.categoryId) params.set("categoryId", query.categoryId);
  if (query.slug) params.set("slug", query.slug);
  if (query.limit) params.set("limit", String(query.limit));

  const res = await apiHandler({
    path: `notices/latest?${params.toString()}`,
    method: apiMethods.GET as keyof typeof apiMethods,
  });

  return {
    success: res.success,
    data: res.data?.data || [],
  };
};

// -------------------------------------------------------------
// ADMIN NOTICE SOURCES
// -------------------------------------------------------------

export const getAllNoticeSources = async (): Promise<{
  success: boolean;
  data?: NoticeSourceItem[];
  message?: string;
}> => {
  const res = await apiHandler({
    path: "admin/notice-sources",
    method: apiMethods.GET as keyof typeof apiMethods,
  });

  return {
    success: res.success,
    data: res.data?.data || [],
    message: res.message,
  };
};

export const createNoticeSource = async (payload: {
  categoryId: string;
  name: string;
  listUrl: string;
  scraperType?: string;
  config?: any;
  isActive?: boolean;
  fetchIntervalMinutes?: number;
}) => {
  const res = await apiHandler({
    path: "admin/notice-sources",
    method: apiMethods.POST as keyof typeof apiMethods,
    params: payload,
  });

  if (res.success) {
    revalidatePath("/admin/notice-sources");
  }

  return {
    success: res.success,
    data: res.data?.data,
    message: res.message || (res.success ? "Notice source created successfully" : "Failed to create source"),
  };
};

export const updateNoticeSource = async (
  id: number,
  payload: {
    categoryId?: string;
    name?: string;
    listUrl?: string;
    scraperType?: string;
    config?: any;
    isActive?: boolean;
    fetchIntervalMinutes?: number;
  }
) => {
  const res = await apiHandler({
    path: `admin/notice-sources/${id}`,
    method: apiMethods.PATCH as keyof typeof apiMethods,
    params: payload,
  });

  if (res.success) {
    revalidatePath("/admin/notice-sources");
  }

  return {
    success: res.success,
    data: res.data?.data,
    message: res.message || (res.success ? "Notice source updated successfully" : "Failed to update source"),
  };
};

export const deleteNoticeSource = async (id: number) => {
  const res = await apiHandler({
    path: `admin/notice-sources/${id}`,
    method: apiMethods.DELETE as keyof typeof apiMethods,
  });

  if (res.success) {
    revalidatePath("/admin/notice-sources");
  }

  return {
    success: res.success,
    message: res.message || (res.success ? "Notice source deleted successfully" : "Failed to delete source"),
  };
};

export const testNoticeSource = async (id: number) => {
  const res = await apiHandler({
    path: `admin/notice-sources/${id}/test`,
    method: apiMethods.POST as keyof typeof apiMethods,
  });

  return {
    success: res.success,
    data: res.data?.data,
    message: res.message,
  };
};

export const runNoticeSource = async (id: number) => {
  const res = await apiHandler({
    path: `admin/notice-sources/${id}/run`,
    method: apiMethods.POST as keyof typeof apiMethods,
  });

  if (res.success) {
    revalidatePath("/admin/notice-sources");
    revalidatePath("/admin/notices");
  }

  return {
    success: res.success,
    data: res.data?.data,
    message: res.message || (res.success ? "Scraper executed successfully" : "Scraper execution failed"),
  };
};

// -------------------------------------------------------------
// ADMIN NOTICES
// -------------------------------------------------------------

export const getAllNoticesAdmin = async (query: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}): Promise<{
  success: boolean;
  data?: {
    items: NoticeItem[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}> => {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.categoryId) params.set("categoryId", query.categoryId);
  if (query.search) params.set("search", query.search);

  const res = await apiHandler({
    path: `admin/notices?${params.toString()}`,
    method: apiMethods.GET as keyof typeof apiMethods,
  });

  return {
    success: res.success,
    data: res.data?.data,
    message: res.message,
  };
};

export const createManualNotice = async (payload: {
  categoryId: string;
  title: string;
  url: string;
  publishedAt?: string | null;
}) => {
  const res = await apiHandler({
    path: "admin/notices",
    method: apiMethods.POST as keyof typeof apiMethods,
    params: payload,
  });

  if (res.success) {
    revalidatePath("/admin/notices");
  }

  return {
    success: res.success,
    data: res.data?.data,
    message: res.message || (res.success ? "Notice created successfully" : "Failed to create notice"),
  };
};

export const updateNotice = async (
  id: number,
  payload: {
    categoryId?: string;
    title?: string;
    url?: string;
    isHidden?: boolean;
  }
) => {
  const res = await apiHandler({
    path: `admin/notices/${id}`,
    method: apiMethods.PATCH as keyof typeof apiMethods,
    params: payload,
  });

  if (res.success) {
    revalidatePath("/admin/notices");
  }

  return {
    success: res.success,
    data: res.data?.data,
    message: res.message || (res.success ? "Notice updated successfully" : "Failed to update notice"),
  };
};

export const deleteNotice = async (id: number) => {
  const res = await apiHandler({
    path: `admin/notices/${id}`,
    method: apiMethods.DELETE as keyof typeof apiMethods,
  });

  if (res.success) {
    revalidatePath("/admin/notices");
  }

  return {
    success: res.success,
    message: res.message || (res.success ? "Notice deleted successfully" : "Failed to delete notice"),
  };
};
