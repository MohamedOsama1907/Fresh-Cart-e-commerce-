"use client";

import Link from "next/link";
import { IconHeart, IconLogin2, IconRefresh } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import type { appState } from "@/store/store";
import { useWishlist } from "../hooks/useWishlist";
import { useWishlistMutations } from "../hooks/useWishlistMutations";
import WishlistProduct from "./wishlistProduct";

export default function WishlistScreen() {
  const { isAuthenticated, user } = useSelector((state: appState) => state.authReducer);
  const userId = user?.id ?? user?.email;
  const wishlistQuery = useWishlist(userId, isAuthenticated);
  const { removeMutation } = useWishlistMutations(userId);

  if (!isAuthenticated) {
    return (
      <main className="container mx-auto flex min-h-[52vh] items-center justify-center px-4 py-12">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <IconHeart size={27} aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Your Wishlist</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Sign in to see and manage the products you have saved.</p>
          <Link href="/login" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 text-sm font-semibold text-white hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
            <IconLogin2 size={17} aria-hidden="true" />
            Sign In
          </Link>
        </section>
      </main>
    );
  }

  if (wishlistQuery.isPending) {
    return <main className="container mx-auto min-h-[55vh] px-4 py-10" aria-busy="true"><p role="status" className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">Loading your wishlist…</p></main>;
  }

  if (wishlistQuery.isError) {
    return (
      <main className="container mx-auto min-h-[55vh] px-4 py-10">
        <div role="alert" className="mx-auto max-w-xl rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
          <h1 className="text-lg font-semibold text-slate-900">Wishlist unavailable</h1>
          <p className="mt-2 text-sm text-rose-800">{wishlistQuery.error.message}</p>
          <button type="button" onClick={() => void wishlistQuery.refetch()} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary-600 px-4 text-sm font-semibold text-white hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
            <IconRefresh size={16} aria-hidden="true" /> Try again
          </button>
        </div>
      </main>
    );
  }

  const wishlist = wishlistQuery.data;

  return (
    <main className="container mx-auto min-h-[60vh] flex-1 bg-slate-50/70 px-4 pb-12">
      {wishlist.data.length > 0 && (
        <header className="border-b border-slate-100 bg-white">
          <div className="py-6 sm:py-8">
            <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
              <Link href="/" className="hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="font-medium text-slate-800">Wishlist</span>
            </nav>
            <div className="flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                <IconHeart size={24} fill="currentColor" aria-hidden="true" />
              </span>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">My Wishlist</h1>
                <p className="mt-0.5 text-sm text-slate-500" aria-live="polite">
                  {wishlist.count} {wishlist.count === 1 ? "item" : "items"} saved
                </p>
              </div>
            </div>
          </div>
        </header>
      )}

      <div className="pt-7 sm:pt-8">
        {wishlist.data.length > 0 ? (
          <section aria-label="Saved products" className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="hidden grid-cols-[minmax(0,1fr)_7rem_8rem_11rem] items-center gap-5 bg-slate-50 px-6 py-4 text-sm font-medium text-slate-500 sm:grid">
              <span>Product</span><span>Price</span><span>Status</span><span className="text-center">Actions</span>
            </div>
            {wishlist.data.map((product) => (
              <WishlistProduct
                key={product._id}
                product={product}
                isRemoving={removeMutation.isPending}
                onRemove={(productId) => removeMutation.mutate(productId)}
              />
            ))}
          </section>
        ) : (
          <section className="mx-auto flex min-h-64 max-w-2xl flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center shadow-sm">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500"><IconHeart size={27} aria-hidden="true" /></span>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">Your wishlist is empty</h2>
            <p className="mt-1.5 max-w-sm text-sm leading-6 text-slate-500">Save products you love and they’ll be waiting for you here.</p>
            <Link href="/shop" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-600 px-5 text-sm font-semibold text-white hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">Continue Shopping</Link>
          </section>
        )}

        <Link href="/shop" className="mt-5 inline-flex min-h-10 items-center text-sm text-slate-500 transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
          ← Continue Shopping
        </Link>
      </div>
    </main>
  );
}
