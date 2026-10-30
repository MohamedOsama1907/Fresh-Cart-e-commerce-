import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import type { CategoriesProps } from "../types/categories.types";

export default function Categories({ categories }: CategoriesProps) {
  if (categories.length === 0) return null;

  return (
    <section aria-labelledby="shop-by-category" className="container mx-auto py-10 sm:py-12">
      <div className="mb-8 flex items-center justify-between gap-4 sm:mb-10">
        <h2
          id="shop-by-category"
          className="flex items-center gap-3 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl"
        >
          <span aria-hidden="true" className="h-9 w-1.5 shrink-0 rounded-full bg-primary-600 sm:h-10" />
          <span>
            Shop By <span className="text-primary-600">Category</span>
          </span>
        </h2>
        <Link
          href="/categories"
          className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 sm:text-base"
        >
          <span className="hidden sm:inline">View All Categories</span>
          <span className="sm:hidden">View All</span>
          <IconArrowRight aria-hidden="true" size={20} stroke={2} />
        </Link>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
        {categories.map((category) => (
          <li key={category._id}>
            <Link
              href={`/categories/${category._id}`}
              className="group flex min-h-44 flex-col items-center justify-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-5 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary-100 hover:shadow-md sm:min-h-[188px] sm:gap-4"
            >
              <Image
                src={category.image}
                alt=""
                width={104}
                height={104}
                unoptimized
                className="size-24 rounded-full object-cover sm:size-[104px]"
              />
              <span className="text-sm font-medium leading-5 text-slate-800 transition-colors group-hover:text-primary-700 sm:text-base">
                {category.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
