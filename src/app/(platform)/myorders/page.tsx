import type { Metadata } from "next";
import { redirect } from "next/navigation";
import MyOrdersScreen from "@/features/orders/components/MyOrdersScreen";
import { verifyToken } from "@/features/auth/server/auth.actions";

export const metadata: Metadata = {
  title: "My Orders | FreshCart",
  description: "View and track your FreshCart orders.",
};

export default async function MyOrdersPage() {
  const { isAuthenticated, user } = await verifyToken();
  if (!isAuthenticated || !user) {
    redirect("/login");
  }

  return <MyOrdersScreen />;
}
