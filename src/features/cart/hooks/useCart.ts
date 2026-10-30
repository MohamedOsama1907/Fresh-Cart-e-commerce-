"use client";

import { useQuery } from "@tanstack/react-query";
import { getCartAction } from "../server/cart.actions";
import { cartQueryKey } from "../cartQueryKey";

export function useCart(userId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: cartQueryKey(userId),
    queryFn: async () => {
      const result = await getCartAction();
      if (!result.success) throw new Error(result.message);
      return result.cart;
    },
    enabled,
    staleTime: 30_000,
  });
}
