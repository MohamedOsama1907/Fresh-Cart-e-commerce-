"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { IconArrowRight, IconCategory2, IconShoppingBag } from "@tabler/icons-react";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import PageHeader from "@/components/PageHeader/PageHeader";
import { getCategoryById } from "../services/getCategoryById";

interface SpecificCategoryScreenProps {
  id: string;
}

export default function SpecificCategoryScreen({
  id,
}: SpecificCategoryScreenProps) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["getSpecificCategory", id],
    queryFn: () => getCategoryById(id),
    enabled: Boolean(id),
    refetchOnMount: false,
  });
  const category = data?.data;

  return (
    <>
      {isLoading ? (
        <main className="min-h-[60vh] bg-slate-50/70 py-16 flex items-center justify-center">
          <Loader message="Loading category..." />
        </main>
      ) : isError ? (
        <main className="min-h-[60vh] bg-slate-50/70 py-16">
          <div className="container mx-auto max-w-2xl">
            <Error
              title="This category is unavailable"
              message={error.message}
              onRetry={() => void refetch()}
            />
          </div>
        </main>
      ) : category ? (
        <>
          <PageHeader
            breadcrumbs={[
              { label: "Home", href: "/" },
              { label: "Categories", href: "/categories" },
              { label: category.name },
            ]}
            title={category.name}
            subtitle={`Explore our complete selection in the ${category.name} collection`}
            icon={<IconCategory2 size={38} stroke={2.2} />}
          />
          <main className="min-h-[50vh] bg-slate-50/70 py-8 sm:py-12">
            <div className="container mx-auto max-w-5xl">
              <section className="grid items-center gap-7 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-10 md:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)] md:gap-10">
                <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-100 p-4">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    unoptimized
                    sizes="(max-width: 767px) 100vw, 50vw"
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="py-2">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary-600">
                    Category Overview
                  </span>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                    {category.name}
                  </h2>
                  <p className="mt-3 leading-relaxed text-slate-600 sm:text-base">
                    Browse the FreshCart catalog and discover high quality items sourced directly for the {category.name} department.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/shop"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-primary-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
                      <IconShoppingBag size={17} />
                      Browse Catalog
                    </Link>
                    <Link
                      href="/subcategories"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                      View Subcategories
                      <IconArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </>
      ) : null}
    </>
  );
}
