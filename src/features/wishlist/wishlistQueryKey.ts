export const wishlistQueryKey = (userId?: string) =>
  ["getWishlist", userId ?? "authenticated"] as const;
