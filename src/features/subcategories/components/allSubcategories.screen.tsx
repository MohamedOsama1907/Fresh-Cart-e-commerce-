"use client";

import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  IconArrowRight,
  IconCategory2,
  IconFolderFilled,
} from "@tabler/icons-react";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import PageHeader from "@/components/PageHeader/PageHeader";
import Pagination from "@/components/Pagination/Pagination";
import { getSubcategories } from "../services/getSubcategories";

interface AllSubcategoriesScreenProps {
  page: number;
}

export default function AllSubcategoriesScreen({ page }: AllSubcategoriesScreenProps) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["getAllSubcategories", page, 10],
    queryFn: () => getSubcategories(page, 10),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Subcategories" }]}
        title="Explore Subcategories"
        subtitle="Find a more specific collection for what you are looking for."
        icon={<IconCategory2 size={42} stroke={2.5} />}
        backgroundColor="#16a34a"
      />
      {isLoading ? (
        <Loader message="Loading subcategories..." />
      ) : isError ? (
        <Error
          title="Subcategories are unavailable"
          message={error.message}
          onRetry={() => void refetch()}
        />
      ) : data ? (
        <main className="min-h-[50vh] bg-slate-50 py-7 sm:py-10" aria-busy={isFetching}>
          <div className="container mx-auto">
            <p className="mb-5 text-sm text-slate-500 sm:mb-6 sm:text-base">
              Showing {data.data.length} of {data.results} subcategories
            </p>
            {data.data.length > 0 ? (
              <>
                <ul className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                  {data.data.map((subcategory) => (
                    <li key={subcategory._id}>
                      <Link
                        href={`/subcategory/${subcategory._id}`}
                        className="group flex min-h-[178px] h-full flex-col items-start rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-lg focus-visible:border-primary-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:p-6"
                      >
                        <span className="flex size-14 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100 group-focus-visible:bg-primary-100">
                          <IconFolderFilled size={28} aria-hidden="true" />
                        </span>
                        <span className="mt-4 block text-base font-bold leading-6 text-slate-800 transition-colors group-hover:text-primary-600 group-focus-visible:text-primary-600 sm:text-lg">
                          {subcategory.name}
                        </span>
                        <span className="mt-1 flex min-h-5 items-center gap-2 text-sm font-medium text-primary-600 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 max-md:opacity-100">
                          Browse Products
                          <IconArrowRight size={16} aria-hidden="true" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Pagination
                  currentPage={page}
                  totalPages={data.metadata.numberOfPages}
                  basePath="/subcategories"
                />
              </>
            ) : (
              <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
                No subcategories were found.
              </p>
            )}
          </div>
        </main>
      ) : null}
    </>
  );
}
