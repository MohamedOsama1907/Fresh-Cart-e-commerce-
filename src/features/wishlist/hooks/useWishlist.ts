"use client";

import { useQuery } from "@tanstack/react-query";
import { getWishlistAction } from "../server/getWishlist.actions";
import { wishlistQueryKey } from "../wishlistQueryKey";

export function useWishlist(userId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: wishlistQueryKey(userId),
    queryFn: async () => {
      const result = await getWishlistAction();
      if (!result.success) throw new Error(result.message);
      return result.wishlist;
    },
    enabled,
    staleTime: 30_000,
  });
}
