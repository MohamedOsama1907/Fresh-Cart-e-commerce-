export interface OrderProduct {
  _id: string;
  title: string;
  imageCover: string;
}

export interface OrderItem {
  _id: string;
  count: number;
  product: OrderProduct | string;
  price: number;
}

export interface OrderShippingAddress {
  city: string;
  details: string;
  phone: string;
}

export interface UserOrder {
  _id: string;
  cartItems?: OrderItem[];
  shippingAddress: OrderShippingAddress;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
}

export type UserOrdersApiResponse =
  | UserOrder[]
  | { results?: number; data?: UserOrder[] };
