import type { Product } from "@/features/products/types/productDetails.types";

export type WishlistProduct = Omit<Product, "reviews">;

export interface WishlistApiResponse {
  status: "success";
  count: number;
  data: WishlistProduct[];
}
