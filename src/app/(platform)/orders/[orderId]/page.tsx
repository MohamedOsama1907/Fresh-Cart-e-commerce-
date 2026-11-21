import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowLeft, IconAlertTriangle } from "@tabler/icons-react";
import OrderCard from "@/features/orders/components/OrderCard";
import { getOrderByIdAction } from "@/features/orders/server/orders.actions";

export const metadata: Metadata = {
  title: "Order Details | FreshCart",
  description: "View order details and tracking status.",
};

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const result = await getOrderByIdAction(orderId);

  return (
    <main className="min-h-[62vh] bg-slate-50/60 px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <Link
            href="/orders"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
            <IconArrowLeft size={17} aria-hidden="true" />
            Back to all orders
          </Link>
        </div>

        {!result.success ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center sm:p-8">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <IconAlertTriangle size={24} />
            </div>
            <h1 className="mt-4 text-lg font-bold text-slate-900 sm:text-xl">
              Order Unavailable
            </h1>
            <p className="mt-2 text-sm text-slate-600">{result.message}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Order Details
            </h1>
            <OrderCard order={result.order} />
          </div>
        )}
      </div>
    </main>
  );
}
