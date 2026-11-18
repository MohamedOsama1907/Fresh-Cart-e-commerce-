"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  IconChevronDown,
  IconEye,
  IconFilter,
  IconGridDots,
  IconList,
  IconSearch,
} from "@tabler/icons-react";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import Pagination from "@/components/Pagination/Pagination";
import { getAllBrands } from "@/features/brands/services/getAllBrands";
import { getAllCategories } from "@/features/home/services/getAllCategories";
import {
  getAllProducts,
  type ProductQueryFilters,
} from "@/features/home/services/getAllProducts";
import { ProductCard } from "@/features/products/components/ProductCard";

const productsPerPage = 12;

const priceShortcuts = [
  { label: "Under 500", max: "500" },
  { label: "Under 1K", max: "1000" },
  { label: "Under 5K", max: "5000" },
  { label: "Under 10K", max: "10000" },
];

export default function SearchScreen() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[60vh] bg-slate-50/70 py-12 flex items-center justify-center">
          <Loader message="Loading search catalog..." />
        </main>
      }>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlKeyword = searchParams.get("keyword")?.trim() ?? "";
  const rawPage = Number(searchParams.get("page"));
  const currentPage = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const [keyword, setKeyword] = useState(urlKeyword);
  const [debouncedKeyword, setDebouncedKeyword] = useState(urlKeyword);
  const [prevUrlKeyword, setPrevUrlKeyword] = useState(urlKeyword);
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Keep search keyword in sync if navigated from navbar or external link
  if (urlKeyword !== prevUrlKeyword) {
    setPrevUrlKeyword(urlKeyword);
    setKeyword(urlKeyword);
    setDebouncedKeyword(urlKeyword);
  }

  // Debounce search input to avoid hitting API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [keyword]);

  const activeFilterCount =
    (debouncedKeyword ? 1 : 0) +
    (selectedBrand ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    selectedCategories.length;

  const filters: ProductQueryFilters = {
    keyword: debouncedKeyword,
    sort,
    minPrice: minPrice.trim(),
    maxPrice: maxPrice.trim(),
    brand: selectedBrand,
    categories: selectedCategories,
  };

  const categoriesQuery = useQuery({
    queryKey: ["getAllCategories"],
    queryFn: getAllCategories,
    refetchOnMount: false,
  });

  const brandsQuery = useQuery({
    queryKey: ["getAllBrands", 1, 100],
    queryFn: () => getAllBrands(1, 100),
    refetchOnMount: false,
  });

  const productsQuery = useQuery({
    queryKey: ["getAllProducts", currentPage, productsPerPage, filters],
    queryFn: () => getAllProducts(currentPage, productsPerPage, filters),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId]
    );
  };

  const handlePriceShortcut = (max: string) => {
    setMinPrice("0");
    setMaxPrice(max);
  };

  const handleClearFilters = () => {
    setKeyword("");
    setDebouncedKeyword("");
    setSort("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedBrand("");
    setSelectedCategories([]);
    router.replace("/search", { scroll: false });
  };

  const searchPath = debouncedKeyword
    ? `/search?keyword=${encodeURIComponent(debouncedKeyword)}`
    : "/search";

  return (
    <main className="min-h-[60vh] bg-slate-50/70">
      {/* Top Search & Breadcrumb Bar */}
      <section className="border-b border-slate-200/80 bg-white">
        <div className="container mx-auto py-5 sm:py-6">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
            <Link href="/" className="transition-colors hover:text-primary-700">Home</Link>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span aria-current="page" className="font-semibold text-slate-800">Search Products</span>
          </nav>
          <div className="relative w-full max-w-2xl">
            <label htmlFor="catalog-search" className="sr-only">Search products</label>
            <IconSearch size={19} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="catalog-search"
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by product name, keywords..."
              autoComplete="off"
              className="min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 sm:text-base"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto py-6 sm:py-8">
        {/* Mobile Filter Toggle & Summary */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFilterOpen((open) => !open)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-primary-600">
            <IconFilter size={16} className="text-primary-600" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-semibold text-rose-600 hover:underline">
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
          {/* Filter Sidebar */}
          <aside
            aria-label="Product filters"
            className={`${
              mobileFilterOpen ? "block" : "hidden"
            } lg:block min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs lg:sticky lg:top-28`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2">
                <IconFilter size={18} className="text-primary-600" />
                <h2 className="text-sm font-bold text-slate-900">Filters</h2>
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline">
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <section aria-labelledby="category-filter-heading" className="pt-4">
              <h3 id="category-filter-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Categories
              </h3>
              {categoriesQuery.isPending ? (
                <p className="mt-3 text-xs text-slate-400">Loading categories…</p>
              ) : categoriesQuery.isError ? (
                <p className="mt-3 text-xs text-rose-500">Could not load categories.</p>
              ) : (
                <ul className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1 text-xs">
                  {categoriesQuery.data.data.map((category) => (
                    <li key={category._id}>
                      <label className="flex cursor-pointer items-center gap-2.5 text-slate-700 hover:text-primary-700">
                        <input
                          type="checkbox"
                          value={category._id}
                          checked={selectedCategories.includes(category._id)}
                          onChange={() => handleCategoryToggle(category._id)}
                          className="size-4 shrink-0 rounded border-slate-300 accent-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                        />
                        <span className="truncate">{category.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="my-5 border-t border-slate-100" />

            {/* Price Filter */}
            <section aria-labelledby="price-filter-heading">
              <h3 id="price-filter-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Price Range (EGP)
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <label className="min-w-0 text-[11px] font-semibold text-slate-600">
                  Min
                  <input
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-2.5 text-xs text-slate-800 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </label>
                <label className="min-w-0 text-[11px] font-semibold text-slate-600">
                  Max
                  <input
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    placeholder="No limit"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="mt-1 h-9 w-full rounded-xl border border-slate-200 px-2.5 text-xs text-slate-800 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </label>
              </div>

              {/* Quick Price Shortcuts */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {priceShortcuts.map((shortcut) => (
                  <button
                    key={shortcut.label}
                    type="button"
                    onClick={() => handlePriceShortcut(shortcut.max)}
                    className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-primary-50 hover:text-primary-700 active:scale-95">
                    {shortcut.label}
                  </button>
                ))}
              </div>
            </section>

            <div className="my-5 border-t border-slate-100" />

            {/* Brand Filter */}
            <section aria-labelledby="brand-filter-heading">
              <h3 id="brand-filter-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Brands
              </h3>
              {brandsQuery.isPending ? (
                <p className="mt-3 text-xs text-slate-400">Loading brands…</p>
              ) : brandsQuery.isError ? (
                <p className="mt-3 text-xs text-rose-500">Could not load brands.</p>
              ) : (
                <ul className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1 text-xs">
                  <li>
                    <label className="flex cursor-pointer items-center gap-2.5 text-slate-700 hover:text-primary-700">
                      <input
                        type="radio"
                        name="search-brand-filter"
                        value=""
                        checked={selectedBrand === ""}
                        onChange={() => setSelectedBrand("")}
                        className="size-4 shrink-0 border-slate-300 accent-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                      />
                      <span className="truncate">All Brands</span>
                    </label>
                  </li>
                  {brandsQuery.data.data.map((item) => (
                    <li key={item._id}>
                      <label className="flex cursor-pointer items-center gap-2.5 text-slate-700 hover:text-primary-700">
                        <input
                          type="radio"
                          name="search-brand-filter"
                          value={item._id}
                          checked={selectedBrand === item._id}
                          onChange={() => setSelectedBrand(item._id)}
                          className="size-4 shrink-0 border-slate-300 accent-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                        />
                        <span className="truncate">{item.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </aside>

          {/* Main Results Section */}
          <section aria-label="Search products" className="min-w-0" aria-busy={productsQuery.isFetching}>
            {/* View Mode & Sort Controls Bar */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs">
              <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1" aria-label="Layout view switcher">
                <button
                  type="button"
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                  onClick={() => setViewMode("grid")}
                  className={`flex size-8 items-center justify-center rounded-lg transition ${
                    viewMode === "grid"
                      ? "bg-white text-primary-700 shadow-xs font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}>
                  <IconGridDots size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                  onClick={() => setViewMode("list")}
                  className={`flex size-8 items-center justify-center rounded-lg transition ${
                    viewMode === "list"
                      ? "bg-white text-primary-700 shadow-xs font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}>
                  <IconList size={18} aria-hidden="true" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
                <label htmlFor="search-sort" className="shrink-0">Sort by:</label>
                <div className="relative">
                  <select
                    id="search-sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-9 min-w-36 appearance-none rounded-xl border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-700 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100">
                    <option value="">Featured / Relevance</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="-ratingsAverage">Highest Rated</option>
                  </select>
                  <IconChevronDown
                    size={14}
                    aria-hidden="true"
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Results Output */}
            {productsQuery.isPending ? (
              <div className="py-16">
                <Loader message="Loading products..." />
              </div>
            ) : productsQuery.isError ? (
              <Error
                title="Unable to load products"
                message={productsQuery.error.message}
                onRetry={() => void productsQuery.refetch()}
              />
            ) : productsQuery.data ? (
              <>
                <div className="mb-4 flex items-center justify-between text-xs sm:text-sm text-slate-500">
                  <p>
                    Showing <span className="font-bold text-slate-800">{productsQuery.data.data.length}</span> products
                  </p>
                  {debouncedKeyword && (
                    <p className="text-primary-700">
                      Searching for &ldquo;{debouncedKeyword}&rdquo;
                    </p>
                  )}
                </div>

                {productsQuery.data.data.length > 0 ? (
                  <>
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 gap-3.5 min-[440px]:grid-cols-2 sm:gap-4 xl:grid-cols-4"
                          : "flex flex-col gap-3.5"
                      }>
                      {productsQuery.data.data.map((product) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          compact
                          layout={viewMode}
                        />
                      ))}
                    </div>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={productsQuery.data.metadata.numberOfPages}
                      basePath={searchPath}
                    />
                  </>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
                    <IconEye size={36} aria-hidden="true" className="mx-auto text-slate-300" stroke={1.5} />
                    <h3 className="mt-3 text-base font-bold text-slate-800">No products match your filters</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Try adjusting your search keywords, price range, or categories.
                    </p>
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-primary-700">
                      Clear All Filters
                    </button>
                  </div>
                )}
              </>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
