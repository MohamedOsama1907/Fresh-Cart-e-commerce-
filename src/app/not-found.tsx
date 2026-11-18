import Image from "next/image";
import Link from "next/link";
import notFoundImage from "@/assets/images/404.svg";
import { IconHome, IconSearch, IconShoppingBag } from "@tabler/icons-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto w-full max-w-lg">
        <div className="relative mx-auto mb-8 h-64 w-full max-w-sm sm:h-72">
          <Image
            src={notFoundImage}
            alt="Page not found illustration"
            fill
            priority
            className="object-contain"
          />
        </div>

        <span className="inline-flex items-center rounded-full bg-primary-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-700 ring-1 ring-primary-100">
          404 Error
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Page Not Found
        </h1>

        <p className="mt-3 text-base text-slate-600 sm:text-lg">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or never existed.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 font-semibold text-white shadow-md shadow-primary-600/20 transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <IconHome size={19} aria-hidden="true" />
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 font-semibold text-slate-700 transition hover:border-primary-300 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <IconShoppingBag size={19} aria-hidden="true" />
            Explore Catalog
          </Link>
          <Link
            href="/search"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 font-semibold text-slate-700 transition hover:border-primary-300 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <IconSearch size={19} aria-hidden="true" />
            Search Products
          </Link>
        </div>
      </div>
    </main>
  );
}
