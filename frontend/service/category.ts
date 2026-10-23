"use server";
import { apiMethods } from "@/constant";
import { apiHandler } from "@/lib/apiHandler";
import type { CategoryItem, CategoryResponse } from "@/types/category";
export type { CategoryItem, CategoryResponse };
import { revalidatePath } from "next/cache";

export const getAllCategories = async (): Promise<
  CategoryResponse<CategoryItem[]>
> => {
  const res = await apiHandler({
    path: "category",
    method: apiMethods.GET as keyof typeof apiMethods,
  });

  return {
    success: res.success,
    message: res.message,
    status: res.status,
    data: res?.data?.data || [],
  };
};

export const getSingleCategory = async (
  categoryId: string,
): Promise<CategoryResponse<CategoryItem>> => {
  const res = await apiHandler({
    path: `category/${categoryId}`,
    method: apiMethods.GET as keyof typeof apiMethods,
  });

  return {
    success: res.success,
    message: res.message,
    status: res.status,
    data: res?.data?.data,
  };
};

export const createCategory = async (payload: {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}): Promise<CategoryResponse<CategoryItem>> => {
  const res = await apiHandler({
    path: "category",
    method: apiMethods.POST as keyof typeof apiMethods,
    params: payload,
  });

  if (res.success) {
    revalidatePath("/admin/categories");
    revalidatePath("/admin/dashboard");
    revalidatePath("/services");
  }

  return {
    success: res.success,
    message:
      res.message ||
      (res.success
        ? "Category created successfully"
        : "Failed to create category"),
    status: res.status,
    data: res?.data?.data,
  };
};

export const updateCategory = async (
  categoryId: string,
  payload: {
    name?: string;
    slug?: string;
    description?: string;
    icon?: string;
  },
): Promise<CategoryResponse<CategoryItem>> => {
  const res = await apiHandler({
    path: `category/${categoryId}`,
    method: apiMethods.PATCH as keyof typeof apiMethods,
    params: payload,
  });

  if (res.success) {
    revalidatePath("/admin/categories");
    revalidatePath("/admin/dashboard");
    revalidatePath("/services");
  }

  return {
    success: res.success,
    message:
      res.message ||
      (res.success
        ? "Category updated successfully"
        : "Failed to update category"),
    status: res.status,
    data: res?.data?.data,
  };
};

export const deleteCategory = async (
  categoryId: string,
): Promise<CategoryResponse<CategoryItem>> => {
  const res = await apiHandler({
    path: `category/${categoryId}`,
    method: apiMethods.DELETE as keyof typeof apiMethods,
  });

  if (res.success) {
    revalidatePath("/admin/categories");
    revalidatePath("/admin/dashboard");
    revalidatePath("/services");
  }

  return {
    success: res.success,
    message:
      res.message ||
      (res.success
        ? "Category deleted successfully"
        : "Failed to delete category"),
    status: res.status,
    data: res?.data?.data,
  };
};
