import type { Metadata } from "next";
import MyOrdersScreen from "@/features/orders/components/MyOrdersScreen";

export const metadata: Metadata = {
  title: "My Orders | FreshCart",
  description: "View and track your FreshCart orders.",
};

export default function MyOrdersPage() {
  return <MyOrdersScreen />;
}
