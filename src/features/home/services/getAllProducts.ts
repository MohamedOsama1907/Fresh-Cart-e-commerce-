import { apiClient } from "@/services/apiClient";
import type { AxiosRequestConfig } from "axios";
import type { ProductsApiResponse } from "../types/getAllProducts.types";

export async function getAllProducts(
  page = 1,
  limit = 40,
): Promise<ProductsApiResponse> {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: "/products",
    params: { page, limit },
  };

  const { data } = await apiClient.request<ProductsApiResponse>(config);
  return data;
}
