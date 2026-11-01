"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { IconLogin2, IconPackage } from "@tabler/icons-react";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import type { appState } from "@/store/store";
import { useUserOrders } from "../hooks/useUserOrders";
import OrdersEmptyState from "./OrdersEmptyState";
import OrderCard from "./OrderCard";

export default function MyOrdersScreen() {
  const { isAuthenticated, user } = useSelector(
    (state: appState) => state.authReducer,
  );
  const userId = user?.id;
  const ordersQuery = useUserOrders(userId, isAuthenticated);

  if (!isAuthenticated) {
    return (
      <main className="min-h-[62vh] px-4 py-12 sm:py-16">
        <section className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-slate-100 bg-white px-6 py-10 text-center shadow-sm">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
            <IconLogin2 aria-hidden="true" className="size-7" />
          </span>
          <h1 className="mt-4 text-xl font-bold text-slate-900">Sign in to view your orders</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Sign in to see your order history and track deliveries.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
            Sign In
          </Link>
        </section>
      </main>
    );
  }

  if (!userId) {
    return (
      <Error
        title="Account information unavailable"
        message="Please sign in again to access your order history."
      />
    );
  }

  if (ordersQuery.isPending) {
    return <Loader message="Loading your orders..." className="min-h-[58vh]" />;
  }

  if (ordersQuery.isError) {
    return (
      <Error
        title="Your orders are unavailable"
        message={ordersQuery.error.message}
        onRetry={() => void ordersQuery.refetch()}
      />
    );
  }

  const response = ordersQuery.data;
  const orders = Array.isArray(response)
    ? response
    : response && Array.isArray(response.data)
      ? response.data
      : null;

  if (!orders) {
    return (
      <Error
        title="Orders response unavailable"
        message="The orders service returned data in an unexpected format. Please try again."
        onRetry={() => void ordersQuery.refetch()}
      />
    );
  }

  if (orders.length === 0) return <OrdersEmptyState />;

  const totalOrders = orders.length;
  const totalItems = orders.reduce(
    (sum, order) =>
      sum +
      (Array.isArray(order.cartItems)
        ? order.cartItems.reduce((orderSum, item) => orderSum + item.count, 0)
        : 0),
    0,
  );

  return (
    <main className="min-h-[62vh] bg-slate-50/60 px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="hover:text-primary-700">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="font-medium text-slate-800">My Orders</span>
            </nav>
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <IconPackage aria-hidden="true" className="size-6" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  My Orders
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {totalOrders} {totalOrders === 1 ? "order" : "orders"} · {totalItems} {totalItems === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section aria-label="Order history" className="space-y-4 sm:space-y-5">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </section>
      </div>
    </main>
  );
}
