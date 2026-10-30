import ShopScreen from "@/features/shop/components/shop.screen";
import type { ShopPageProps } from "@/features/shop/types/shop.types";

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const parsedPage = Number(rawPage);
  const page = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  return <ShopScreen page={page} />;
}
