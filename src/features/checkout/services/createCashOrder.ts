import { apiClient } from "@/services/apiClient";
import type { CreateCashOrderInput } from "../types/checkout.types";

const ordersEndpoint = "https://ecommerce.routemisr.com/api/v2/orders";

export async function createCashOrder(
  input: CreateCashOrderInput,
  token: string,
): Promise<unknown> {
  const { data } = await apiClient.post<unknown>(
    `${ordersEndpoint}/${encodeURIComponent(input.cartId)}`,
    { shippingAddress: input.shippingAddress },
    { headers: { token, "Content-Type": "application/json" } },
  );

  return data;
}
