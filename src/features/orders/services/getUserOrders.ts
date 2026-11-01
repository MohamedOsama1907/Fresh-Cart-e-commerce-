import { apiClient } from "@/services/apiClient";
import type { UserOrdersApiResponse } from "../types/order.types";

export async function getUserOrders(
  userId: string,
  token: string,
): Promise<UserOrdersApiResponse> {
  const { data } = await apiClient.get<UserOrdersApiResponse>(
    `/orders/user/${encodeURIComponent(userId)}`,
    { headers: { token } },
  );

  return data;
}
