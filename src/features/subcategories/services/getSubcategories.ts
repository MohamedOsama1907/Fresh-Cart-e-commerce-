import { apiClient } from "@/services/apiClient";
import type { SubcategoriesResponse } from "../types/subcategory.types";

export async function getSubcategories(
  page: number,
  limit = 10,
): Promise<SubcategoriesResponse> {
  const { data } = await apiClient.get<SubcategoriesResponse>("/subcategories", {
    params: { page, limit },
  });
  return data;
}
