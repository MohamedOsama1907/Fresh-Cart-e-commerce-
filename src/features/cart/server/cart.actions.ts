"use server";

import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { apiClient } from "@/services/apiClient";
import type { CartApiResponse } from "../types/cart.types";

export type CartActionResult =
  | { success: true; message?: string }
  | { success: false; message: string };

export type GetCartResult =
  | { success: true; cart: CartApiResponse }
  | { success: false; message: string };

const cartEndpoint = "https://ecommerce.routemisr.com/api/v2/cart";

async function getToken() {
  return (await cookies()).get("token")?.value;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}

export async function getCartAction(): Promise<GetCartResult> {
  const token = await getToken();
  if (!token) return { success: false, message: "Sign in to view your cart." };

  try {
    const { data } = await apiClient.get<CartApiResponse>(cartEndpoint, {
      headers: { token },
    });
    return { success: true, cart: data };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Your cart couldn't be loaded. Please try again."),
    };
  }
}

export async function updateCartProductQuantityAction(
  productId: string,
  count: number,
): Promise<CartActionResult> {
  if (!productId.trim() || !Number.isInteger(count) || count < 1) {
    return { success: false, message: "Choose a valid product quantity." };
  }

  const token = await getToken();
  if (!token) return { success: false, message: "Sign in to update your cart." };

  try {
    await apiClient.put(
      `${cartEndpoint}/${encodeURIComponent(productId)}`,
      { count },
      { headers: { token, "Content-Type": "application/json" } },
    );
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "The cart quantity couldn't be updated. Please try again."),
    };
  }
}

export async function removeCartProductAction(productId: string): Promise<CartActionResult> {
  if (!productId.trim()) {
    return { success: false, message: "This cart product could not be identified." };
  }

  const token = await getToken();
  if (!token) return { success: false, message: "Sign in to update your cart." };

  try {
    await apiClient.delete(`${cartEndpoint}/${encodeURIComponent(productId)}`, {
      headers: { token },
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "This product couldn't be removed from your cart. Please try again."),
    };
  }
}

export async function clearCartAction(): Promise<CartActionResult> {
  const token = await getToken();
  if (!token) return { success: false, message: "Sign in to clear your cart." };

  try {
    await apiClient.delete(cartEndpoint, { headers: { token } });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Your cart couldn't be cleared. Please try again."),
    };
  }
}

export async function applyCartCouponAction(couponName: string): Promise<CartActionResult> {
  const normalizedCouponName = couponName.trim();
  if (!normalizedCouponName) {
    return { success: false, message: "Enter a coupon code to apply." };
  }

  const token = await getToken();
  if (!token) return { success: false, message: "Sign in to apply a coupon to your cart." };

  try {
    await apiClient.put(
      `${cartEndpoint}/applyCoupon`,
      { couponName: normalizedCouponName },
      { headers: { token, "Content-Type": "application/json" } },
    );
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "The coupon couldn't be applied. Check the code and try again."),
    };
  }
}
