"use client";

import { useQuery } from "@tanstack/react-query";
import { IconFilter, IconTag, IconX } from "@tabler/icons-react";
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
    queryKey: ["getProductsByBrand", id, page, 10],
    queryFn: () => getProductsByBrand(id, page, 10),
    enabled: Boolean(id),
    refetchOnMount: false,
  });

  if (brandQuery.isLoading || productsQuery.isLoading) {
    return <Loader message="Loading brand products..." />;
  }

  if (brandQuery.isError || productsQuery.isError) {
    const errorMessage =
      brandQuery.error?.message ??
      productsQuery.error?.message ??
      "Please try again.";
    return (
      <Error
        title="Brand products are unavailable"
        message={errorMessage}
        onRetry={() => {
          void brandQuery.refetch();
          void productsQuery.refetch();
        }}
      />
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
        subtitle={`Explore products from ${brand.name}`}
        image={brand.image}
        imageAlt={`${brand.name} logo`}
        backgroundColor="#16a34a"
        iconBackgroundColor="rgba(255, 255, 255, 0.92)"
      />

      <main
        className="min-h-[50vh] bg-slate-50/60 py-8 sm:py-10"
        aria-busy={productsQuery.isFetching}
      >
        <div className="container mx-auto">
          <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm sm:mb-6">
            <IconFilter aria-hidden="true" className="text-slate-600" size={18} />
            <span className="font-medium text-slate-600">Active Filters:</span>
            <Link
              href="/shop"
              aria-label={`Remove ${brand.name} filter and browse all products`}
              className="inline-flex min-h-8 items-center gap-2 rounded-full bg-violet-100 px-3 text-violet-800 transition-colors hover:bg-violet-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              <IconTag size={14} aria-hidden="true" />
              {brand.name}
              <IconX size={15} aria-hidden="true" />
            </Link>
            <Link
              href="/shop"
              className="ml-1 text-slate-600 underline underline-offset-2 transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Clear all
            </Link>
          </div>

          <p className="mb-5 text-sm text-slate-600 sm:mb-6">
            Showing {response.data.length} products
          </p>

          {response.data.length > 0 ? (
            <>
              <ul className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
                {response.data.map((product) => (
                  <li key={product._id}>
                    <ProductCard product={product} className="h-full" compact />
                  </li>
                ))}
              </ul>
              <Pagination
                currentPage={page}
                totalPages={response.metadata.numberOfPages}
                basePath={`/brands/${id}`}
              />
            </>
          ) : (
            <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
              No products were found for {brand.name}.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
