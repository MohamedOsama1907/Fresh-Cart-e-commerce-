"use client";

import { useQuery } from "@tanstack/react-query";
import { IconFilter, IconTag } from "@tabler/icons-react";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import Link from "next/link";
import PageHeader from "@/components/PageHeader/PageHeader";
import Pagination from "@/components/Pagination/Pagination";
import { ProductCard } from "@/features/products/components/ProductCard";
import { getBrandById } from "../services/getBrandById";
import { getProductsByBrand } from "../services/getProductsByBrand";

interface BrandDetailsScreenProps {
  id: string;
  page: number;
}

export default function BrandDetailsScreen({
  id,
  page,
}: BrandDetailsScreenProps) {
  const brandQuery = useQuery({
    queryKey: ["getBrandById", id],
    queryFn: () => getBrandById(id),
    enabled: Boolean(id),
    refetchOnMount: false,
  });
  const productsQuery = useQuery({
    queryKey: ["getProductsByBrand", id, page, 12],
    queryFn: () => getProductsByBrand(id, page, 12),
    enabled: Boolean(id),
    refetchOnMount: false,
  });

  if (brandQuery.isLoading || productsQuery.isLoading) {
    return (
      <main className="min-h-[60vh] bg-slate-50/70 py-16 flex items-center justify-center">
        <Loader message="Loading brand collection..." />
      </main>
    );
  }

  if (brandQuery.isError || productsQuery.isError) {
    const errorMessage =
      brandQuery.error?.message ??
      productsQuery.error?.message ??
      "Please try again.";
    return (
      <main className="min-h-[60vh] bg-slate-50/70 py-16">
        <div className="container mx-auto max-w-2xl">
          <Error
            title="Brand products are unavailable"
            message={errorMessage}
            onRetry={() => {
              void brandQuery.refetch();
              void productsQuery.refetch();
            }}
          />
        </div>
      </main>
    );
  }

  const brand = brandQuery.data?.data;
  const response = productsQuery.data;

  if (!brand || !response) return null;

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Brands", href: "/brands" },
          { label: brand.name },
        ]}
        title={brand.name}
        subtitle={`Explore all official products from ${brand.name}`}
        image={brand.image}
        imageAlt={`${brand.name} logo`}
        iconBackgroundColor="rgba(255, 255, 255, 0.95)"
      />

      <main
        className="min-h-[55vh] bg-slate-50/70 py-7 sm:py-10"
        aria-busy={productsQuery.isFetching}
      >
        <div className="container mx-auto">
          {/* Active Filter Pill */}
          <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <IconFilter size={16} className="text-primary-600" aria-hidden="true" />
              Active Brand:
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 font-semibold text-primary-700">
              <IconTag size={13} aria-hidden="true" />
              {brand.name}
            </span>
            <Link
              href="/shop"
              className="ml-1 text-slate-500 underline underline-offset-2 transition hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-primary-600"
            >
              Browse all brands
            </Link>
          </div>

          <p className="mb-5 text-xs sm:text-sm font-semibold text-slate-500">
            Showing <span className="font-bold text-slate-900">{response.data.length}</span> products
          </p>

          {response.data.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-3.5 min-[440px]:grid-cols-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {response.data.map((product) => (
                  <ProductCard key={product._id} product={product} compact />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={response.metadata.numberOfPages}
                basePath={`/brands/${id}`}
              />
            </>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
              <IconTag size={36} className="mx-auto text-slate-300" stroke={1.5} />
              <h3 className="mt-3 text-base font-bold text-slate-800">
                No products found for {brand.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Try exploring other brands or our all-products catalog.
              </p>
              <Link
                href="/shop"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-700">
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
