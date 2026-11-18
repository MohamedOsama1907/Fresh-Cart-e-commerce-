import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import type { CategoriesProps } from "../types/categories.types";

export default function Categories({ categories }: CategoriesProps) {
  if (categories.length === 0) return null;

  return (
    <section aria-labelledby="shop-by-category" className="container mx-auto py-8 sm:py-11">
      <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
        <h2
          id="shop-by-category"
          className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl"
        >
          <span aria-hidden="true" className="h-7 w-1.5 shrink-0 rounded-full bg-primary-600 sm:h-8" />
          <span>
            Shop By <span className="text-primary-600">Category</span>
          </span>
        </h2>
        <Link
          href="/categories"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs sm:text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          <span className="hidden sm:inline">View All Categories</span>
          <span className="sm:hidden">View All</span>
          <IconArrowRight aria-hidden="true" size={16} stroke={2.5} />
        </Link>
      </div>

      <ul className="grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((category) => (
          <li key={category._id}>
            <Link
              href={`/categories/${category._id}`}
              className="group flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-xs transition duration-200 hover:-translate-y-1 hover:border-primary-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:min-h-48"
            >
              <div className="relative size-20 overflow-hidden rounded-full bg-slate-50 ring-2 ring-slate-100 transition-all duration-300 group-hover:ring-primary-200 sm:size-24">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  unoptimized
                  sizes="(max-width: 639px) 80px, 96px"
                  className="object-cover transition-transform duration-300 group-hover:scale-108"
                />
              </div>
              <span className="text-xs font-bold leading-snug text-slate-800 transition-colors group-hover:text-primary-700 sm:text-sm line-clamp-1">
                {category.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
