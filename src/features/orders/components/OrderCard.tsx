"use client";

import Image from "next/image";
import { useState } from "react";
import {
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconClock,
  IconCreditCard,
  IconMapPin,
  IconPackage,
  IconPhone,
} from "@tabler/icons-react";
import type { OrderItem, OrderProduct, UserOrder } from "../types/order.types";

function isOrderProduct(product: OrderItem["product"]): product is OrderProduct {
  return typeof product === "object" && product !== null;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatPrice(value: number) {
  return `${value.toLocaleString("en-US")} EGP`;
}

function OrderItemRow({ item }: { item: OrderItem }) {
  const product = isOrderProduct(item.product) ? item.product : null;

  return (
    <li className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 sm:gap-4 sm:p-4">
      <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 sm:size-16">
        {product?.imageCover ? (
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="64px"
            unoptimized
            className="object-contain p-1"
          />
        ) : (
          <IconPackage aria-hidden="true" className="size-6 text-slate-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900 sm:text-base">
          {product?.title ?? "Product details unavailable"}
        </p>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          {item.count} × {formatPrice(item.price)}
        </p>
      </div>
      <p className="shrink-0 text-right text-sm font-bold text-slate-900 sm:text-base">
        {formatPrice(item.price * item.count)}
      </p>
    </li>
  );
}

export default function OrderCard({ order }: { order: UserOrder }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cartItems = Array.isArray(order.cartItems) ? order.cartItems : [];
  const firstProduct = cartItems[0]?.product;
  const previewProduct = firstProduct && isOrderProduct(firstProduct) ? firstProduct : null;
  const itemCount = cartItems.reduce((total, item) => total + item.count, 0);
  const isDelivered = order.isDelivered;
  const paymentMethod = order.paymentMethodType;
  const orderNumber = order._id.slice(-4).toUpperCase();

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-colors ${
        isExpanded ? "border-primary-200" : "border-slate-200"
      }`}>
      <div className="relative p-4 sm:p-6">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex size-24 shrink-0 items-center justify-center overflow-visible rounded-2xl border border-slate-100 bg-slate-50 sm:size-28">
            <div className="relative size-[76%] overflow-hidden rounded-lg bg-white">
              {previewProduct?.imageCover ? (
                <Image
                  src={previewProduct.imageCover}
                  alt={previewProduct.title}
                  fill
                  sizes="100px"
                  unoptimized
                  className="object-contain p-1"
                />
              ) : (
                <IconPackage
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 text-slate-400"
                />
              )}
            </div>
            {cartItems.length > 1 && (
              <span className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-sm">
                +{cartItems.length - 1}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold ${
                  isDelivered
                    ? "bg-primary-50 text-primary-700"
                    : "bg-amber-100 text-amber-700"
                }`}>
                {isDelivered ? (
                  <IconCheck aria-hidden="true" className="size-3.5" />
                ) : (
                  <IconClock aria-hidden="true" className="size-3.5" />
                )}
                {isDelivered ? "Delivered" : "Processing"}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium capitalize text-slate-500">
                <IconCreditCard aria-hidden="true" className="size-4" />
                {paymentMethod}
              </span>
            </div>

            <h2 className="mt-2 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              <span className="mr-1 font-medium text-slate-400">#</span>
              {orderNumber}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <IconCalendar aria-hidden="true" className="size-4 text-slate-400" />
                {formatDate(order.createdAt)}
              </span>
              <span aria-hidden="true" className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <IconPackage aria-hidden="true" className="size-4 text-slate-400" />
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
              {order.shippingAddress?.city && (
                <>
                  <span aria-hidden="true" className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <IconMapPin aria-hidden="true" className="size-4 text-slate-400" />
                    {order.shippingAddress.city}
                  </span>
                </>
              )}
            </div>

            <p className="mt-3 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {order.totalOrderPrice.toLocaleString("en-US")}
              <span className="ml-1 text-sm font-medium text-slate-500">EGP</span>
            </p>
          </div>

          <button
            type="button"
            aria-expanded={isExpanded}
            aria-controls={`order-details-${order._id}`}
            onClick={() => setIsExpanded((expanded) => !expanded)}
            className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 sm:self-center ${
              isExpanded
                ? "bg-primary-600 text-white hover:bg-primary-700"
                : "bg-slate-100 text-slate-800 hover:bg-slate-200"
            }`}>
            {isExpanded ? "Hide" : "Details"}
            <IconChevronDown
              aria-hidden="true"
              className={`size-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div
          id={`order-details-${order._id}`}
          className="border-t border-slate-100 bg-slate-50/60 p-4 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
              <IconPackage aria-hidden="true" className="size-4" />
            </span>
            Order Items
          </div>

          {cartItems.length > 0 ? (
            <ul className="mt-3 space-y-3">
              {cartItems.map((item) => (
                <OrderItemRow key={item._id} item={item} />
              ))}
            </ul>
          ) : (
            <p className="mt-3 rounded-xl border border-slate-100 bg-white p-4 text-sm text-slate-500">
              No item details are available for this order.
            </p>
          )}

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <section className="rounded-xl border border-slate-100 bg-white p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <IconMapPin aria-hidden="true" className="size-4 text-blue-600" />
                Delivery Address
              </h3>
              {order.shippingAddress ? (
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <p className="font-medium text-slate-800">
                    {order.shippingAddress.city}
                  </p>
                  <p>{order.shippingAddress.details}</p>
                  <p className="inline-flex items-center gap-2">
                    <IconPhone aria-hidden="true" className="size-4 text-slate-400" />
                    {order.shippingAddress.phone}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  Address details are unavailable.
                </p>
              )}
            </section>

            <section className="rounded-xl border border-amber-200 bg-amber-100/80 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500 text-white">
                  <IconClock aria-hidden="true" className="size-4" />
                </span>
                Order Summary
              </h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3 text-slate-600">
                  <dt>Payment</dt>
                  <dd className="font-medium capitalize text-slate-800">
                    {paymentMethod}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 text-slate-600">
                  <dt>Payment status</dt>
                  <dd className={`font-medium ${order.isPaid ? "text-primary-700" : "text-amber-700"}`}>
                    {order.isPaid ? "Paid" : "Pending"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-amber-200 pt-3 font-semibold text-slate-900">
                  <dt>Total</dt>
                  <dd>{formatPrice(order.totalOrderPrice)}</dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      )}
    </article>
  );
}
