"use server";

import { cookies } from "next/headers";
import { apiClient } from "@/services/apiClient";
import { isAxiosError, type AxiosRequestConfig } from "axios";
import { verifyToken } from "@/features/auth/server/auth.actions";
import { getAddressById as fetchAddressById } from "../services/getAddressById";
import type {
  AddAddressBody,
  AddressApiResponse,
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

// ─── Addresses ─────────────────────────────────────────────────────────────

export async function getAddresses(): Promise<AddressesApiResponse> {
  const { isAuthenticated } = await verifyToken();
  if (!isAuthenticated) throw new Error("Please sign in to view your addresses.");

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

export async function getAddressById(
  addressId: string,
): Promise<AddressApiResponse> {
  const { isAuthenticated } = await verifyToken();
  if (!isAuthenticated) throw new Error("Please sign in to view this address.");

  const token = (await cookies()).get("token")?.value;
  if (!token) throw new Error("Please sign in to view this address.");
  return fetchAddressById(addressId, token);
}

export async function addAddress(body: AddAddressBody) {
  const { isAuthenticated } = await verifyToken();
  if (!isAuthenticated) return { success: false as const, message: "Please sign in." };

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
  const { isAuthenticated } = await verifyToken();
  if (!isAuthenticated) return { success: false as const, message: "Please sign in." };

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
  const { isAuthenticated } = await verifyToken();
  if (!isAuthenticated) return null;

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
  const { isAuthenticated } = await verifyToken();
  if (!isAuthenticated) return { success: false as const, message: "Please sign in." };

  const token = (await cookies()).get("token")?.value;
  if (!token) return { success: false as const, message: "Please sign in." };

  try {
    const payload: Record<string, string> = {
      name: body.name,
      email: body.email,
    };
    if (body.phone) {
      payload.phone = body.phone;
    }

    const config: AxiosRequestConfig = {
      method: "PUT",
      url: "/users/updateMe",
      headers: { token },
      data: payload,
    };
    const { data } = await apiClient.request<{
      message?: string;
      user?: UpdateProfileBody;
    }>(config);
    return {
      success: true as const,
      message: data.message ?? "Profile updated successfully.",
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
  const { isAuthenticated } = await verifyToken();
  if (!isAuthenticated) return { success: false as const, message: "Please sign in." };

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return { success: false as const, message: "Please sign in." };

  try {
    const config: AxiosRequestConfig = {
      method: "PUT",
      url: "/users/changeMyPassword",
      headers: { token },
      data: body,
    };
    const { data } = await apiClient.request<{
      message?: string;
      token?: string;
    }>(config);

    // The API may issue a fresh token after changing the password.
    if (data.token) {
      cookieStore.set("token", data.token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7 * 30,
      });
    }

    return {
      success: true as const,
      message: data.message ?? "Password changed successfully.",
    };
  } catch (error) {
    return {
      success: false as const,
      message: getErrorMessage(error, "Failed to change password."),
    };
  }
}
