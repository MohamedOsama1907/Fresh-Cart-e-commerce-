"use server";

import { cookies } from "next/headers";
import { apiClient } from "@/services/apiClient";
import { isAxiosError, type AxiosRequestConfig } from "axios";
import type {
  AddAddressBody,
  AddressesApiResponse,
  UpdateProfileBody,
  ChangePasswordBody,
} from "../types/profile.types";

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}

// ─── Addresses ───────────────────────────────────────────────────────────────

export async function getAddresses(): Promise<AddressesApiResponse> {
  const token = (await cookies()).get("token")?.value;
  if (!token) throw new Error("Please sign in to view your addresses.");

  const config: AxiosRequestConfig = {
    method: "GET",
    url: "/addresses",
    headers: { token },
  };
  const { data } = await apiClient.request<AddressesApiResponse>(config);
  return data;
}

export async function addAddress(body: AddAddressBody) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return { success: false as const, message: "Please sign in." };

  try {
    const config: AxiosRequestConfig = {
      method: "POST",
      url: "/addresses",
      headers: { token },
      data: body,
    };
    await apiClient.request(config);
    return { success: true as const, message: "Address added successfully." };
  } catch (error) {
    return {
      success: false as const,
      message: getErrorMessage(error, "Failed to add address."),
    };
  }
}

export async function removeAddress(addressId: string) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return { success: false as const, message: "Please sign in." };

  try {
    const config: AxiosRequestConfig = {
      method: "DELETE",
      url: `/addresses/${addressId}`,
      headers: { token },
    };
    await apiClient.request(config);
    return {
      success: true as const,
      message: "Address removed successfully.",
    };
  } catch (error) {
    return {
      success: false as const,
      message: getErrorMessage(error, "Failed to remove address."),
    };
  }
}

// ─── Profile & User ──────────────────────────────────────────────────────────

export async function getMe() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: "/users/getMe",
      headers: { token },
    };
    const { data } = await apiClient.request(config);
    return data.data;
  } catch {
    return null;
  }
}

export async function updateProfile(body: UpdateProfileBody) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return { success: false as const, message: "Please sign in." };

  try {
    const config: AxiosRequestConfig = {
      method: "PUT",
      url: "/users/updateMe",
      headers: { token },
      data: body,
    };
    const { data } = await apiClient.request(config);
    return {
      success: true as const,
      message: "Profile updated successfully.",
      user: data.user,
    };
  } catch (error) {
    return {
      success: false as const,
      message: getErrorMessage(error, "Failed to update profile."),
    };
  }
}

export async function changePassword(body: ChangePasswordBody) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return { success: false as const, message: "Please sign in." };

  try {
    const config: AxiosRequestConfig = {
      method: "PUT",
      url: "/users/changeMyPassword",
      headers: { token },
      data: body,
    };
    await apiClient.request(config);
    return {
      success: true as const,
      message: "Password changed successfully.",
    };
  } catch (error) {
    return {
      success: false as const,
      message: getErrorMessage(error, "Failed to change password."),
    };
  }
}
