import { apiClient } from "@/services/apiClient";
import type { Review } from "../types/productDetails.types";

export async function getReviewById(reviewId: string): Promise<Review> {
  const { data } = await apiClient.get<{ data: Review }>(
    `/reviews/${encodeURIComponent(reviewId)}`,
  );

  if (data.data._id !== reviewId) {
    throw new Error("The requested review could not be found.");
  }

  return data.data;
}
