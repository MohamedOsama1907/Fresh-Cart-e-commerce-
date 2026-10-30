export interface CartCategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface CartBrand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface CartProductDetails {
  _id: string;
  title: string;
  slug: string;
  quantity: number;
  imageCover: string;
  category: CartCategory;
  brand: CartBrand;
  ratingsAverage: number;
  id: string;
}

export interface CartLineItem {
  _id: string;
  count: number;
  product: CartProductDetails;
  price: number;
}

export interface CartData {
  _id: string;
  cartOwner: string;
  products: CartLineItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalCartPrice: number;
}

export interface CartApiResponse {
  status: "success";
  message: string;
  numOfCartItems: number;
  cartId: string;
  data: CartData;
}
