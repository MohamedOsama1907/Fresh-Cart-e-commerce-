"use server";

import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { apiClient } from "@/services/apiClient";

export type AddToWishlistResult =
  | { success: true }
  | { success: false; message: string };

export async function addToWishlistAction(productId: string): Promise<AddToWishlistResult> {
  if (!productId.trim()) {
    return { success: false, message: "This product could not be identified." };
  }

  const token = (await cookies()).get("token")?.value;
  if (!token) return { success: false, message: "Sign in to add products to your wishlist." };

  try {
    await apiClient.post(
      "/wishlist",
      { productId },
      { headers: { token, "Content-Type": "application/json" } },
    );

    return { success: true };
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      if (typeof message === "string" && message.trim()) {
        return { success: false, message };
      }
    }

    return { success: false, message: "We couldn't add this product to your wishlist. Please try again." };
  }
}

export async function removeFromWishlistAction(productId: string): Promise<AddToWishlistResult> {
  if (!productId.trim()) {
    return { success: false, message: "This product could not be identified." };
  }

  const token = (await cookies()).get("token")?.value;
  if (!token) return { success: false, message: "Sign in to update your wishlist." };

  try {
    await apiClient.delete(`/wishlist/${encodeURIComponent(productId)}`, {
      headers: { token },
    });

    return { success: true };
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      if (typeof message === "string" && message.trim()) {
        return { success: false, message };
      }
    }

    return { success: false, message: "We couldn't remove this product from your wishlist. Please try again." };
  }
}
