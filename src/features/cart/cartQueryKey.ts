export const cartQueryPrefix = ["getCart"] as const;

export const cartQueryKey = (userId?: string) =>
  [...cartQueryPrefix, userId ?? "authenticated"] as const;
