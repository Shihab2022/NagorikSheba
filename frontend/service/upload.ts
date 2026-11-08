"use server";

import { apiHandler } from "@/lib/apiHandler";
import type { IUploadedFile, IUploadResponse, IUploadResult } from "@/types/upload";

/**
 * Server action to upload multiple files (images/PDFs) to Cloudinary via Express backend.
 * Expected input: FormData with field name "files"
 */
export const uploadFilesAction = async (
  formData: FormData
): Promise<IUploadResponse> => {
  try {
    const res = await apiHandler({
      path: "upload",
      method: "POST",
      params: formData as any,
      formData: true,
    });

    if (!res.success) {
      return {
        success: false,
        message: res.message || "ফাইল আপলোড করতে সমস্যা হয়েছে (Upload failed)",
        status: res.status,
        error: res.error,
      };
    }

    const apiData = res.data;
    const result: IUploadResult = apiData?.data || apiData;

    return {
      success: true,
      message: apiData?.message || "ফাইল সফলভাবে আপলোড হয়েছে!",
      status: res.status,
      data: result,
    };
  } catch (err: any) {
    console.error("uploadFilesAction error:", err);
    return {
      success: false,
      message: err?.message || "সার্ভারে ফাইল আপলোড করা যায়নি।",
    };
  }
};

/**
 * Server action to fetch all files actually uploaded to Cloudinary.
 * No dummy or mock data - purely live data from Cloudinary!
 */
export const getUploadedFilesAction = async (): Promise<{
  success: boolean;
  message?: string;
  data: IUploadedFile[];
}> => {
  try {
    const res = await apiHandler({
      path: "upload",
      method: "GET",
    });

    if (!res.success) {
      return {
        success: false,
        message: res.message || "ক্লাউড স্টোরেজ থেকে ফাইল আনতে ব্যর্থ হয়েছে।",
        data: [],
      };
    }

    const files = res.data?.data || res.data || [];
    return {
      success: true,
      message: res.data?.message || "Files fetched successfully",
      data: Array.isArray(files) ? files : [],
    };
  } catch (err: any) {
    console.error("getUploadedFilesAction error:", err);
    return {
      success: false,
      message: err?.message || "ক্লাউড থেকে ফাইল লোড করা যায়নি।",
      data: [],
    };
  }
};

/**
 * Server action to delete an uploaded file from Cloudinary by publicId.
 */
export const deleteUploadedFileAction = async (
  publicId: string,
  resourceType: string = "image"
): Promise<{ success: boolean; message?: string }> => {
  try {
    const res = await apiHandler({
      path: `upload`,
      method: "DELETE",
      params: { publicId, resourceType },
    });

    return {
      success: res.success,
      message: res.data?.message || res.message,
    };
  } catch (err: any) {
    console.error("deleteUploadedFileAction error:", err);
    return {
      success: false,
      message: err?.message || "ফাইল ডিলিট করা যায়নি।",
    };
  }
};
