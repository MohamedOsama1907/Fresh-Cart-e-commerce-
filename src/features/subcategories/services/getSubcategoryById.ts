import { apiClient } from "@/services/apiClient";
import type { SubcategoryResponse } from "../types/subcategory.types";

export async function getSubcategoryById(
  id: string,
): Promise<SubcategoryResponse> {
  const { data } = await apiClient.get<SubcategoryResponse>(`/subcategories/${id}`);
  return data;
}
