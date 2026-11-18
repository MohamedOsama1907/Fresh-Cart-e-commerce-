import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader/PageHeader";
import {
  IconShieldLock,
  IconDatabase,
  IconEye,
  IconCookie,
  IconUserCheck,
  IconMail,
} from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Privacy Policy - FreshCart",
  description: "Learn how FreshCart collects, protects, and uses your personal information.",
};

const policySections = [
  {
    id: "information-collection",
    title: "1. Information We Collect",
    icon: IconDatabase,
    content: `We collect information you provide directly to us when creating an account, making a purchase, subscribing to our newsletter, or contacting customer support. This may include your name, email address, phone number, shipping and billing addresses, and payment method details. We also collect automated data such as device identifiers, browser type, and browsing patterns to improve your experience.`,
  },
  {
    id: "use-of-information",
    title: "2. How We Use Your Information",
    icon: IconEye,
    content: `Your information is used to process and fulfill your orders, provide order confirmations and delivery updates, manage your account, detect and prevent fraud, and communicate promotions, discounts, and customer satisfaction surveys (which you can opt out of at any time).`,
  },
  {
    id: "data-security",
    title: "3. Data Protection & Security",
    icon: IconShieldLock,
    content: `We implement rigorous administrative, technical, and physical security measures to safeguard your personal data. All sensitive communications and payment transactions are encrypted using industry-standard SSL/TLS protocols. We never store raw payment card data on our servers.`,
  },
  {
    id: "cookies",
    title: "4. Cookies & Tracking Technologies",
    icon: IconCookie,
    content: `FreshCart uses cookies and similar technologies to remember your preferences, keep you logged into your account, and analyze site performance. You can manage or disable cookies through your browser settings, though certain website functions may be limited as a result.`,
  },
  {
    id: "user-rights",
    title: "5. Your Privacy Rights",
    icon: IconUserCheck,
    content: `You have the right to access, update, or delete your personal information at any time through your Profile Settings. You can also request a copy of your stored data or ask us to restrict the processing of your information by contacting our privacy officer.`,
  },
  {
    id: "contact",
    title: "6. Privacy Inquiries",
    icon: IconMail,
    content: `For any inquiries, requests, or concerns regarding your privacy or this policy, please reach out to our data privacy team at privacy@freshcart.com or via phone at 01113203572.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
        title="Privacy Policy"
        subtitle="Last updated: November 2026. Your privacy and trust are our top priorities."
        icon={<IconShieldLock size={40} stroke={2.2} />}
      />

      <main className="min-h-[60vh] bg-slate-50/70 py-8 sm:py-12">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
            {/* Quick Navigation Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Policy Sections
                </h2>
                <nav className="mt-3">
                  <ul className="space-y-1 text-sm">
                    {policySections.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="block rounded-lg px-2.5 py-1.5 text-slate-600 transition-colors hover:bg-primary-50 hover:text-primary-700">
                          {section.title.split(". ")[1]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Privacy Sections */}
            <div className="space-y-6">
              {policySections.map((section) => {
                const Icon = section.icon;
                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-28 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                        <Icon size={20} stroke={2.2} />
                      </span>
                      <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                        {section.title}
                      </h2>
                    </div>
                    <p className="mt-4 leading-7 text-slate-600 sm:text-base">
                      {section.content}
                    </p>
                  </section>
                );
              })}

              {/* Bottom Support Banner */}
              <div className="rounded-2xl border border-primary-200 bg-gradient-to-r from-primary-50 to-emerald-50 p-6 text-center sm:p-8">
                <h3 className="text-lg font-bold text-slate-900">
                  Questions about how we handle your data?
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  We are here to assist with any privacy or data inquiries.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700">
                    Contact Privacy Team
                  </Link>
                  <Link
                    href="/terms"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
