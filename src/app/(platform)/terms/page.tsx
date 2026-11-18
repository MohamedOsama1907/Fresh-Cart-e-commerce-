import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader/PageHeader";
import {
  IconFileText,
  IconShieldCheck,
  IconTruck,
  IconCreditCard,
  IconRefresh,
  IconMail,
} from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Terms of Service - FreshCart",
  description: "Read the FreshCart terms of service, customer agreement, policies, and conditions.",
};

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    icon: IconFileText,
    content: `By accessing or using FreshCart ("the Website", "the Service"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site. All materials contained in this website are protected by applicable copyright and trademark law.`,
  },
  {
    id: "account",
    title: "2. User Accounts & Security",
    icon: IconShieldCheck,
    content: `When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.`,
  },
  {
    id: "orders-payment",
    title: "3. Orders & Payment",
    icon: IconCreditCard,
    content: `All prices are listed in Egyptian Pounds (EGP) and are inclusive of applicable taxes unless stated otherwise. We accept Cash on Delivery (COD) as well as major credit and debit cards. FreshCart reserves the right to refuse or cancel any order for reasons including but not limited to product availability, errors in the description or price of the product, or suspected fraud.`,
  },
  {
    id: "shipping-delivery",
    title: "4. Shipping & Delivery",
    icon: IconTruck,
    content: `We deliver throughout Egypt. Orders over 500 EGP qualify for free standard shipping. Estimated delivery times are provided at checkout and typically range between 1 to 3 business days for major metropolitan areas. FreshCart will not be liable for delivery delays caused by events outside our reasonable control.`,
  },
  {
    id: "returns-refunds",
    title: "5. Returns & Refunds Policy",
    icon: IconRefresh,
    content: `We want you to be completely satisfied with your purchase. You may return most new, unopened, and undamaged items within 14 days of delivery for a full refund or exchange. Fresh grocery and perishable items that arrive damaged or unsatisfactory will be promptly refunded or replaced upon notification to our customer support team within 24 hours of delivery.`,
  },
  {
    id: "contact",
    title: "6. Questions & Contact Information",
    icon: IconMail,
    content: `If you have any questions about these Terms of Service, please reach out to our dedicated 24/7 customer support team via our contact page, email at support@freshcart.com, or phone at 01113203572.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]}
        title="Terms of Service"
        subtitle="Last updated: November 2026. Please review our terms and user guidelines."
        icon={<IconFileText size={40} stroke={2.2} />}
      />

      <main className="min-h-[60vh] bg-slate-50/70 py-8 sm:py-12">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
            {/* Quick Navigation Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  On This Page
                </h2>
                <nav className="mt-3">
                  <ul className="space-y-1 text-sm">
                    {sections.map((section) => (
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

            {/* Terms Content Sections */}
            <div className="space-y-6">
              {sections.map((section) => {
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
                  Have questions about our terms?
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Our customer care team is available 24/7 to assist you.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700">
                    Contact Support
                  </Link>
                  <Link
                    href="/privacypolicy"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
                    Privacy Policy
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
