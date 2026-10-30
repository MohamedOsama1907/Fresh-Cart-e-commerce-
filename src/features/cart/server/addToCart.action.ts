"use server";

import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { apiClient } from "@/services/apiClient";

export type AddToCartResult =
  | { success: true }
  | { success: false; message: string };

export async function addToCartAction(productId: string): Promise<AddToCartResult> {
  if (!productId.trim()) {
    return { success: false, message: "This product could not be identified." };
  }

  const token = (await cookies()).get("token")?.value;
  if (!token) return { success: false, message: "Sign in to add products to your cart." };

  try {
    await apiClient.post(
      "https://ecommerce.routemisr.com/api/v2/cart",
      { productId },
      {
        headers: {
          token,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return { success: true };
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      if (typeof message === "string" && message.trim()) {
        return { success: false, message };
      }
    }
    return { success: false, message: "We couldn't add this product to your cart. Please try again." };
  }
}
