import type { Metadata } from "next";
import BrandDetailsScreen from "@/features/brands/components/SpecificBrand.screen";

export const metadata: Metadata = {
  title: "Brand Products - FreshCart",
  description: "Explore products from your favorite brands on FreshCart.",
};

export default async function BrandDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const parsedPage = Number(Array.isArray(pageParam) ? pageParam[0] : pageParam);
  const page = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  return <BrandDetailsScreen id={id} page={page} />;
}
