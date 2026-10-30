export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface BrandResponse {
  data: Brand;
}

export interface BrandsMetadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
  prevPage?: number;
}

export interface BrandsApiResponse {
  results: number;
  metadata: BrandsMetadata;
  data: Brand[];
}

export interface BrandsPageProps {
  searchParams: Promise<{ page?: string | string[] }>;
}

export interface BrandsScreenProps {
  page: number;
}
