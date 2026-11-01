"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cartQueryKey } from "@/features/cart/cartQueryKey";
import { createCashOrderAction } from "../server/checkout.actions";
import type { CreateCashOrderInput } from "../types/checkout.types";

export function useCreateCashOrder(userId?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: CreateCashOrderInput) => {
      const result = await createCashOrderAction(input);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: cartQueryKey(userId),
          exact: true,
        }),
        queryClient.invalidateQueries({
          queryKey: ["getUserOrders", userId],
          exact: true,
        }),
      ]);
      toast.success(result.message);
      router.replace("/myorders");
    },
    onError: (error) => {
      toast.error(error.message || "Your order couldn't be placed.");
    },
  });
}
