"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import PageHeader from "@/components/PageHeader/PageHeader";
import Pagination from "@/components/Pagination/Pagination";
import { getAllProducts } from "@/features/home/services/getAllProducts";
import { ProductCard } from "@/features/products/components/ProductCard";
import { IconPackage, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import type { ShopScreenProps } from "../types/shop.types";

export default function ShopScreen({ page }: ShopScreenProps) {
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getAllProducts", page, 40],
    queryFn: () => getAllProducts(page, 40),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "All Products" }]}
        title="All Products"
        subtitle="Explore our complete collection of fresh foods, produce, and daily essentials"
        icon={<IconPackage size={38} stroke={2.2} />}
      />
      {isLoading ? (
        <main className="min-h-[60vh] bg-slate-50/70 py-12 flex items-center justify-center">
          <Loader message="Loading catalog..." />
        </main>
      ) : isError ? (
        <main className="min-h-[60vh] bg-slate-50/70 py-12">
          <div className="container mx-auto">
            <Error
              title="Products are temporarily unavailable"
              message={error.message}
              onRetry={() => void refetch()}
            />
          </div>
        </main>
      ) : response ? (
        <main className="min-h-[60vh] bg-slate-50/70 py-7 sm:py-10" aria-busy={isFetching}>
          <div className="container mx-auto">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
              <p className="text-xs sm:text-sm font-semibold text-slate-500">
                Showing <span className="text-slate-900 font-bold">{response.data.length}</span> products
              </p>
              <Link
                href="/search"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline">
                <IconSearch size={16} /> Filter &amp; Search
              </Link>
            </div>

            {response.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-3.5 min-[440px]:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                  {response.data.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                <Pagination
                  currentPage={page}
                  totalPages={response.metadata.numberOfPages}
                  basePath="/shop"
                />
              </>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
                <IconPackage size={40} className="mx-auto text-slate-300" stroke={1.5} />
                <h3 className="mt-4 text-base font-bold text-slate-800">No products found</h3>
                <p className="mt-1 text-sm text-slate-500">Check back soon for new arrivals.</p>
              </div>
            )}
          </div>
        </main>
      ) : null}
    </>
  );
}
