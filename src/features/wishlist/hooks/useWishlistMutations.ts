"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addToWishlistAction,
  removeFromWishlistAction,
} from "@/features/products/server/addToWishlist.actions";
import { wishlistQueryKey } from "../wishlistQueryKey";

export function useWishlistMutations(userId?: string) {
  const queryClient = useQueryClient();
  const queryKey = wishlistQueryKey(userId);

  const addMutation = useMutation({
    mutationFn: async (productId: string) => {
      const result = await addToWishlistAction(productId);
      if (!result.success) throw new Error(result.message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey, exact: true });
      toast.success("Product added to your wishlist.");
    },
    onError: (error) => toast.error(error.message || "Couldn't add this product to your wishlist."),
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      const result = await removeFromWishlistAction(productId);
      if (!result.success) throw new Error(result.message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey, exact: true });
      toast.success("Product removed from your wishlist.");
    },
    onError: (error) => toast.error(error.message || "Couldn't remove this product from your wishlist."),
  });

  return { addMutation, removeMutation };
}
