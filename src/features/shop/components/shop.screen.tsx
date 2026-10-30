"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import PageHeader from "@/components/PageHeader/PageHeader";
import Pagination from "@/components/Pagination/Pagination";
import { getAllProducts } from "@/features/home/services/getAllProducts";
import { ProductCard } from "@/features/products/components/ProductCard";
import { IconPackage } from "@tabler/icons-react";
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
        subtitle="Explore our complete product collection"
        icon={<IconPackage size={42} stroke={2.5} />}
        backgroundColor="#16a34a"
      />
      {isLoading ? (
        <Loader message="Loading products..." />
      ) : isError ? (
        <Error
          title="Products are unavailable"
          message={error.message}
          onRetry={() => void refetch()}
        />
      ) : response ? (
        <main className="container mx-auto py-8 sm:py-10" aria-busy={isFetching}>
          <p className="mb-6 text-sm text-slate-500 sm:text-base">
            Showing {response.data.length} products
          </p>

          {response.data.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
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
            <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
              No products were found.
            </p>
          )}
        </main>
      ) : null}
    </>
  );
}
