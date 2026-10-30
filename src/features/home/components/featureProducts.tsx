import { ProductCard } from "@/features/products/components/ProductCard";
import type { FeatureProductsProps } from "../types/featureProducts.types";

export default function FeatureProducts({ products }: FeatureProductsProps) {
  if (products.length === 0) return null;

  return (
    <section
      aria-labelledby="featured-products"
      className="container mx-auto py-8 sm:py-10">
      <h2
        id="featured-products"
        className="mb-7 flex items-center gap-3 text-2xl font-bold tracking-tight text-slate-800 sm:mb-9 sm:text-3xl">
        <span
          aria-hidden="true"
          className="h-9 w-1.5 shrink-0 rounded-full bg-primary-600 sm:h-10"
        />
        <span>
          Featured <span className="text-primary-600">Products</span>
        </span>
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
