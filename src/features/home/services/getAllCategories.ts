import { apiClient } from "@/services/apiClient";
import type { AxiosRequestConfig } from "axios";
import type { CategoriesApiResponse } from "../types/getAllCategories.types";

export async function getAllCategories(): Promise<CategoriesApiResponse> {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: "/categories",
  };
  const { data } = await apiClient.request<CategoriesApiResponse>(config);
  return data;
}
