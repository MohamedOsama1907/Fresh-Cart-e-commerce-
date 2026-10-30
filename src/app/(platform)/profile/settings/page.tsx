import type { Metadata } from "next";
import SettingsScreen from "@/features/profile/components/SettingsScreen";

export const metadata: Metadata = {
  title: "Account Settings - FreshCart",
  description: "Update your profile information and password on FreshCart",
};

export default function SettingsPage() {
  return <SettingsScreen />;
}
