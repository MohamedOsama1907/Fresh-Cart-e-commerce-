import type { Metadata } from "next";
import SearchScreen from "@/features/search/components/SearchScreen";

export const metadata: Metadata = {
  title: "Search Products | FreshCart",
  description: "Browse products available in the FreshCart store.",
};

export default function SearchPage() {
  return <SearchScreen />;
}
