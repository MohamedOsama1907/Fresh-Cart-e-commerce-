import type { Metadata } from "next";
import SupportScreen from "@/features/support/components/Support.screen";

export const metadata: Metadata = {
  title: "Contact Us - FreshCart",
  description: "Get in touch with the FreshCart support team.",
};

export default function ContactPage() {
  return <SupportScreen />;
}
