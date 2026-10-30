
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
  IconPlus,
  IconRefresh,
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
}from "@tabler/icons-react";
import { Product } from "@/features/home/types/getAllProducts.types";
import { useCartAnimation } from "@/features/cart/components/CartAnimationProvider";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import { useWishlistMutations } from "@/features/wishlist/hooks/useWishlistMutations";
import type { appState } from "@/store/store";
// import { getAllProducts } from "../services/getAllProducts";
// import type { Product } from "../types/getAllProducts.types";

export function RatingStars({
  rating,
  compact = false,
}: {
  rating: number;
  compact?: boolean;
}) {
  const starSize = compact ? 12 : 14;
  const starClassName = compact ? "size-3" : "sm:size-4";

  return (
    <span className="flex items-center gap-0.5 text-amber-400" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => {
        const starNumber = index + 1;
        if (rating >= starNumber) {
          return <IconStarFilled key={index} size={starSize} className={starClassName} />;
        }
        if (rating >= starNumber - 0.5) {
          return <IconStarHalfFilled key={index} size={starSize} className={starClassName} />;
        }
        return <IconStar key={index} size={starSize} className={starClassName} />;
      })}
    </span>
  );
}
export function ProductCard({
  product,
  className,
  compact = false,
}: {
  product: Product;
  className?: string;
  compact?: boolean;
}) {
  const productImageRef = useRef<HTMLImageElement>(null);
  const { addToCart, isBusy } = useCartAnimation();
  const { isAuthenticated, user } = useSelector((state: appState) => state.authReducer);
  const wishlistUserId = user?.id ?? user?.email;
  const wishlistQuery = useWishlist(wishlistUserId, isAuthenticated);
  const { addMutation, removeMutation } = useWishlistMutations(wishlistUserId);
  const isWishlisted =
    isAuthenticated &&
    (wishlistQuery.data?.data.some((wishlistProduct) => wishlistProduct._id === product._id) ?? false);
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

    if (isWishlisted) removeMutation.mutate(product._id);
    else addMutation.mutate(product._id);
  };
  const discountPrice = product.priceAfterDiscount;
  const hasDiscount =
    typeof discountPrice === "number" &&
    product.price > 0 &&
    discountPrice < product.price;
  const displayPrice = hasDiscount
    ? discountPrice
    : product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - discountPrice) / product.price) * 100)
    : 0;

  return (
    <article
      className={`overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md ${
        className ?? ""
      }`}
    >
      <div className="relative aspect-square">
        <Link
          href={`/products/${product._id}`}
          aria-label={`View ${product.title}`}
          className="absolute inset-0"
        >
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            unoptimized
            sizes={
              compact
                ? "(max-width: 429px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) 25vw, 20vw"
                : "(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
            }
            className={`object-contain ${compact ? "p-3" : "p-4 sm:p-5"}`}
            ref={productImageRef}
          />
        </Link>

        {hasDiscount && (
          <span className={`absolute z-10 rounded-md bg-rose-500 font-semibold text-white shadow-sm ${compact ? "left-2 top-2 px-1.5 py-0.5 text-[10px]" : "left-3 top-3 px-2 py-1 text-xs"}`}>
            -{discountPercentage}%
          </span>
        )}

        <div className={`absolute flex flex-col ${compact ? "right-2 top-2 gap-1.5" : "right-3 top-3 gap-2.5"}`}>
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
            className={`flex items-center justify-center rounded-full border bg-white shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-wait disabled:opacity-60 ${compact ? "size-8" : "size-10"} ${isWishlisted ? "border-rose-100 text-rose-500 hover:bg-rose-50" : "border-slate-100 text-slate-600 hover:text-rose-500"}`}
          >
            {isWishlisted ? (
              <IconHeartFilled size={compact ? 15 : 18} aria-hidden="true" />
            ) : (
              <IconHeart size={compact ? 15 : 18} stroke={2} aria-hidden="true" />
            )}
          </button>
          {[IconRefresh].map((Icon, index) => (
            <span
              key={index}
              aria-hidden="true"
              className={`flex items-center justify-center rounded-full border border-slate-100 bg-white text-slate-600 shadow-sm ${compact ? "size-8" : "size-10"}`}
            >
              <Icon size={compact ? 15 : 18} className={compact ? "size-[15px]" : "sm:size-5"} stroke={2} />
            </span>
          ))}
          <Link
            href={`/products/${product._id}`}
            aria-label={`View ${product.title} details`}
            className={`flex items-center justify-center rounded-full border border-slate-100 bg-white text-slate-600 shadow-sm transition-colors hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${compact ? "size-8" : "size-10"}`}
          >
            <IconEye size={compact ? 15 : 18} className={compact ? "size-[15px]" : "sm:size-5"} stroke={2} />
          </Link>
        </div>
      </div>

      <div className={`flex flex-col ${compact ? "min-h-[126px] px-3 pb-3 pt-1.5" : "min-h-[158px] px-4 pb-4 pt-2 sm:px-5"}`}>
        <p className={`truncate font-medium text-slate-500 ${compact ? "text-[10px]" : "text-[11px] sm:text-xs lg:text-sm"}`}>
          {product.category.name}
        </p>
        <Link
          href={`/products/${product._id}`}
          className={`mt-1 line-clamp-2 font-medium text-slate-700 hover:text-primary-700 ${compact ? "min-h-8 text-xs leading-4 sm:text-sm" : "min-h-10 text-sm leading-5 sm:text-base sm:leading-6 lg:text-lg"}`}
        >
          {product.title}
        </Link>

        <div className={`mt-2 flex min-w-0 flex-nowrap items-center gap-1 ${compact ? "gap-0.5" : ""}`}>
          <span className="shrink-0">
            <RatingStars rating={product.ratingsAverage} compact={compact} />
          </span>
          <span className={`shrink-0 whitespace-nowrap text-slate-500 ${compact ? "text-[9px]" : "text-[10px] sm:text-[11px] lg:text-xs"}`}>
            {product.ratingsAverage} ({product.ratingsQuantity})
          </span>
        </div>

        <div className={`mt-auto flex items-end justify-between pt-3 ${compact ? "gap-1.5" : "gap-3"}`}>
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span
              className={`font-bold ${compact ? "text-sm sm:text-base" : "text-base sm:text-lg lg:text-xl"} ${
                hasDiscount ? "text-primary-600" : "text-slate-800"
              }`}
            >
              {displayPrice.toLocaleString("en-US")} EGP
            </span>
            {hasDiscount && (
              <span className={`text-slate-500 line-through ${compact ? "text-[10px]" : "text-xs sm:text-sm"}`}>
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
              addToCart(product._id, product.imageCover, productImageRef.current, event.currentTarget)
            }
            className={`flex shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:cursor-wait disabled:opacity-70 ${compact ? "size-9" : "size-11"}`}
          >
            <span className="sr-only">Add to cart</span>
            <IconPlus size={compact ? 18 : 20} className={compact ? "size-[18px]" : "sm:size-[22px] lg:size-6"} stroke={2.5} />
          </button>
        </div>
      </div>
    </article>
  );
}
