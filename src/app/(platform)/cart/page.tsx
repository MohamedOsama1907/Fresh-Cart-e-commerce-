import type { Metadata } from "next";
import CartScreen from "@/features/cart/components/CartScreen";

export const metadata: Metadata = {
  title: "Shopping Cart | FreshCart",
  description: "Review the items in your FreshCart shopping cart.",
};

export default function CartPage() {
  return <CartScreen />;
}
