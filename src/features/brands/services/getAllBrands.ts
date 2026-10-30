import { apiClient } from "@/services/apiClient";
import type { AxiosRequestConfig } from "axios";
import type { BrandsApiResponse } from "../types/brands.types";

export async function getAllBrands(
  page = 1,
  limit = 10,
): Promise<BrandsApiResponse> {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: "/brands",
    params: { page, limit },
  };

  const { data } = await apiClient.request<BrandsApiResponse>(config);
  return data;
}
