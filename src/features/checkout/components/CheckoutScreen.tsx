"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowLeft,
  IconCheck,
  IconCreditCard,
  IconHome,
  IconInfoCircle,
  IconLock,
  IconMapPin,
  IconPhone,
  IconReceipt,
  IconShieldCheck,
  IconShoppingBag,
  IconTruck,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useForm, type SubmitHandler, type UseFormRegister } from "react-hook-form";
import type { ReactNode } from "react";
import type { appState } from "@/store/store";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import { useCart } from "@/features/cart/hooks/useCart";
import { useCreateCashOrder } from "../hooks/useCreateCashOrder";
import {
  checkoutShippingAddressSchema,
  type CheckoutShippingAddressValues,
} from "../schemas/checkout.schema";

const freeShippingThreshold = 550;
const standardShippingCost = 50;

export default function CheckoutScreen() {
  const { isAuthenticated, user } = useSelector(
    (state: appState) => state.authReducer,
  );
  const userId = user?.id ?? user?.email;
  const cartQuery = useCart(userId, isAuthenticated);
  const createOrderMutation = useCreateCashOrder(userId);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutShippingAddressValues>({
    resolver: zodResolver(checkoutShippingAddressSchema),
    defaultValues: { city: "", details: "", phone: "", postalCode: "" },
  });

  const onSubmit: SubmitHandler<CheckoutShippingAddressValues> = (values) => {
    const cart = cartQuery.data;
    if (!cart?.cartId || !cart.data.products.length || createOrderMutation.isPending) {
      return;
    }
    createOrderMutation.mutate({ cartId: cart.cartId, shippingAddress: values });
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-[70vh] bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-screen-2xl">
          <CheckoutHeading />
          <section className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700"><IconLock size={27} aria-hidden="true" /></span>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">Sign in to checkout</h2>
            <p className="mt-1.5 text-sm leading-6 text-slate-500">Sign in to review your cart and complete your order.</p>
            <Link href="/login" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-600 px-5 text-sm font-semibold text-white hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">Sign In</Link>
          </section>
        </div>
      </main>
    );
  }

  if (cartQuery.isPending) {
    return <main className="min-h-[70vh] bg-slate-50/70 py-8"><div className="container mx-auto max-w-screen-2xl"><CheckoutHeading /><Loader message="Loading your cart..." /></div></main>;
  }

  if (cartQuery.isError) {
    return <main className="min-h-[70vh] bg-slate-50/70 py-8"><div className="container mx-auto max-w-screen-2xl"><CheckoutHeading /><Error title="Checkout is unavailable" message={cartQuery.error.message} onRetry={() => void cartQuery.refetch()} /></div></main>;
  }

  const cart = cartQuery.data;
  const items = cart.data.products;

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] bg-slate-50/70 py-8">
        <div className="container mx-auto max-w-screen-2xl">
          <CheckoutHeading />
          <section className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><IconShoppingBag size={27} aria-hidden="true" /></span>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">Your cart is empty</h2>
            <p className="mt-1.5 text-sm text-slate-500">Add something to your cart before checking out.</p>
            <Link href="/shop" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-600 px-5 text-sm font-semibold text-white hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">Start Shopping</Link>
          </section>
        </div>
      </main>
    );
  }

  const subtotal = cart.data.totalCartPrice;
  const isShippingFree = subtotal >= freeShippingThreshold;
  const shipping = isShippingFree ? 0 : standardShippingCost;
  const total = subtotal + shipping;
  const pending = createOrderMutation.isPending || isSubmitting;

  return (
    <main className="min-h-[70vh] bg-slate-50/70 py-6 sm:py-8">
      <div className="container mx-auto max-w-screen-2xl">
        <CheckoutHeading />
        <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2.1fr)_minmax(320px,1fr)] lg:gap-8">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} noValidate className="min-w-0 space-y-6">
            <section aria-labelledby="shipping-heading" className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <SectionHeading id="shipping-heading" icon={<IconHome size={19} aria-hidden="true" />} title="Shipping Address" subtitle="Where should we deliver your order?" />
              <div className="space-y-5 p-4 sm:p-6">
                <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-blue-700">
                  <IconInfoCircle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <div><p className="text-sm font-medium">Delivery Information</p><p className="mt-0.5 text-xs leading-5">Please ensure your address is accurate for smooth delivery.</p></div>
                </div>
                <CheckoutField label="City" name="city" placeholder="e.g. Cairo, Alexandria, Giza" icon={<IconMapPin size={17} />} error={errors.city?.message} register={register} autoComplete="address-level2" />
                <CheckoutField label="Street Address" name="details" placeholder="Street name, building number, floor, apartment..." icon={<IconMapPin size={18} />} error={errors.details?.message} register={register} autoComplete="street-address" multiline />
                <div className="grid gap-5 sm:grid-cols-2">
                  <CheckoutField label="Phone Number" name="phone" placeholder="01xxxxxxxxx" icon={<IconPhone size={17} />} error={errors.phone?.message} register={register} autoComplete="tel" type="tel" />
                  <CheckoutField label="Postal Code" name="postalCode" placeholder="Enter your postal code" icon={<IconMapPin size={17} />} error={errors.postalCode?.message} register={register} autoComplete="postal-code" />
                </div>
              </div>
            </section>

            <section aria-labelledby="payment-heading" className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <SectionHeading id="payment-heading" icon={<IconCreditCard size={19} aria-hidden="true" />} title="Payment Method" subtitle="Choose how you’d like to pay" />
              <div className="space-y-4 p-4 sm:p-6">
                <div className="flex items-center gap-4 rounded-xl border border-primary-300 bg-primary-50/80 p-4 ring-1 ring-primary-100 sm:p-5">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm"><IconReceipt size={23} aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1"><h3 className="text-sm font-semibold text-slate-900">Cash on Delivery</h3><p className="mt-1 text-sm text-slate-500">Pay when your order arrives at your doorstep</p></div>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white"><IconCheck size={17} aria-hidden="true" /></span>
                </div>
                <div aria-disabled="true" className="flex cursor-not-allowed items-center gap-4 rounded-xl border border-slate-200 p-4 opacity-65 sm:p-5">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400"><IconCreditCard size={23} aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1"><h3 className="text-sm font-semibold text-slate-700">Pay Online</h3><p className="mt-1 text-sm text-slate-500">Online payment is not available yet</p></div>
                  <span className="size-6 shrink-0 rounded-full border border-slate-300" aria-hidden="true" />
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3.5 text-emerald-800">
                  <IconShieldCheck size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <div><p className="text-sm font-medium">Secure &amp; Encrypted</p><p className="mt-0.5 text-xs leading-5">Your order information is handled securely.</p></div>
                </div>
              </div>
            </section>
          </form>

          <aside aria-labelledby="order-summary-title" className="self-start overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md lg:sticky lg:top-6">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-4 text-white sm:px-6">
              <h2 id="order-summary-title" className="flex items-center gap-2 text-lg font-bold"><IconLock size={18} aria-hidden="true" /> Order Summary</h2>
              <p className="mt-1 text-sm text-white/90">{cart.numOfCartItems} {cart.numOfCartItems === 1 ? "item" : "items"}</p>
            </div>
            <div className="space-y-5 p-4 sm:p-5">
              <ul className="max-h-64 space-y-3 overflow-y-auto pr-1" aria-label="Items in your order">
                {items.map((item) => (
                  <li key={item._id} className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-white">
                      <Image src={item.product.imageCover} alt={item.product.title} fill unoptimized sizes="56px" className="object-contain p-1" />
                    </div>
                    <div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-medium text-slate-800">{item.product.title}</p><p className="mt-1 text-xs text-slate-500">{item.count} × {item.price.toLocaleString("en-US")} EGP</p></div>
                    <span className="shrink-0 text-sm font-semibold text-slate-900">{(item.count * item.price).toLocaleString("en-US")}</span>
                  </li>
                ))}
              </ul>

              <dl className="space-y-3 border-t border-slate-100 pt-4 text-sm">
                <div className="flex items-center justify-between gap-3 text-slate-600"><dt>Subtotal</dt><dd className="font-medium text-slate-900">{subtotal.toLocaleString("en-US")} EGP</dd></div>
                <div className="flex items-center justify-between gap-3 text-slate-600"><dt className="flex items-center gap-2"><IconTruck size={17} className="text-slate-400" aria-hidden="true" /> Shipping</dt><dd className={`font-medium ${isShippingFree ? "text-primary-700" : "text-slate-900"}`}>{isShippingFree ? "FREE" : `${shipping} EGP`}</dd></div>
                <div className="flex items-end justify-between gap-3 border-t border-slate-100 pt-4 text-slate-900"><dt className="font-semibold">Total</dt><dd><span className="text-2xl font-bold tracking-tight text-primary-700">{total.toLocaleString("en-US")}</span><span className="ml-1 text-sm text-slate-500">EGP</span></dd></div>
              </dl>

              <button type="submit" form="checkout-form" disabled={pending} className="flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-5 text-sm font-bold text-white shadow-lg shadow-primary-700/15 transition-colors hover:from-primary-700 hover:to-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:cursor-wait disabled:opacity-60">
                {pending ? <><span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Placing Order…</> : <><IconLock size={17} aria-hidden="true" /> Place Order</>}
              </button>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-slate-100 pt-4 text-[11px] text-slate-500 sm:text-xs">
                <span className="inline-flex items-center gap-1.5"><IconShieldCheck size={14} className="text-emerald-600" aria-hidden="true" /> Secure</span><span aria-hidden="true" className="h-4 border-l border-slate-200" /><span className="inline-flex items-center gap-1.5"><IconTruck size={14} className="text-blue-500" aria-hidden="true" /> Fast Delivery</span><span aria-hidden="true" className="h-4 border-l border-slate-200" /><span>Easy Returns</span>
              </div>
              <Link href="/cart" className="flex min-h-9 items-center justify-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"><IconArrowLeft size={16} aria-hidden="true" /> Back to Cart</Link>
            </div>
          </aside>
        </div>
      </div>
      {/* The form is submitted from the summary button to keep it visible while scrolling. */}
    </main>
  );
}

function CheckoutHeading() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm">
        <Link href="/" className="hover:text-primary-700">Home</Link><span aria-hidden="true">/</span><Link href="/cart" className="hover:text-primary-700">Cart</Link><span aria-hidden="true">/</span><span aria-current="page" className="font-medium text-slate-800">Checkout</span>
      </nav>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 sm:mb-8">
        <div><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm sm:size-12"><IconReceipt size={24} aria-hidden="true" /></span><h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Complete Your Order</h1></div><p className="mt-2 text-sm text-slate-600 sm:text-base">Review your items and complete your purchase</p></div>
        <Link href="/cart" className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-primary-700 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"><IconArrowLeft size={18} aria-hidden="true" /> Back to Cart</Link>
      </header>
    </>
  );
}

function SectionHeading({ id, icon, title, subtitle }: { id: string; icon: ReactNode; title: string; subtitle: string }) {
  return <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-4 text-white sm:px-6"><h2 id={id} className="flex items-center gap-2 text-base font-bold sm:text-lg">{icon}{title}</h2><p className="mt-1 text-xs text-white/90 sm:text-sm">{subtitle}</p></div>;
}

type FieldName = keyof CheckoutShippingAddressValues;
function CheckoutField({ label, name, placeholder, icon, error, register, autoComplete, type = "text", multiline = false }: { label: string; name: FieldName; placeholder: string; icon: ReactNode; error?: string; register: UseFormRegister<CheckoutShippingAddressValues>; autoComplete: string; type?: string; multiline?: boolean }) {
  const id = `checkout-${name}`;
  const className = `w-full min-w-0 rounded-xl border ${error ? "border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100" : "border-slate-200 bg-white focus:border-primary-500 focus:ring-primary-100"} py-3 pl-13 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2`;
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-xs font-semibold text-slate-700 sm:text-sm">{label} <span className="text-rose-500" aria-hidden="true">*</span></label>
      <div className="relative">
        <span className={`absolute left-3 z-10 flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 ${multiline ? "top-3" : "top-1/2 -translate-y-1/2"}`} aria-hidden="true">{icon}</span>
        {multiline ? <textarea id={id} rows={3} placeholder={placeholder} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={`${className} min-h-24 resize-y`} {...register(name)} /> : <input id={id} type={type} placeholder={placeholder} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={`min-h-12 ${className}`} {...register(name)} />}
      </div>
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}
