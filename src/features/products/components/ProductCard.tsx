"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import {
  IconEye,
  IconHeart,
  IconHeartFilled,
  IconPhoto,
  IconPlus,
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
} from "@tabler/icons-react";
import { Product } from "@/features/home/types/getAllProducts.types";
import { useCartAnimation } from "@/features/cart/components/CartAnimationProvider";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import { useWishlistMutations } from "@/features/wishlist/hooks/useWishlistMutations";
import type { appState } from "@/store/store";

export function RatingStars({
  rating,
  compact = false,
}: {
  rating: number;
  compact?: boolean;
}) {
  const starSize = compact ? 12 : 14;

  return (
    <span
      className="flex items-center gap-0.5 text-amber-400"
      aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => {
        const starNumber = index + 1;
        if (rating >= starNumber) {
          return (
            <IconStarFilled
              key={index}
              size={starSize}
            />
          );
        }
        if (rating >= starNumber - 0.5) {
          return (
            <IconStarHalfFilled
              key={index}
              size={starSize}
            />
          );
        }
        return (
          <IconStar key={index} size={starSize} />
        );
      })}
    </span>
  );
}

export function ProductCard({
  product,
  className,
  compact = false,
  layout = "grid",
}: {
  product: Product;
  className?: string;
  compact?: boolean;
  layout?: "grid" | "list";
}) {
  const isList = layout === "list";
  const productImageRef = useRef<HTMLImageElement>(null);
  const { addToCart, isBusy } = useCartAnimation();
  const { isAuthenticated, user } = useSelector(
    (state: appState) => state.authReducer,
  );
  const wishlistUserId = user?.id ?? user?.email;
  const wishlistQuery = useWishlist(wishlistUserId, isAuthenticated);
  const { addMutation, removeMutation } = useWishlistMutations(wishlistUserId);
  const isWishlisted = Boolean(
    isAuthenticated &&
    wishlistQuery.data?.data?.some((item) => item._id === product._id)
  );
  const isWishlistMutationPending =
    (addMutation.isPending && addMutation.variables === product._id) ||
    (removeMutation.isPending && removeMutation.variables === product._id);
  const isWishlistLoading = isAuthenticated && wishlistQuery.isPending;

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      toast.error("Sign in to manage your wishlist.");
      return;
    }
    if (wishlistQuery.isError) {
      void wishlistQuery.refetch();
      return;
    }
    if (wishlistQuery.isPending || isWishlistMutationPending) return;

    if (isWishlisted) {
      removeMutation.mutate(product._id);
    } else {
      addMutation.mutate(product._id);
    }
  };

  const hasDiscount = Boolean(
    product.priceAfterDiscount && product.priceAfterDiscount > 0 && product.priceAfterDiscount < product.price
  );
  const displayPrice = hasDiscount ? product.priceAfterDiscount! : product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100)
    : 0;
  const hasRating = Boolean(
    typeof product.ratingsAverage === "number" && typeof product.ratingsQuantity === "number"
  );

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-200 hover:border-primary-300 hover:shadow-md ${
        isList
          ? "flex flex-row items-stretch"
          : "flex flex-col hover:-translate-y-1"
      } ${className ?? ""}`}>
      {/* Image Container */}
      <div
        className={`relative overflow-hidden bg-slate-50/50 ${
          isList
            ? "my-3 ml-3 size-28 shrink-0 rounded-xl border border-slate-100 sm:my-4 sm:ml-4 sm:size-36 md:size-40"
            : "aspect-square w-full"
        }`}>
        <Link
          href={`/products/${product._id}`}
          aria-label={`View ${product.title}`}
          className="absolute inset-0 z-0">
          {product.imageCover ? (
            <Image
              src={product.imageCover}
              alt=""
              fill
              unoptimized
              sizes={
                isList
                  ? "(max-width: 639px) 112px, 160px"
                  : compact
                  ? "(max-width: 479px) 50vw, (max-width: 767px) 33vw, 25vw"
                  : "(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
              }
              className={`object-contain transition-transform duration-300 group-hover:scale-105 ${compact ? "p-3" : "p-4 sm:p-5"}`}
              ref={productImageRef}
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center bg-slate-50 text-slate-300">
              <IconPhoto size={compact ? 36 : 48} stroke={1.5} aria-hidden="true" />
            </span>
          )}
        </Link>

        {/* Discount Badge */}
        {hasDiscount && (
          <span
            className={`absolute z-10 rounded-lg bg-rose-600 font-extrabold text-white shadow-xs ${
              compact ? "left-2 top-2 px-1.5 py-0.5 text-[10px]" : "left-3 top-3 px-2 py-1 text-xs"
            }`}>
            -{discountPercentage}%
          </span>
        )}

        {/* Floating Actions */}
        <div
          className={`absolute z-10 flex flex-col gap-1.5 ${
            compact ? "right-2 top-2" : "right-3 top-3"
          }`}>
          <button
            type="button"
            aria-label={
              wishlistQuery.isError
                ? `Retry loading wishlist for ${product.title}`
                : isWishlisted
                  ? `Remove ${product.title} from wishlist`
                  : `Add ${product.title} to wishlist`
            }
            aria-pressed={isWishlisted}
            aria-busy={isWishlistLoading || isWishlistMutationPending}
            disabled={isWishlistLoading || isWishlistMutationPending}
            onClick={handleWishlistClick}
            className={`flex items-center justify-center rounded-full border bg-white/95 shadow-xs backdrop-blur-xs transition hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-wait disabled:opacity-60 ${
              compact ? "size-8" : "size-9"
            } ${
              isWishlisted
                ? "border-rose-200 text-rose-600 hover:bg-rose-50"
                : "border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200"
            }`}>
            {isWishlisted ? (
              <IconHeartFilled size={compact ? 15 : 17} aria-hidden="true" />
            ) : (
              <IconHeart size={compact ? 15 : 17} stroke={2} aria-hidden="true" />
            )}
          </button>

          <Link
            href={`/products/${product._id}`}
            aria-label={`View ${product.title} details`}
            className={`flex items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-600 shadow-xs backdrop-blur-xs transition hover:scale-105 hover:border-primary-300 hover:text-primary-600 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
              compact ? "size-8" : "size-9"
            }`}>
            <IconEye size={compact ? 15 : 17} stroke={2} />
          </Link>
        </div>
      </div>

      {/* Product Information */}
      <div
        className={`flex min-w-0 flex-1 flex-col ${
          isList ? "py-3 pl-1 pr-3 sm:py-4 sm:pl-2 sm:pr-5" : compact ? "p-3 pt-2" : "p-4 sm:p-5"
        }`}>
        {product.category?.name && (
          <p
            className={`truncate font-semibold uppercase tracking-wider text-slate-400 ${
              compact ? "text-[10px]" : "text-xs"
            }`}>
            {product.category.name}
          </p>
        )}

        <Link
          href={`/products/${product._id}`}
          className={`mt-1 line-clamp-2 font-bold text-slate-800 transition-colors hover:text-primary-600 ${
            isList
              ? "text-sm leading-5 sm:text-base sm:leading-6"
              : compact
                ? "text-xs leading-4 min-h-8"
                : "text-sm leading-5 sm:text-base sm:leading-6 min-h-10"
          }`}>
          {product.title}
        </Link>

        {hasRating && (
          <div className="mt-2 flex items-center gap-1.5">
            <RatingStars rating={product.ratingsAverage!} compact={compact} />
            <span
              className={`font-semibold text-slate-500 ${
                compact ? "text-[10px]" : "text-xs"
              }`}>
              {product.ratingsAverage} <span className="font-normal text-slate-400">({product.ratingsQuantity})</span>
            </span>
          </div>
        )}

        {/* Price & Add to Cart Footer */}
        <div
          className={`mt-auto flex items-end justify-between pt-3.5 ${
            compact ? "gap-2" : "gap-3"
          }`}>
          <div className="flex flex-col min-w-0">
            <span
              className={`font-extrabold tracking-tight ${
                compact ? "text-sm sm:text-base" : "text-base sm:text-lg"
              } ${hasDiscount ? "text-primary-700" : "text-slate-900"}`}>
              {displayPrice.toLocaleString("en-US")} <span className="text-xs font-semibold text-slate-500">EGP</span>
            </span>
            {hasDiscount && (
              <span
                className={`text-slate-400 line-through ${
                  compact ? "text-[10px]" : "text-xs"
                }`}>
                {product.price.toLocaleString("en-US")} EGP
              </span>
            )}
          </div>

          <button
            type="button"
            aria-label={`Add ${product.title} to cart`}
            aria-busy={isBusy}
            disabled={isBusy}
            onClick={(event) =>
              addToCart(
                product._id,
                product.imageCover ?? "",
                productImageRef.current,
                event.currentTarget,
              )
            }
            className={`flex shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-xs transition hover:bg-primary-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:cursor-wait disabled:opacity-60 ${
              isList ? "h-9 gap-1.5 px-3" : compact ? "size-8" : "size-10"
            }`}>
            <span className={isList ? "text-xs font-bold" : "sr-only"}>Add to cart</span>
            <IconPlus
              size={isList || compact ? 17 : 20}
              stroke={2.5}
            />
          </button>
        </div>
      </div>
    </article>
  );
}
