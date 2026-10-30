import { apiClient } from "@/services/apiClient";
import type { ProductDetailsApiResponse } from "../types/productDetails.types";

export async function getProductDetails(
  productId: string,
): Promise<ProductDetailsApiResponse> {
  const { data } = await apiClient.get<ProductDetailsApiResponse>(
    `/products/${productId}`,
  );
  return data;
}
