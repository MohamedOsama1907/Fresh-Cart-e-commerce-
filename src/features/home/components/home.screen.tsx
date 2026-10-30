"use client";

import { useQuery } from "@tanstack/react-query";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import { getAllCategories } from "../services/getAllCategories";
import { getAllProducts } from "../services/getAllProducts";
import StoreFeatures from "./storeFeatures";
import Categories from "./categories";
import FeatureProducts from "./featureProducts";
import Slider from "./slider";
import OffersBanners from "./offersBanners";
import DownloadAppBanner from "./downloadAppBanner";

export default function HomeScreen() {
  const categoriesQuery = useQuery({
    queryKey: ["getAllCategories"],
    queryFn: getAllCategories,
    refetchOnMount: false,
  });
  const productsQuery = useQuery({
    queryKey: ["getAllProducts", 1, 40],
    queryFn: () => getAllProducts(1, 40),
    refetchOnMount: false,
  });

  return (
    <>
      <Slider />
      <StoreFeatures />

      {categoriesQuery.isLoading ? (
        <Loader message="Loading categories..." />
      ) : categoriesQuery.isError ? (
        <Error
          title="Categories are unavailable"
          message={categoriesQuery.error.message}
          onRetry={() => void categoriesQuery.refetch()}
        />
      ) : categoriesQuery.data ? (
        <Categories categories={categoriesQuery.data.data} />
      ) : null}

      <OffersBanners />

      {productsQuery.isLoading ? (
        <Loader message="Loading featured products..." />
      ) : productsQuery.isError ? (
        <Error
          title="Products are unavailable"
          message={productsQuery.error.message}
          onRetry={() => void productsQuery.refetch()}
        />
      ) : productsQuery.data ? (
        <FeatureProducts products={productsQuery.data.data} />
      ) : null}

      <DownloadAppBanner />
    </>
  );
}
