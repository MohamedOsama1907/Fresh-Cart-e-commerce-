import Link from "next/link";
import PageHeader from "@/components/PageHeader/PageHeader";
import {
  IconClockHour4,
  IconHeadset,
  IconHelpCircleFilled,
  IconMailFilled,
  IconMapPinFilled,
  IconPhoneFilled,
  IconSend,
} from "@tabler/icons-react";
import SupportForm from "./supportForm";
import SocialMedia from "./socailMedia";

const contactDetails = [
  {
    title: "Phone",
    detail: "Mon-Fri from 8am to 6pm",
    value: "+1 (800) 123-4567",
    href: "tel:+18001234567",
    Icon: IconPhoneFilled,
  },
  {
    title: "Email",
    detail: "We'll respond within 24 hours",
    value: "support@freshcart.com",
    href: "mailto:support@freshcart.com",
    Icon: IconMailFilled,
  },
];

function ContactCard({
  title,
  detail,
  Icon,
  children,
}: {
  title: string;
  detail?: string;
  Icon: typeof IconPhoneFilled;
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-w-0 gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
        <Icon size={18} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {detail && <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>}
        <div className="mt-1 text-sm leading-5 text-primary-600">{children}</div>
      </div>
    </section>
  );
}

export default function SupportScreen() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
        title="Contact Us"
        subtitle="We'd love to hear from you. Get in touch with our team."
        icon={<IconHeadset size={30} stroke={2.5} />}
        background="linear-gradient(100deg, #16a34a 0%, #22c55e 100%)"
      />

      <main className="min-h-[60vh] bg-slate-50/70 py-8 sm:py-10 lg:py-12">
        <div className="container mx-auto grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.75fr)] lg:gap-6">
          <aside aria-label="Contact information" className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {contactDetails.map(({ title, detail, value, href, Icon }) => (
              <ContactCard key={title} title={title} detail={detail} Icon={Icon}>
                <a href={href} className="break-words hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                  {value}
                </a>
              </ContactCard>
            ))}

            <ContactCard title="Office" Icon={IconMapPinFilled}>
              <address className="not-italic text-xs leading-[1.45] text-slate-500">
                123 Commerce Street<br />
                New York, NY 10001<br />
                United States
              </address>
            </ContactCard>

            <ContactCard title="Business Hours" Icon={IconClockHour4}>
              <p className="text-xs leading-[1.45] text-slate-500">
                Monday - Friday: 8am - 6pm<br />
                Saturday: 9am - 4pm<br />
                Sunday: Closed
              </p>
            </ContactCard>

            <SocialMedia />
          </aside>

          <div className="grid min-w-0 gap-5 lg:gap-6">
            <SupportForm />

            <aside className="flex min-w-0 gap-3 rounded-2xl border border-primary-100 bg-primary-50 p-5 sm:items-start sm:p-6">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm">
                <IconHelpCircleFilled size={19} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-slate-900">
                  Looking for quick answers?
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Visit our Help Center for answers about orders, shipping, returns, and more.
                </p>
                <Link
                  href="/contact#contact-form"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Visit Help Center <IconSend size={13} aria-hidden="true" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
