import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { ProductCard } from "@/features/products/components/ProductCard";
import type { FeatureProductsProps } from "../types/featureProducts.types";

export default function FeatureProducts({ products }: FeatureProductsProps) {
  if (products.length === 0) return null;

  return (
    <section
      aria-labelledby="featured-products"
      className="container mx-auto py-8 sm:py-11">
      <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
        <h2
          id="featured-products"
          className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
          <span
            aria-hidden="true"
            className="h-7 w-1.5 shrink-0 rounded-full bg-primary-600 sm:h-8"
          />
          <span>
            Featured <span className="text-primary-600">Products</span>
          </span>
        </h2>
        <Link
          href="/shop"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs sm:text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          <span className="hidden sm:inline">View All Products</span>
          <span className="sm:hidden">View All</span>
          <IconArrowRight aria-hidden="true" size={16} stroke={2.5} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3.5 min-[440px]:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
