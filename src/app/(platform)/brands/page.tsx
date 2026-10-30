import type { Metadata } from "next";
import BrandsScreen from "@/features/brands/components/brands.screen";
import type { BrandsPageProps } from "@/features/brands/types/brands.types";

export const metadata: Metadata = {
  title: "Top Brands - FreshCart",
  description: "Shop from your favorite brands on FreshCart",
};

export default async function BrandsPage({ searchParams }: BrandsPageProps) {
  const params = await searchParams;
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const parsedPage = Number(rawPage);
  const page =
    Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  return <BrandsScreen page={page} />;
}
