import { apiClient } from "@/services/apiClient";
import type { ProductsApiResponse } from "@/features/home/types/getAllProducts.types";

export async function getProductsByBrand(
  brandId: string,
  page = 1,
  limit = 10,
): Promise<ProductsApiResponse> {
  const { data } = await apiClient.get<ProductsApiResponse>("/products", {
    params: { brand: brandId, page, limit },
  });
  return data;
}
