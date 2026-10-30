"use server";

import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { apiClient } from "@/services/apiClient";
import type { WishlistApiResponse } from "../types/wishlist.types";

export type GetWishlistResult =
  | { success: true; wishlist: WishlistApiResponse }
  | { success: false; message: string };

export async function getWishlistAction(): Promise<GetWishlistResult> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return { success: false, message: "Sign in to view your wishlist." };

  try {
    const { data } = await apiClient.get<WishlistApiResponse>("/wishlist", {
      headers: { token },
    });

    return { success: true, wishlist: data };
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      if (typeof message === "string" && message.trim()) {
        return { success: false, message };
      }
    }

    return { success: false, message: "Your wishlist couldn't be loaded. Please try again." };
  }
}
