"use server";

import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { getUserOrders } from "../services/getUserOrders";
import { verifyToken } from "@/features/auth/server/auth.actions";
import type { UserOrder, UserOrdersApiResponse } from "../types/order.types";

export type GetUserOrdersResult =
  | { success: true; orders: UserOrdersApiResponse }
  | { success: false; message: string };

export type GetSpecificOrderResult =
  | { success: true; order: UserOrder }
  | { success: false; message: string; notFound?: boolean; unauthorized?: boolean };

export async function getUserOrdersAction(
  userId?: string,
): Promise<GetUserOrdersResult> {
  const { isAuthenticated, user } = await verifyToken();
  if (!isAuthenticated || !user?.id) {
    return { success: false, message: "Please sign in to view your orders." };
  }

  // Enforce authorization: prevent users from accessing orders belonging to another userId
  if (userId && userId.trim() !== user.id) {
    return {
      success: false,
      message: "You are not authorized to view orders for this user.",
    };
  }

  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return { success: false, message: "Please sign in to view your orders." };
  }

  try {
    const orders = await getUserOrders(user.id, token);
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

export async function getOrderByIdAction(
  orderId: string,
): Promise<GetSpecificOrderResult> {
  const normalizedOrderId = orderId?.trim();
  if (!normalizedOrderId) {
    return { success: false, message: "Invalid order ID." };
  }

  const { isAuthenticated, user } = await verifyToken();
  if (!isAuthenticated || !user?.id) {
    return {
      success: false,
      message: "Please sign in to view your order.",
      unauthorized: true,
    };
  }

  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return {
      success: false,
      message: "Please sign in to view your order.",
      unauthorized: true,
    };
  }

  try {
    const response = await getUserOrders(user.id, token);
    const orders: UserOrder[] = Array.isArray(response)
      ? response
      : response?.data ?? [];

    const foundOrder = orders.find(
      (order) =>
        order._id === normalizedOrderId ||
        (order as unknown as { id?: string }).id === normalizedOrderId,
    );

    if (!foundOrder) {
      return {
        success: false,
        message: "Order not found or you are not authorized to view this order.",
        notFound: true,
      };
    }

    return { success: true, order: foundOrder };
  } catch (error) {
    const message = isAxiosError(error) ? error.response?.data?.message : null;
    return {
      success: false,
      message:
        typeof message === "string" && message.trim()
          ? message
          : "Your order couldn't be loaded. Please try again.",
    };
  }
}
