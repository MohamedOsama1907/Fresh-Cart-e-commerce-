import { apiClient } from "@/services/apiClient";
import type { AxiosRequestConfig } from "axios";
import type { ProductsApiResponse } from "../types/getAllProducts.types";

export interface ProductQueryFilters {
  sort?: string;
  fields?: string;
  minPrice?: string;
  maxPrice?: string;
  brand?: string;
  categories?: string[];
  keyword: string;
}

export async function getAllProducts(
  page = 1,
  limit = 40,
  filters?: ProductQueryFilters | string,
): Promise<ProductsApiResponse> {
  const normalizedFilters: ProductQueryFilters | undefined =
    typeof filters === "string"
      ? { sort: filters, keyword: "" }
      : filters;
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });

  if (normalizedFilters?.sort) params.append("sort", normalizedFilters.sort);
  if (normalizedFilters?.fields) params.append("fields", normalizedFilters.fields);
  if (normalizedFilters?.minPrice) {
    params.append("price[gte]", normalizedFilters.minPrice);
  }
  if (normalizedFilters?.maxPrice) {
    params.append("price[lte]", normalizedFilters.maxPrice);
  }
  if (normalizedFilters?.brand) params.append("brand", normalizedFilters.brand);
  normalizedFilters?.categories?.forEach((categoryId) => {
    if (categoryId) params.append("category[in]", categoryId);
  });
  if (normalizedFilters?.keyword?.trim()) {
    params.append("keyword", normalizedFilters.keyword.trim());
  }

  const config: AxiosRequestConfig = {
    method: "GET",
    url: `/products?${params.toString()}`,
  };

  const { data } = await apiClient.request<ProductsApiResponse>(config);
  return data;
}
