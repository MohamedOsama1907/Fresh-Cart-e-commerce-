"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserOrdersAction } from "../server/orders.actions";

export function useUserOrders(userId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ["getUserOrders", userId],
    queryFn: async () => {
      if (!userId) throw new Error("Your account could not be identified.");
      const result = await getUserOrdersAction(userId);
      if (!result.success) throw new Error(result.message);
      return result.orders;
    },
    enabled: Boolean(enabled && userId),
    staleTime: 30_000,
  });
}
