"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { IconArrowRight, IconCategory2 } from "@tabler/icons-react";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import PageHeader from "@/components/PageHeader/PageHeader";
import { getAllCategories } from "@/features/home/services/getAllCategories";

export default function AllCategoriesScreen() {
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getAllCategories"],
    queryFn: getAllCategories,
    refetchOnMount: false,
  });

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Categories" }]}
        title="All Categories"
        subtitle="Browse our comprehensive department catalog and collections"
        icon={<IconCategory2 size={38} stroke={2.2} />}
      />

      {isLoading ? (
        <main className="min-h-[60vh] bg-slate-50/70 py-16 flex items-center justify-center">
          <Loader message="Loading categories..." />
        </main>
      ) : isError ? (
        <main className="min-h-[60vh] bg-slate-50/70 py-16">
          <div className="container mx-auto max-w-2xl">
            <Error
              title="Categories are unavailable"
              message={error.message}
              onRetry={() => void refetch()}
            />
          </div>
        </main>
      ) : response ? (
        <main className="min-h-[55vh] bg-slate-50/70 py-7 sm:py-10">
          <div className="container mx-auto">
            {response.data.length > 0 ? (
              <ul className="grid grid-cols-1 gap-3.5 min-[440px]:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-5">
                {response.data.map((category) => (
                  <li key={category._id}>
                    <Link
                      href={`/categories/${category._id}`}
                      className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition duration-200 hover:-translate-y-1 hover:border-primary-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:p-5">
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-100 transition-all duration-300 group-hover:ring-primary-200">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          unoptimized
                          sizes="(max-width: 479px) 100vw, (max-width: 767px) 50vw, (max-width: 1279px) 33vw, 20vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-108"
                        />
                      </div>
                      <span className="mt-3.5 min-h-6 px-1 text-center text-sm font-bold leading-tight text-slate-800 transition-colors group-hover:text-primary-700 sm:text-base">
                        {category.name}
                      </span>
                      <span className="mt-2 flex min-h-5 items-center justify-center gap-1 text-xs font-semibold text-primary-600 opacity-90 sm:opacity-0 transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                        View Subcategories
                        <IconArrowRight
                          size={15}
                          stroke={2.5}
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
                <IconCategory2 size={36} className="mx-auto text-slate-300" stroke={1.5} />
                <h3 className="mt-3 text-base font-bold text-slate-800">No categories found</h3>
                <p className="mt-1 text-xs text-slate-500">Check back soon for updated collections.</p>
              </div>
            )}
          </div>
        </main>
      ) : null}
    </>
  );
}
