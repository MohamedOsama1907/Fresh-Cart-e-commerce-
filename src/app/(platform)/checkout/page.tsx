import type { Metadata } from "next";
import CheckoutScreen from "@/features/checkout/components/CheckoutScreen";

export const metadata: Metadata = {
  title: "Checkout | FreshCart",
  description: "Review your order and enter your delivery details.",
};

export default function CheckoutPage() {
  return <CheckoutScreen />;
}
