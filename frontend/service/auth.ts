/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { apiMethods } from "@/constant";
import { apiHandler } from "@/lib/apiHandler";
import { cookies } from "next/headers";

const baseURL = process.env.NEXT_PUBLIC_API_SERVER_API;

/** Store the JWT in an httpOnly cookie so later apiHandler calls stay authenticated. */
const persistToken = async (token: string) => {
  const store = await cookies();
  store.set("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 90 * 24 * 60 * 60, // 90 days
  });
};

export interface AuthResult<T = any> {
  success: boolean;
  message?: string;
  status?: number;
  data?: T;
}

export const registerUser = async (
  params: { name: string; email: string; password: string; role?: "USER" | "ADMIN" },
): Promise<AuthResult> => {
  const payload = {
    password: params.password,
    role: params.role || "USER",
    user: {
      name: params.name,
      email: params.email,
    },
  };

  const res = await apiHandler({
    baseURL,
    path: "auth/register",
    method: apiMethods.POST as keyof typeof apiMethods,
    formData: false,
    params: payload,
  });

  const token = res?.data?.data?.accessToken;
  if (res.success && token) {
    await persistToken(token);
  }

  return {
    success: res.success,
    message: res.message,
    status: res.status,
    data: res?.data?.data,
  };
};

export const loginUser = async (
  params: { email: string; password: string },
): Promise<AuthResult> => {
  const res = await apiHandler({
    baseURL,
    path: "auth/login",
    method: apiMethods.POST as keyof typeof apiMethods,
    formData: false,
    params,
  });

  const token = res?.data?.data?.accessToken;
  if (res.success && token) {
    await persistToken(token);
  }

  return {
    success: res.success,
    message: res.message,
    status: res.status,
    data: res?.data?.data,
  };
};

export const googleAuth = async (credential: string): Promise<AuthResult> => {
  const res = await apiHandler({
    baseURL,
    path: "auth/google",
    method: apiMethods.POST as keyof typeof apiMethods,
    formData: false,
    params: { credential },
  });

  const token = res?.data?.data?.accessToken;
  if (res.success && token) {
    await persistToken(token);
  }

  return {
    success: res.success,
    message: res.message,
    status: res.status,
    data: res?.data?.data,
  };
};

export const getMe = async (): Promise<AuthResult> => {
  const res = await apiHandler({
    baseURL,
    path: "auth/me",
    method: apiMethods.GET as keyof typeof apiMethods,
    formData: false,
    params: {},
  });

  return {
    success: res.success,
    message: res.message,
    status: res.status,
    data: res?.data?.data,
  };
};

export const changePassword = async (
  params: { oldPassword: string; newPassword: string },
): Promise<AuthResult> => {
  const res = await apiHandler({
    baseURL,
    path: "auth/change-password",
    method: apiMethods.POST as keyof typeof apiMethods,
    formData: false,
    params,
  });

  return {
    success: res.success,
    message: res.message,
    status: res.status,
    data: res?.data?.data,
  };
};

export const logout = async () => {
  const store = await cookies();
  store.delete("accessToken");
  return { success: true };
};