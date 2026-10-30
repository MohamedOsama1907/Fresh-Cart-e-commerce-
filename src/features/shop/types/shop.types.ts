export interface ShopPageProps {
  searchParams: Promise<{ page?: string | string[] }>;
}

export interface ShopScreenProps {
  page: number;
}
