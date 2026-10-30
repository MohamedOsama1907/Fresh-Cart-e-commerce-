export interface Product {
  _id: string;
  title: string;
  slug: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  category: {
    _id: string;
    name: string;
  };
}

export interface ProductsMetadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
}

export interface ProductsApiResponse {
  results: number;
  metadata: ProductsMetadata;
  data: Product[];
}
