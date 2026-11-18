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
    queryKey: ["getAllBrands", page, 18],
    queryFn: () => getAllBrands(page, 18),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Brands" }]}
        title="Featured Brands"
        subtitle="Discover trusted quality from leading local and international brands"
        icon={<IconTag size={38} stroke={2.2} />}
      />

      {isLoading ? (
        <main className="min-h-[60vh] bg-slate-50/70 py-16 flex items-center justify-center">
          <Loader message="Loading brands..." />
        </main>
      ) : isError ? (
        <main className="min-h-[60vh] bg-slate-50/70 py-16">
          <div className="container mx-auto max-w-2xl">
            <Error
              title="Brands are unavailable"
              message={error.message}
              onRetry={() => void refetch()}
            />
          </div>
        </main>
      ) : response ? (
        <main
          className="min-h-[55vh] bg-slate-50/70 py-7 sm:py-10"
          aria-busy={isFetching}>
          <div className="container mx-auto">
            {response.data.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-3 min-[440px]:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
                  {response.data.map((brand) => (
                    <Link
                      key={brand._id}
                      href={`/brands/${brand._id}`}
                      className="group flex flex-col items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition duration-200 hover:-translate-y-1 hover:border-primary-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50/80 p-3 flex items-center justify-center">
                        <Image
                          src={brand.image}
                          alt={brand.name}
                          fill
                          unoptimized
                          sizes="(max-width: 479px) 50vw, (max-width: 767px) 33vw, (max-width: 1023px) 25vw, 16vw"
                          className="object-contain p-2.5 transition-transform duration-300 group-hover:scale-108"
                        />
                      </div>
                      <span className="mt-3 text-center text-xs font-bold tracking-tight text-slate-800 transition-colors group-hover:text-primary-700 sm:text-sm line-clamp-1">
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
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
                <IconTag size={36} className="mx-auto text-slate-300" stroke={1.5} />
                <h3 className="mt-3 text-base font-bold text-slate-800">No brands found</h3>
                <p className="mt-1 text-xs text-slate-500">Check back later for newly added brands.</p>
              </div>
            )}
          </div>
        </main>
      ) : null}
    </>
  );
}
