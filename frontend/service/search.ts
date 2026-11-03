/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiMethods } from "@/constant";
import { apiHandler } from "@/lib/apiHandler";

export interface UnifiedSearchResultItem {
  id: string;
  type: "service" | "office" | "document" | "notice";
  title: string;
  description: string;
  href: string;
  badge?: string;
  fee?: string;
  processingTime?: string;
  isOnline?: boolean;
  score?: number;
  aiMatched?: boolean;
  aiSimilarity?: number;
}

export interface UnifiedSearchResponse {
  success: boolean;
  message?: string;
  data: {
    query: string;
    total: number;
    aiInsight?: string | null;
    results: UnifiedSearchResultItem[];
    counts: {
      all: number;
      service: number;
      office: number;
      document: number;
      notice?: number;
    };
  };
}

/**
 * Perform global search exclusively from the Backend API (PostgreSQL + pgvector).
 * Static/mock data has been completely eliminated from the search flow.
 */
export const searchGlobal = async (
  query: string,
  type: "all" | "service" | "office" | "document" = "all"
): Promise<UnifiedSearchResponse> => {
  try {
    const res = await apiHandler({
      path: "search",
      method: apiMethods.GET as keyof typeof apiMethods,
      params: {
        q: query || undefined,
        type: type !== "all" ? type : undefined,
      },
    });

    if (res.success && res.data && res.data.data) {
      return {
        success: true,
        message: res.message,
        data: res.data.data,
      };
    }
  } catch (err) {
    console.error("Backend search API request failed:", err);
  }

  // Return clean empty structure if API returns no data or fails
  return {
    success: false,
    data: {
      query,
      total: 0,
      results: [],
      counts: {
        all: 0,
        service: 0,
        office: 0,
        document: 0,
      },
    },
  };
};
