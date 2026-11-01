"use server";

import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { getUserOrders } from "../services/getUserOrders";
import type { UserOrdersApiResponse } from "../types/order.types";

export type GetUserOrdersResult =
  | { success: true; orders: UserOrdersApiResponse }
  | { success: false; message: string };

export async function getUserOrdersAction(
  userId: string,
): Promise<GetUserOrdersResult> {
  const normalizedUserId = userId.trim();
  if (!normalizedUserId) {
    return { success: false, message: "Your account could not be identified." };
  }

  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return { success: false, message: "Please sign in to view your orders." };
  }

  try {
    const orders = await getUserOrders(normalizedUserId, token);
    return { success: true, orders };
  } catch (error) {
    const message = isAxiosError(error) ? error.response?.data?.message : null;
    return {
      success: false,
      message:
        typeof message === "string" && message.trim()
          ? message
          : "Your orders couldn't be loaded. Please try again.",
    };
  }
}
