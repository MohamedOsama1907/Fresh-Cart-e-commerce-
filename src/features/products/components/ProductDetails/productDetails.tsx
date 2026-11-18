"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import {
  IconBolt,
  IconCheck,
  IconChevronRight,
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

export default function ProductDetailsScreen({
  productId,
}: ProductDetailsScreenProps) {
  const router = useRouter();
  const productImageRef = useRef<HTMLImageElement>(null);
  const { addToCart, isBusy: isCartBusy } = useCartAnimation();
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated, user } = useSelector(
    (state: appState) => state.authReducer,
  );
  const wishlistQuery = useWishlist(user?.id ?? user?.email, isAuthenticated);
  const { addMutation, removeMutation } = useWishlistMutations(
    user?.id ?? user?.email,
  );
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["getProductDetails", productId],
    queryFn: () => getProductDetails(productId),
    enabled: Boolean(productId),
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <main className="min-h-[65vh] bg-slate-50/70 py-16 flex items-center justify-center">
        <Loader message="Loading product details..." />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-[65vh] bg-slate-50/70 py-16">
        <div className="container mx-auto max-w-2xl">
          <Error
            title="Product details are unavailable"
            message={error.message}
            onRetry={() => void refetch()}
          />
        </div>
      </main>
    );
  }

  const product = data?.data;
  if (!product) return null;

  const isWishlisted =
    isAuthenticated &&
    (wishlistQuery.data?.data.some((item) => item._id === product._id) ??
      false);
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

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out ${product.title} on FreshCart!`,
          url: window.location.href,
        });
      } catch {
        // user aborted share
      }
    } else {
      await navigator.clipboard?.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  const handleBuyNow = (event: React.MouseEvent<HTMLButtonElement>) => {
    addToCart(
      product._id,
      product.imageCover,
      productImageRef.current,
      event.currentTarget,
    );
    router.push("/checkout");
  };

  const updateQuantity = (nextQuantity: number) => {
    setQuantity(Math.max(1, Math.min(product.quantity || 10, nextQuantity)));
  };

  const fullStars = Math.floor(product.ratingsAverage);
  const hasHalfStar = product.ratingsAverage - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const hasDiscount = Boolean(
    product.priceAfterDiscount && product.priceAfterDiscount > 0 && product.priceAfterDiscount < product.price
  );
  const activePrice = hasDiscount ? product.priceAfterDiscount! : product.price;

  return (
    <main
      className="min-h-[60vh] bg-slate-50/60 py-6 sm:py-8"
      aria-busy={isFetching}>
      <div className="container mx-auto max-w-screen-2xl">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-5 sm:mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 sm:text-sm">
            <li>
              <Link href="/" className="hover:text-primary-700">Home</Link>
            </li>
            <li aria-hidden="true"><IconChevronRight size={14} className="text-slate-300" /></li>
            <li>
              <Link href="/shop" className="hover:text-primary-700">Shop</Link>
            </li>
            <li aria-hidden="true"><IconChevronRight size={14} className="text-slate-300" /></li>
            <li>
              <Link href={`/categories/${product.category._id}`} className="hover:text-primary-700">
                {product.category.name}
              </Link>
            </li>
            <li aria-hidden="true"><IconChevronRight size={14} className="text-slate-300" /></li>
            <li className="max-w-[200px] truncate sm:max-w-md font-semibold text-slate-800" aria-current="page">
              {product.title}
            </li>
          </ol>
        </nav>

        {/* Gallery & Primary Info Grid */}
        <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.5fr)] lg:gap-8">
          {/* Left: Image Gallery */}
          <section
            aria-label={`${product.title} image gallery`}
            className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:p-6">
            <ProductGallery
              product={product}
              onMainImageRef={(image) => {
                productImageRef.current = image;
              }}
            />
          </section>

          {/* Right: Product Details & Controls */}
          <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-7 lg:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/categories/${product.category._id}`}
                className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700 transition-colors hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                {product.category.name}
              </Link>
              <Link
                href={`/brands/${product.brand._id}`}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                {product.brand.name}
              </Link>
            </div>

            <h1 className="mt-3.5 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl">
              {product.title}
            </h1>

            {/* Ratings & Reviews */}
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span
                className="flex items-center gap-0.5 text-amber-400"
                aria-hidden="true">
                {Array.from({ length: fullStars }, (_, index) => (
                  <IconStarFilled
                    key={`full-${index}`}
                    size={17}
                    aria-hidden="true"
                  />
                ))}
                {hasHalfStar && (
                  <IconStarHalfFilled size={17} aria-hidden="true" />
                )}
                {Array.from({ length: emptyStars }, (_, index) => (
                  <IconStar key={`empty-${index}`} size={17} aria-hidden="true" />
                ))}
              </span>
              <span
                className="text-xs sm:text-sm font-semibold text-slate-500"
                aria-label={`Rated ${product.ratingsAverage} out of 5 stars`}>
                {product.ratingsAverage.toFixed(1)} <span className="font-normal text-slate-400">({product.ratingsQuantity} reviews)</span>
              </span>
            </div>

            {/* Price section */}
            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-extrabold tracking-tight text-primary-700 sm:text-4xl">
                {activePrice.toLocaleString("en-US")} <span className="text-base font-semibold text-slate-500">EGP</span>
              </span>
              {hasDiscount && (
                <span className="text-base font-medium text-slate-400 line-through">
                  {product.price.toLocaleString("en-US")} EGP
                </span>
              )}
            </div>

            {/* Stock status badge */}
            <div className="mt-4">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                product.quantity > 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-600"
              }`}>
                <IconCheck size={15} stroke={2.5} aria-hidden="true" />
                {product.quantity > 0 ? "In Stock & Ready to Ship" : "Currently Out of Stock"}
              </span>
            </div>

            {/* Description Preview */}
            <div className="mt-5 border-t border-slate-100 pt-5">
              <h2 className="sr-only">Product overview</h2>
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                {product.description.replace(/\s+/g, " ").trim()}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mt-6">
              <label
                className="block text-xs font-bold uppercase tracking-wider text-slate-500"
                htmlFor="product-quantity">
                Quantity
              </label>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="inline-flex h-11 items-center rounded-xl border border-slate-200 bg-white">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1 || product.quantity <= 0}
                    onClick={() => updateQuantity(Math.max(1, quantity - 1))}
                    className="flex h-full w-10 items-center justify-center rounded-l-xl text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-40">
                    <IconMinus size={16} aria-hidden="true" />
                  </button>
                  <output
                    id="product-quantity"
                    aria-live="polite"
                    className="min-w-10 text-center text-sm font-bold text-slate-900">
                    {quantity}
                  </output>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={quantity >= product.quantity || product.quantity <= 0}
                    onClick={() => updateQuantity(Math.min(product.quantity, quantity + 1))}
                    className="flex h-full w-10 items-center justify-center rounded-r-xl text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-40">
                    <IconPlus size={16} aria-hidden="true" />
                  </button>
                </div>
                <span className="text-xs text-slate-500">
                  {product.quantity > 0 ? `${product.quantity} units available` : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Total calculation */}
            <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3.5">
              <span className="text-xs sm:text-sm font-medium text-slate-600">
                Subtotal ({quantity} {quantity === 1 ? "unit" : "units"}):
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-900">
                {(activePrice * quantity).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}{" "}
                EGP
              </span>
            </div>

            {/* Action Buttons Grid */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={product.quantity <= 0 || isCartBusy}
                aria-busy={isCartBusy}
                onClick={(event) =>
                  addToCart(
                    product._id,
                    product.imageCover,
                    productImageRef.current,
                    event.currentTarget,
                  )
                }
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:cursor-not-allowed disabled:opacity-50">
                <IconShoppingCart size={19} aria-hidden="true" />
                {isCartBusy ? "Adding to Cart…" : "Add to Cart"}
              </button>

              <button
                type="button"
                disabled={product.quantity <= 0}
                onClick={handleBuyNow}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-50">
                <IconBolt size={19} fill="currentColor" aria-hidden="true" />
                Buy Now
              </button>
            </div>

            {/* Secondary Actions (Wishlist & Share) */}
            <div className="mt-3.5 flex gap-3">
              <button
                type="button"
                aria-label={
                  wishlistQuery.isError
                    ? "Retry loading wishlist"
                    : isWishlisted
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                }
                aria-pressed={isWishlisted}
                aria-live="polite"
                disabled={isWishlistLoading || isWishlistMutationPending}
                onClick={handleWishlistClick}
                className={`inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border text-xs sm:text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-wait disabled:opacity-60 ${
                  isWishlisted
                    ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}>
                {isWishlisted ? (
                  <IconHeartFilled size={18} aria-hidden="true" />
                ) : (
                  <IconHeart size={18} stroke={2} aria-hidden="true" />
                )}
                {!isAuthenticated
                  ? "Save to Wishlist"
                  : isWishlistLoading
                    ? "Loading…"
                    : isWishlistMutationPending
                      ? isWishlisted
                        ? "Removing…"
                        : "Adding…"
                      : isWishlisted
                        ? "Saved in Wishlist"
                        : "Add to Wishlist"}
              </button>

              <button
                type="button"
                aria-label="Share product link"
                onClick={handleShare}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                <IconShare size={18} aria-hidden="true" />
              </button>
            </div>
          </section>
        </div>

        {/* Product Information Tabs */}
        <ProductInformationTabs key={product._id} product={product} />
      </div>
    </main>
  );
}
