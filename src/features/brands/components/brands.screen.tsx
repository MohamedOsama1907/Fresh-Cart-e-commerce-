"use client";

import Image from "next/image";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { IconTag } from "@tabler/icons-react";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import PageHeader from "@/components/PageHeader/PageHeader";
import Pagination from "@/components/Pagination/Pagination";
import { getAllBrands } from "../services/getAllBrands";
import type { BrandsScreenProps } from "../types/brands.types";

export default function BrandsScreen({ page }: BrandsScreenProps) {
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getAllBrands", page, 10],
    queryFn: () => getAllBrands(page, 10),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Brands" }]}
        title="Top Brands"
        subtitle="Shop from your favorite brands"
        icon={<IconTag size={38} stroke={2.2} />}
        background="linear-gradient(90deg, #8b5cf6 0%, #9333ea 50%, #a855f7 100%)"
        iconBackgroundColor="rgba(255, 255, 255, 0.22)"
      />

      {isLoading ? (
        <Loader message="Loading brands..." />
      ) : isError ? (
        <Error
          title="Brands are unavailable"
          message={error.message}
          onRetry={() => void refetch()}
        />
      ) : response ? (
        <main
          className="min-h-[50vh] bg-slate-50/50 py-8 sm:py-10"
          aria-busy={isFetching}>
          <div className="container mx-auto">
            {response.data.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 min-[480px]:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-6">
                  {response.data.map((brand) => (
                    <Link
                      key={brand._id}
                      href={`/brands/${brand._id}`}
                      className="group flex flex-col items-center justify-between rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-purple-200 hover:shadow-md sm:p-4">
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50/80 p-3 flex items-center justify-center">
                        <Image
                          src={brand.image}
                          alt={brand.name}
                          fill
                          unoptimized
                          sizes="(max-width: 479px) 50vw, (max-width: 767px) 33vw, (max-width: 1023px) 25vw, 16vw"
                          className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <span className="mt-3 text-center text-xs font-semibold tracking-wide text-slate-800 transition-colors group-hover:text-purple-600 sm:text-sm">
                        {brand.name}
                      </span>
                    </Link>
                  ))}
                </div>

                <Pagination
                  currentPage={page}
                  totalPages={response.metadata.numberOfPages}
                  basePath="/brands"
                />
              </>
            ) : (
              <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
                No brands were found.
              </p>
            )}
          </div>
        </main>
      ) : null}
    </>
  );
}
