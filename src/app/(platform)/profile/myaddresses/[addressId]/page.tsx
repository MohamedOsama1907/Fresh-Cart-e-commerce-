import type { Metadata } from "next";
import AddressDetailsScreen from "@/features/profile/components/AddressDetailsScreen";

export const metadata: Metadata = {
  title: "Address Details - FreshCart",
  description: "View a saved delivery address on FreshCart",
};

export default async function AddressDetailsPage({
  params,
}: {
  params: Promise<{ addressId: string }>;
}) {
  const { addressId } = await params;
  return <AddressDetailsScreen addressId={addressId} />;
}
