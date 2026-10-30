import type { Metadata } from "next";
import MyAddressesScreen from "@/features/profile/components/MyAddressesScreen";

export const metadata: Metadata = {
  title: "My Addresses - FreshCart",
  description: "Manage your saved delivery addresses on FreshCart",
};

export default function MyAddressesPage() {
  return <MyAddressesScreen />;
}
