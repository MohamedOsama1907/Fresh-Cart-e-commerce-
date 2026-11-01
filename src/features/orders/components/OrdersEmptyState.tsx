import Link from "next/link";
import { IconPackage, IconShoppingBag } from "@tabler/icons-react";

export default function OrdersEmptyState() {
  return (
    <section
      aria-labelledby="orders-empty-title"
      className="flex min-h-[58vh] flex-col items-center justify-center px-4 py-14 text-center">
      <div className="mb-6 flex size-24 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 sm:size-28">
        <IconPackage aria-hidden="true" className="size-11 sm:size-12" stroke={2.2} />
      </div>
      <h1
        id="orders-empty-title"
        className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        No orders yet
      </h1>
      <p className="mt-3 max-w-sm text-base leading-7 text-slate-500">
        When you place orders, they&apos;ll appear here so you can track them.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-primary-600 px-8 text-base font-semibold text-white shadow-lg shadow-primary-600/20 transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
        <IconShoppingBag aria-hidden="true" className="size-5" />
        Start Shopping
      </Link>
    </section>
  );
}
