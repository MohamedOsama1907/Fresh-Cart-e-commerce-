import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IconUser } from "@tabler/icons-react";
import PageHeader from "@/components/PageHeader/PageHeader";
import AccountSidebar from "@/features/profile/components/AccountSidebar";

export const metadata: Metadata = {
  title: "My Account - FreshCart",
  description: "Manage your addresses and account settings on FreshCart",
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "My Account" }]}
        title="My Account"
        subtitle="Manage your addresses and account settings"
        icon={<IconUser size={38} stroke={2.2} />}
        background="linear-gradient(110deg, #16a34a 0%, #22c55e 100%)"
        iconBackgroundColor="rgba(255, 255, 255, 0.22)"
      />

      <main className="min-h-[55vh] bg-slate-50/60 py-8 sm:py-10">
        <div className="container mx-auto flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <AccountSidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </main>
    </>
  );
}
