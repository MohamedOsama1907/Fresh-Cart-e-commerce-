"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { IconArrowRight, IconCategory2 } from "@tabler/icons-react";
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
        <Loader message="Loading category..." />
      ) : isError ? (
        <Error
          title="This category is unavailable"
          message={error.message}
          onRetry={() => void refetch()}
        />
      ) : category ? (
        <>
          <PageHeader
            breadcrumbs={[
              { label: "Home", href: "/" },
              { label: "Categories", href: "/categories" },
              { label: category.name },
            ]}
            title={category.name}
            subtitle="Explore this collection and find the products you need."
            icon={<IconCategory2 size={42} stroke={2.5} />}
            backgroundColor="#16a34a"
          />
          <main className="container mx-auto min-h-[45vh] py-8 sm:py-12">
            <section className="grid items-center gap-7 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8 md:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)] md:gap-10">
              <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl bg-white">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  unoptimized
                  sizes="(max-width: 767px) 100vw, 50vw"
                  className="object-contain p-3 sm:p-5"
                  priority
                />
              </div>
              <div className="py-2 md:py-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-600">
                  Shop by category
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {category.name}
                </h1>
                <p className="mt-4 max-w-prose leading-7 text-slate-600">
                  Browse the Fresh Cart catalog and discover items from the {category.name} collection.
                </p>
                <Link
                  href="/subcategories"
                  className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Browse subcategories
                  <IconArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </section>
          </main>
        </>
      ) : null}
    </>
  );
}
