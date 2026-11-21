import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { verifyToken } from "@/features/auth/server/auth.actions";

export default async function OrdersLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, user } = await verifyToken();
  if (!isAuthenticated || !user) {
    redirect("/login");
  }

  return <>{children}</>;
}
