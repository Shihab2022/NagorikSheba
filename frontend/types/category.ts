/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  serviceCount?: number;
}

export interface CategoryResponse<T = any> {
  success: boolean;
  message?: string;
  status?: number;
  data?: T;
}