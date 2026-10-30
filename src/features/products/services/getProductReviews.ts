import { apiClient } from "@/services/apiClient";
import type { ProductReviewsApiResponse } from "../types/productDetails.types";

const REVIEWS_PER_PAGE = 5;

export async function getProductReviews(
  productId: string,
  page: number,
): Promise<ProductReviewsApiResponse> {
  const { data } = await apiClient.get<ProductReviewsApiResponse>(
    `/products/${productId}/reviews`,
    { params: { page, limit: REVIEWS_PER_PAGE } },
  );

  return data;
}
