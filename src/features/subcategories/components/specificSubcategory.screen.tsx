"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { IconArrowLeft, IconCategory2 } from "@tabler/icons-react";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import PageHeader from "@/components/PageHeader/PageHeader";
import { getSubcategoryById } from "../services/getSubcategoryById";

interface SpecificSubcategoryScreenProps {
  id: string;
}

export default function SpecificSubcategoryScreen({ id }: SpecificSubcategoryScreenProps) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["getSpecificSubcategory", id],
    queryFn: () => getSubcategoryById(id),
    enabled: Boolean(id),
    refetchOnMount: false,
  });
  const subcategory = data?.data;

  return (
    <>
      {isLoading ? (
        <Loader message="Loading subcategory..." />
      ) : isError ? (
        <Error
          title="This subcategory is unavailable"
          message={error.message}
          onRetry={() => void refetch()}
        />
      ) : subcategory ? (
        <>
          <PageHeader
            breadcrumbs={[
              { label: "Home", href: "/" },
              { label: "Subcategories", href: "/subcategories" },
              { label: subcategory.name },
            ]}
            title={subcategory.name}
            subtitle="A focused collection within the Fresh Cart catalog."
            icon={<IconCategory2 size={42} stroke={2.5} />}
            backgroundColor="#16a34a"
          />
          <main className="container mx-auto min-h-[40vh] py-8 sm:py-12">
            <section className="mx-auto max-w-3xl rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-600">
                Subcategory
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {subcategory.name}
              </h1>
              <p className="mt-4 leading-7 text-slate-600">
                Explore the {subcategory.name} collection in the Fresh Cart catalog.
              </p>
              <Link
                href="/subcategories"
                className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-700 transition-colors hover:border-primary-300 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                <IconArrowLeft size={18} aria-hidden="true" />
                All subcategories
              </Link>
            </section>
          </main>
        </>
      ) : null}
    </>
  );
}
