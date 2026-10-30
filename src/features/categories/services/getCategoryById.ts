import { apiClient } from "@/services/apiClient";
import type { CategoryResponse } from "../types/specificCategory.types";

export async function getCategoryById(id: string): Promise<CategoryResponse> {
  const { data } = await apiClient.get<CategoryResponse>(`/categories/${id}`);
  return data;
}
