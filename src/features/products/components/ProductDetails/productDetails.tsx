"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import {
  IconBolt,
  IconCheck,
  IconHeart,
  IconHeartFilled,
  IconMinus,
  IconPlus,
  IconShare,
  IconShoppingCart,
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
} from "@tabler/icons-react";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import ProductGallery from "./productGallery";
import ProductInformationTabs from "./productInformationTabs";
import { getProductDetails } from "../../services/getProductDetails";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import { useWishlistMutations } from "@/features/wishlist/hooks/useWishlistMutations";
import type { appState } from "@/store/store";
import { useCartAnimation } from "@/features/cart/components/CartAnimationProvider";

interface ProductDetailsScreenProps {
  productId: string;
}

export default function ProductDetailsScreen({ productId }: ProductDetailsScreenProps) {
  const productImageRef = useRef<HTMLImageElement>(null);
  const { addToCart, isBusy: isCartBusy } = useCartAnimation();
  const [quantityState, setQuantityState] = useState({ productId, quantity: 1 });
  const { isAuthenticated, user } = useSelector((state: appState) => state.authReducer);
  const wishlistQuery = useWishlist(user?.id ?? user?.email, isAuthenticated);
  const { addMutation, removeMutation } = useWishlistMutations(user?.id ?? user?.email);
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["getProductDetails", productId],
    queryFn: () => getProductDetails(productId),
    enabled: Boolean(productId),
    refetchOnMount: false,
  });
  if (isLoading) return <Loader message="Loading product details..." />;

  if (isError) {
    return (
      <Error
        title="Product details are unavailable"
        message={error.message}
        onRetry={() => void refetch()}
      />
    );
  }

  const product = data?.data;
  if (!product) return null;

  const isWishlisted = isAuthenticated && (wishlistQuery.data?.data.some((item) => item._id === product._id) ?? false);
  const isWishlistLoading = isAuthenticated && wishlistQuery.isPending;
  const isWishlistMutationPending =
    (addMutation.isPending && addMutation.variables === product._id) ||
    (removeMutation.isPending && removeMutation.variables === product._id);
  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      toast.error("Sign in to manage your wishlist.");
      return;
    }
    if (wishlistQuery.isError) {
      void wishlistQuery.refetch();
      return;
    }
    if (wishlistQuery.isPending) return;

    if (isWishlisted) removeMutation.mutate(product._id);
    else addMutation.mutate(product._id);
  };

  const quantity = quantityState.productId === product._id ? quantityState.quantity : 1;
  const updateQuantity = (nextQuantity: number) => {
    setQuantityState({ productId: product._id, quantity: nextQuantity });
  };

  const fullStars = Math.floor(product.ratingsAverage);
  const hasHalfStar = product.ratingsAverage - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <main className="container mx-auto min-h-[60vh] py-6 sm:py-8" aria-busy={isFetching}>
      <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(290px,0.8fr)_minmax(0,2.2fr)] lg:gap-7">
        <section
          aria-label={`${product.title} image gallery`}
          className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm sm:p-5"
        >
          <ProductGallery product={product} onMainImageRef={(image) => { productImageRef.current = image; }} />
        </section>

        <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/categories/${product.category._id}`}
              className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              {product.category.name}
            </Link>
            <Link
              href={`/brands/${product.brand._id}`}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              {product.brand.name}
            </Link>
          </div>

          <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
            {product.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="flex items-center gap-0.5 text-amber-400" aria-hidden="true">
              {Array.from({ length: fullStars }, (_, index) => (
                <IconStarFilled key={`full-${index}`} size={18} aria-hidden="true" />
              ))}
              {hasHalfStar && <IconStarHalfFilled size={18} aria-hidden="true" />}
              {Array.from({ length: emptyStars }, (_, index) => (
                <IconStar key={`empty-${index}`} size={18} aria-hidden="true" />
              ))}
            </span>
            <span className="text-sm text-slate-500" aria-label={`Rated ${product.ratingsAverage} out of 5 stars`}>
              {product.ratingsAverage.toFixed(1)} ({product.ratingsQuantity} reviews)
            </span>
          </div>

          <p className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
            {product.price.toLocaleString("en-US")} EGP
          </p>

          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700">
            <IconCheck size={16} aria-hidden="true" />
            {product.quantity > 0 ? "In Stock" : "Out of Stock"}
          </p>

          <div className="mt-5 border-t border-slate-200 pt-5">
            <h2 className="sr-only">Product description</h2>
            <p className="text-sm leading-6 text-slate-600 sm:text-base">
              {product.description.replace(/\s+/g, " ").trim()}
            </p>
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium text-slate-700" htmlFor="product-quantity">
              Quantity
            </label>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <div className="inline-flex h-12 items-center rounded-lg border border-slate-200">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1 || product.quantity <= 0}
                  onClick={() => updateQuantity(Math.max(1, quantity - 1))}
                  className="flex h-full w-12 items-center justify-center rounded-l-lg text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <IconMinus size={18} aria-hidden="true" />
                </button>
                <output id="product-quantity" aria-live="polite" className="min-w-10 text-center text-sm font-medium text-slate-900">
                  {quantity}
                </output>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantity >= product.quantity || product.quantity <= 0}
                  onClick={() => updateQuantity(Math.min(product.quantity, quantity + 1))}
                  className="flex h-full w-12 items-center justify-center rounded-r-lg text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <IconPlus size={20} aria-hidden="true" />
                </button>
              </div>
              <p className="text-sm text-slate-500">
                {product.quantity} available
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-4 py-4 sm:px-5">
            <span className="text-sm font-medium text-slate-700">Total Price:</span>
            <span className="text-lg font-bold text-primary-700 sm:text-xl">
              {(product.price * quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })} EGP
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={product.quantity <= 0 || isCartBusy}
              aria-busy={isCartBusy}
              onClick={(event) =>
                addToCart(product._id, product.imageCover, productImageRef.current, event.currentTarget)
              }
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <IconShoppingCart size={19} aria-hidden="true" />
              {isCartBusy ? "Adding to Cart…" : "Add to Cart"}
            </button>
            <button
              type="button"
              disabled={product.quantity <= 0}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <IconBolt size={19} fill="currentColor" aria-hidden="true" />
              Buy Now
            </button>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              aria-label={wishlistQuery.isError ? "Retry loading wishlist" : isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={isWishlisted}
              aria-live="polite"
              disabled={isWishlistLoading || isWishlistMutationPending}
              onClick={handleWishlistClick}
              className={`inline-flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-wait disabled:opacity-60 ${isWishlisted ? "border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100" : "border-slate-200 text-slate-700 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"}`}
            >
              {isWishlisted ? <IconHeartFilled size={18} aria-hidden="true" /> : <IconHeart size={18} aria-hidden="true" />}
              {!isAuthenticated
                ? "Add to Wishlist"
                : isWishlistLoading
                ? "Loading wishlist…"
                : wishlistQuery.isError
                  ? "Retry wishlist"
                  : isWishlistMutationPending
                    ? isWishlisted ? "Removing…" : "Adding…"
                    : isWishlisted
                      ? "In Wishlist"
                      : "Add to Wishlist"}
            </button>
            <button
              type="button"
              aria-label="Share product"
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              <IconShare size={18} aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>

      <ProductInformationTabs key={product._id} product={product} />
    </main>
  );
}
