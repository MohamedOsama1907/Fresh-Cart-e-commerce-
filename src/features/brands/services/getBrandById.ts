import { apiClient } from "@/services/apiClient";
import type { BrandResponse } from "../types/brands.types";

export async function getBrandById(id: string): Promise<BrandResponse> {
  const { data } = await apiClient.get<BrandResponse>(`/brands/${id}`);
  return data;
}
