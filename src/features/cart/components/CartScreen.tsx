"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  IconCheck,
  IconLock,
  IconLogin2,
  IconMinus,
  IconPlus,
  IconShieldCheck,
  IconShoppingCart,
  IconTag,
  IconTrash,
  IconTruck,
} from "@tabler/icons-react";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import type { appState } from "@/store/store";
import { useCart } from "../hooks/useCart";
import { useCartMutations } from "../hooks/useCartMutations";

const freeShippingThreshold = 550;
const standardShippingCost = 50;

export default function CartScreen() {
  const [couponName, setCouponName] = useState("");
  const [isCouponFormOpen, setIsCouponFormOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state: appState) => state.authReducer);
  const userId = user?.id ?? user?.email;
  const cartQuery = useCart(userId, isAuthenticated);
  const { updateQuantityMutation, removeProductMutation, clearCartMutation, applyCouponMutation } = useCartMutations(userId);

  const handleCouponSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedCouponName = couponName.trim();
    if (!normalizedCouponName) {
      toast.error("Enter a coupon code to apply.");
      return;
    }
    if (applyCouponMutation.isPending) return;

    applyCouponMutation.mutate(normalizedCouponName, {
      onSuccess: () => {
        setCouponName("");
        setIsCouponFormOpen(false);
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-[70vh] flex-1 bg-slate-50/70 py-6 sm:py-8">
        <div className="container mx-auto">
          <CartPageHeading />
          <section className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
              <IconShoppingCart size={27} aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">Sign in to view your cart</h2>
            <p className="mt-1.5 max-w-sm text-sm leading-6 text-slate-500">Your cart is saved to your account. Sign in to review your items.</p>
            <Link href="/login" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
              <IconLogin2 size={17} aria-hidden="true" /> Sign In
            </Link>
          </section>
        </div>
      </main>
    );
  }

  if (cartQuery.isPending) {
    return (
      <main className="min-h-[70vh] flex-1 bg-slate-50/70 py-6 sm:py-8">
        <div className="container mx-auto"><CartPageHeading /><Loader message="Loading your cart..." /></div>
      </main>
    );
  }

  if (cartQuery.isError) {
    return (
      <main className="min-h-[70vh] flex-1 bg-slate-50/70 py-6 sm:py-8">
        <div className="container mx-auto">
          <CartPageHeading />
          <Error title="Your cart is unavailable" message={cartQuery.error.message} onRetry={() => void cartQuery.refetch()} />
        </div>
      </main>
    );
  }

  const cart = cartQuery.data;
  const cartItems = cart.data.products;
  const subtotal = cart.data.totalCartPrice;
  const isShippingFree = subtotal >= freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const shippingCost = isShippingFree ? 0 : standardShippingCost;
  const total = subtotal + shippingCost;
  const isCartActionPending =
    updateQuantityMutation.isPending ||
    removeProductMutation.isPending ||
    clearCartMutation.isPending ||
    applyCouponMutation.isPending;

  return (
    <main className="min-h-[70vh] flex-1 bg-slate-50/70 py-6 sm:py-8">
      <div className="container mx-auto">
        <CartPageHeading itemCount={cart.numOfCartItems} />

        {cartItems.length === 0 ? (
          <section className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
              <IconShoppingCart size={27} aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">Your cart is empty</h2>
            <p className="mt-1.5 max-w-sm text-sm leading-6 text-slate-500">Find something you love and it will be waiting here.</p>
            <Link href="/shop" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">Continue Shopping</Link>
          </section>
        ) : (
          <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2.1fr)_minmax(320px,1fr)] lg:gap-8">
            <section aria-label="Cart items" className="min-w-0">
              <div className="space-y-4" aria-busy={isCartActionPending}>
                {cartItems.map((item) => {
                  const product = item.product;
                  const isUpdating =
                    updateQuantityMutation.isPending &&
                    updateQuantityMutation.variables?.productId === product._id;
                  const isRemoving =
                    removeProductMutation.isPending && removeProductMutation.variables === product._id;

                  return (
                    <article key={item._id} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
                      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                        <div className="flex shrink-0 items-center gap-3 sm:block">
                          <Link href={`/products/${product._id}`} aria-label={`View ${product.title}`} className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 sm:size-32">
                            <Image src={product.imageCover} alt={product.title} fill unoptimized sizes="(max-width: 639px) 96px, 128px" className="object-contain p-2" />
                          </Link>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white sm:ml-12 sm:mt-3 ${product.quantity > 0 ? "bg-emerald-500" : "bg-slate-400"}`}>
                            <IconCheck size={12} stroke={3} aria-hidden="true" />
                            {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col justify-between gap-5 sm:min-h-32">
                          <div className="min-w-0">
                            <Link href={`/products/${product._id}`} className="block truncate text-base font-semibold text-slate-900 transition-colors hover:text-primary-700 sm:text-lg">{product.title}</Link>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm">
                              <span className="rounded-full bg-primary-50 px-2.5 py-1 font-medium text-primary-700">{product.category.name}</span>
                              <span className="text-slate-300" aria-hidden="true">·</span>
                              <span>{product.brand.name}</span>
                            </div>
                            <p className="mt-3 font-semibold text-primary-700">
                              {item.price.toLocaleString("en-US")} EGP <span className="ml-1 text-xs font-normal text-slate-400">per unit</span>
                            </p>
                          </div>

                          <div className="flex flex-wrap items-end justify-between gap-4">
                            <div className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-slate-50 p-1" aria-label={`Quantity, ${item.count}`}>
                              <button
                                type="button"
                                aria-label={`Decrease quantity of ${product.title}`}
                                disabled={isUpdating || item.count <= 1}
                                onClick={() => updateQuantityMutation.mutate({ productId: product._id, count: item.count - 1 })}
                                className="flex size-8 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <IconMinus size={15} aria-hidden="true" />
                              </button>
                              <span className="min-w-10 text-center text-sm font-semibold text-slate-900" aria-live="polite">{item.count}</span>
                              <button
                                type="button"
                                aria-label={`Increase quantity of ${product.title}`}
                                disabled={isUpdating || item.count >= product.quantity}
                                onClick={() => updateQuantityMutation.mutate({ productId: product._id, count: item.count + 1 })}
                                className="flex size-8 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <IconPlus size={16} aria-hidden="true" />
                              </button>
                            </div>

                            <div className="flex items-end gap-4">
                              <p className="text-right">
                                <span className="block text-xs text-slate-400">Total</span>
                                <span className="text-lg font-bold text-slate-900">{(item.price * item.count).toLocaleString("en-US")}</span>
                                <span className="ml-1 text-sm text-slate-500">EGP</span>
                              </p>
                              <button
                                type="button"
                                aria-label={`Remove ${product.title} from cart`}
                                aria-busy={isRemoving}
                                disabled={isRemoving || isCartActionPending}
                                onClick={() => removeProductMutation.mutate(product._id)}
                                className="flex size-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-500 transition-colors hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-wait disabled:opacity-60"
                              >
                                {isRemoving ? <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-rose-200 border-t-rose-600" /> : <IconTrash size={17} aria-hidden="true" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
                <Link href="/shop" className="inline-flex min-h-10 items-center text-sm font-medium text-primary-700 transition-colors hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                  <span aria-hidden="true" className="mr-2">←</span> Continue Shopping
                </Link>
                <button
                  type="button"
                  disabled={isCartActionPending}
                  onClick={() => clearCartMutation.mutate()}
                  className="inline-flex min-h-10 items-center gap-2 text-sm text-slate-500 transition-colors hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-wait disabled:opacity-50"
                >
                  {clearCartMutation.isPending ? <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-rose-600" /> : <IconTrash size={15} aria-hidden="true" />}
                  Clear all items
                </button>
              </div>
            </section>

            <aside aria-labelledby="order-summary-title" className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-4 text-white sm:px-6">
                <h2 id="order-summary-title" className="flex items-center gap-2 text-lg font-bold"><IconLock size={18} aria-hidden="true" /> Order Summary</h2>
                <p className="mt-1 text-sm text-white/90">{cart.numOfCartItems} {cart.numOfCartItems === 1 ? "item" : "items"} in your cart</p>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                {isShippingFree ? (
                  <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-4 text-emerald-700">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <IconTruck size={20} aria-hidden="true" />
                    </span>
                    <span>
                      <strong className="block text-sm font-semibold">Free Shipping!</strong>
                      <span className="mt-0.5 block text-sm">You qualify for free delivery</span>
                    </span>
                  </div>
                ) : (
                  <div className="rounded-xl bg-amber-50 px-4 py-3.5">
                    <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
                      <span className="flex min-w-0 items-center gap-2">
                        <IconTruck size={19} className="shrink-0 text-orange-500" aria-hidden="true" />
                        <span>Add <strong className="font-semibold text-slate-800">{remainingForFreeShipping.toLocaleString("en-US")} EGP</strong> for free shipping</span>
                      </span>
                      <span className="shrink-0 text-xs font-semibold text-slate-500" aria-label={`${shippingProgress}% toward free shipping`}>
                        {shippingProgress}%
                      </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-orange-100" role="progressbar" aria-label="Progress toward free shipping" aria-valuemin={0} aria-valuemax={100} aria-valuenow={shippingProgress}>
                      <div className="h-full rounded-full bg-amber-500 transition-[width] duration-500" style={{ width: `${shippingProgress}%` }} />
                    </div>
                  </div>
                )}

                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4 text-slate-600"><dt>Subtotal</dt><dd className="font-medium text-slate-900">{subtotal.toLocaleString("en-US")} EGP</dd></div>
                  <div className="flex items-center justify-between gap-4 text-slate-600"><dt>Shipping</dt><dd className={`font-medium ${isShippingFree ? "text-primary-700" : "text-slate-900"}`}>{isShippingFree ? "FREE" : `${shippingCost} EGP`}</dd></div>
                  <div className="flex items-end justify-between gap-4 border-t border-dashed border-slate-200 pt-4 text-slate-900">
                    <dt className="font-semibold">Total</dt>
                    <dd><span className="text-2xl font-bold tracking-tight">{total.toLocaleString("en-US")}</span><span className="ml-1 text-sm text-slate-500">EGP</span></dd>
                  </div>
                </dl>

                {isCouponFormOpen ? (
                  <form onSubmit={handleCouponSubmit} className="space-y-2 rounded-xl border border-slate-200 p-3">
                    <label htmlFor="cart-coupon-code" className="text-xs font-medium text-slate-700">Promo code</label>
                    <div className="flex flex-col gap-2 min-[420px]:flex-row">
                      <input
                        id="cart-coupon-code"
                        name="couponName"
                        type="text"
                        autoComplete="off"
                        autoCapitalize="characters"
                        value={couponName}
                        onChange={(event) => setCouponName(event.target.value)}
                        disabled={applyCouponMutation.isPending}
                        placeholder="Enter your code"
                        className="min-h-11 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-slate-50"
                      />
                      <button
                        type="submit"
                        disabled={applyCouponMutation.isPending || !couponName.trim()}
                        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:cursor-wait disabled:opacity-60"
                      >
                        {applyCouponMutation.isPending ? "Applying…" : "Apply"}
                      </button>
                      <button
                        type="button"
                        disabled={applyCouponMutation.isPending}
                        onClick={() => { setCouponName(""); setIsCouponFormOpen(false); }}
                        className="min-h-11 rounded-lg px-3 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button type="button" onClick={() => setIsCouponFormOpen(true)} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 text-sm font-medium text-slate-500 transition-colors hover:border-primary-300 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                    <IconTag size={16} aria-hidden="true" /> Apply Promo Code
                  </button>
                )}
                <button type="button" className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-5 text-sm font-bold text-white shadow-lg shadow-primary-700/15 transition-colors hover:from-primary-700 hover:to-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
                  <IconLock size={17} aria-hidden="true" /> Secure Checkout
                </button>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-1 text-[11px] text-slate-500 sm:text-xs">
                  <span className="inline-flex items-center gap-1.5"><IconShieldCheck size={15} className="text-primary-600" aria-hidden="true" /> Secure Payment</span>
                  <span aria-hidden="true" className="hidden h-4 border-l border-slate-200 sm:block" />
                  <span className="inline-flex items-center gap-1.5"><IconTruck size={15} className="text-blue-500" aria-hidden="true" /> Fast Delivery</span>
                </div>
                <Link href="/shop" className="flex min-h-10 items-center justify-center text-sm font-medium text-primary-700 transition-colors hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"><span aria-hidden="true" className="mr-1">←</span> Continue Shopping</Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

function CartPageHeading({ itemCount }: { itemCount?: number }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
        <Link href="/" className="transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="font-medium text-slate-800">Shopping Cart</span>
      </nav>
      <header className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm sm:size-14"><IconShoppingCart size={28} stroke={2.1} aria-hidden="true" /></span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Shopping Cart</h1>
        </div>
        {itemCount !== undefined && (
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            You have <span className="font-semibold text-primary-700">{itemCount} {itemCount === 1 ? "item" : "items"}</span> in your cart
          </p>
        )}
      </header>
    </>
  );
}
