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
        subtitle="Browse our wide range of product categories"
        icon={<IconCategory2 size={42} stroke={2.5} />}
        backgroundColor="#16a34a"
      />

      {isLoading ? (
        <Loader message="Loading categories..." />
      ) : isError ? (
        <Error
          title="Categories are unavailable"
          message={error.message}
          onRetry={() => void refetch()}
        />
      ) : response ? (
        <main className="min-h-[60vh] bg-slate-50 py-8 sm:py-10">
          <div className="container mx-auto">
            {response.data.length > 0 ? (
              <ul className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-5">
                {response.data.map((category) => (
                  <li key={category._id}>
                    <Link
                      href={`/categories/${category._id}`}
                      className="group flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl focus-visible:border-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 sm:p-5">
                      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          unoptimized
                          sizes="(max-width: 479px) 100vw, (max-width: 767px) 50vw, (max-width: 1279px) 33vw, 20vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <span className="mt-4 min-h-6 px-1 text-center text-base font-bold leading-6 text-slate-800 transition-colors group-hover:text-primary-600 group-focus-visible:text-primary-600 sm:text-lg">
                        {category.name}
                      </span>
                      <span className="mt-2 flex min-h-5 items-center justify-center gap-1 text-sm font-medium text-primary-600 opacity-0 transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                        View Subcategories
                        <IconArrowRight
                          size={16}
                          stroke={2}
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
                No categories were found.
              </p>
            )}
          </div>
        </main>
      ) : null}
    </>
  );
}
