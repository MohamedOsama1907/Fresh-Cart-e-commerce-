"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  applyCartCouponAction,
  clearCartAction,
  removeCartProductAction,
  updateCartProductQuantityAction,
} from "../server/cart.actions";
import { cartQueryKey } from "../cartQueryKey";

function throwOnActionFailure(result: { success: boolean; message?: string }) {
  if (!result.success) throw new Error(result.message || "The cart action failed.");
}

export function useCartMutations(userId?: string) {
  const queryClient = useQueryClient();
  const queryKey = cartQueryKey(userId);

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, count }: { productId: string; count: number }) => {
      const result = await updateCartProductQuantityAction(productId, count);
      throwOnActionFailure(result);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey, exact: true });
    },
    onError: (error) => toast.error(error.message || "The cart quantity couldn't be updated."),
  });

  const removeProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const result = await removeCartProductAction(productId);
      throwOnActionFailure(result);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey, exact: true });
      toast.success("Product removed from your cart.");
    },
    onError: (error) => toast.error(error.message || "This product couldn't be removed from your cart."),
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const result = await clearCartAction();
      throwOnActionFailure(result);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey, exact: true });
      toast.success("Your cart has been cleared.");
    },
    onError: (error) => toast.error(error.message || "Your cart couldn't be cleared."),
  });

  const applyCouponMutation = useMutation({
    mutationFn: async (couponName: string) => {
      const result = await applyCartCouponAction(couponName);
      throwOnActionFailure(result);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey, exact: true });
      toast.success("Coupon applied to your cart.");
    },
    onError: (error) => toast.error(error.message || "The coupon couldn't be applied."),
  });

  return { updateQuantityMutation, removeProductMutation, clearCartMutation, applyCouponMutation };
}
