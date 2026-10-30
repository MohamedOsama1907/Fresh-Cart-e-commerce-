import type { Metadata } from "next";
import WishlistScreen from "@/features/wishlist/components/whishlist.screen";

export const metadata: Metadata = {
  title: "My Wishlist | FreshCart",
  description: "View and manage the products you have saved on FreshCart.",
};

export default function WishlistPage() {
  return <WishlistScreen />;
}
