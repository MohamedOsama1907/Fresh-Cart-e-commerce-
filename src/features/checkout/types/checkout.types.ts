export interface CheckoutShippingAddress {
  details: string;
  phone: string;
  city: string;
  postalCode: string;
}

export interface CreateCashOrderInput {
  cartId: string;
  shippingAddress: CheckoutShippingAddress;
}
