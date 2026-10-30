export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface SubcategoriesMetadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
  prevPage?: number;
}

export interface SubcategoriesResponse {
  results: number;
  metadata: SubcategoriesMetadata;
  data: Subcategory[];
}

export interface SubcategoryResponse {
  data: Subcategory;
}
