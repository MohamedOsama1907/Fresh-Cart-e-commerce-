import lightLogo from "../../assets/images/freshcart-logo.svg";
import Link from "next/link";
import Image from "next/image";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandPinterest,
  IconBrandTwitter,
  IconCreditCard,
  IconHeadset,
  IconMail,
  IconPhone,
  IconRefresh,
  IconShieldCheck,
  IconTruck,
} from "@tabler/icons-react";

const footerLinkClass =
  "text-sm text-slate-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 rounded-sm";

export default function Footer() {
  return (
    <>
      {/* Shopping benefits highlight band */}
      <section
        aria-label="Shopping benefits"
        className="border-t border-slate-200/80 bg-white">
        <div className="container mx-auto grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 lg:grid-cols-4 lg:py-8">
          {[
            { Icon: IconTruck, title: "Free Shipping", detail: "On all orders over 500 EGP" },
            { Icon: IconRefresh, title: "Easy Returns", detail: "14-day hassle-free return policy" },
            { Icon: IconShieldCheck, title: "Secure Payment", detail: "100% encrypted & secure checkout" },
            { Icon: IconHeadset, title: "24/7 Dedicated Support", detail: "Friendly assistance anytime" },
          ].map(({ Icon, title, detail }) => (
            <div key={title} className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 shadow-xs">
                <Icon size={22} stroke={2.1} />
              </span>
              <div>
                <span className="block text-sm font-bold text-slate-900">{title}</span>
                <span className="mt-0.5 block text-xs text-slate-500">{detail}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Dark Footer */}
      <footer
        id="footer"
        className="border-t border-slate-800 bg-[#0f172a] text-white">
        <div className="container mx-auto pt-14 pb-8">
          <div className="grid grid-cols-1 gap-x-10 gap-y-10 pb-12 sm:grid-cols-2 lg:grid-cols-6">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <Link
                href="/"
                aria-label="FreshCart home"
                className="mb-5 inline-flex rounded-xl bg-white px-4 py-2.5 shadow-sm transition-transform active:scale-95">
                <Image src={lightLogo} alt="FreshCart" priority className="h-7 w-auto" />
              </Link>

              <p className="mb-5 max-w-sm text-sm leading-6 text-slate-400">
                FreshCart is your trusted destination for fresh food, daily groceries,
                and premium goods with fast doorstep delivery across Egypt.
              </p>

              <div className="mb-6 space-y-2.5 text-sm text-slate-400">
                <a
                  href="tel:+01113203572"
                  className="flex items-center gap-2.5 transition-colors hover:text-white focus-visible:outline-primary-500">
                  <IconPhone size={17} className="shrink-0 text-primary-500" />
                  <span>01113203572</span>
                </a>
                <a
                  href="mailto:support@freshcart.com"
                  className="flex items-center gap-2.5 transition-colors hover:text-white focus-visible:outline-primary-500">
                  <IconMail size={17} className="shrink-0 text-primary-500" />
                  <span>support@freshcart.com</span>
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                {[
                  { Icon: IconBrandFacebook, label: "Facebook" },
                  { Icon: IconBrandTwitter, label: "Twitter" },
                  { Icon: IconBrandInstagram, label: "Instagram" },
                  { Icon: IconBrandPinterest, label: "Pinterest" },
                ].map(({ Icon, label }, index) => (
                  <a
                    key={index}
                    href="#"
                    aria-label={`Follow FreshCart on ${label}`}
                    className="flex size-9 items-center justify-center rounded-xl bg-slate-800/80 text-slate-400 transition-colors hover:bg-primary-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500">
                    <Icon size={18} stroke={1.9} />
                  </a>
                ))}
              </div>
            </div>

            {/* Shop Column */}
            <div>
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
                Shop
              </h2>
              <ul className="space-y-3">
                <li><Link href="/shop" className={footerLinkClass}>All Products</Link></li>
                <li><Link href="/categories" className={footerLinkClass}>Categories</Link></li>
                <li><Link href="/brands" className={footerLinkClass}>Brands</Link></li>
                <li><Link href="/categories/6439d2d167d9aa4ca970649f" className={footerLinkClass}>Electronics</Link></li>
                <li><Link href="/categories/6439d5b90049ad0b52b90048" className={footerLinkClass}>Men&apos;s Fashion</Link></li>
                <li><Link href="/categories/6439d58a0049ad0b52b9003f" className={footerLinkClass}>Women&apos;s Fashion</Link></li>
              </ul>
            </div>

            {/* Account Column */}
            <div>
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
                Account
              </h2>
              <ul className="space-y-3">
                <li><Link href="/profile" className={footerLinkClass}>My Profile</Link></li>
                <li><Link href="/myorders#history" className={footerLinkClass}>Order History</Link></li>
                <li><Link href="/wishlist" className={footerLinkClass}>Wishlist</Link></li>
                <li><Link href="/cart" className={footerLinkClass}>Shopping Cart</Link></li>
                <li><Link href="/profile/myaddresses" className={footerLinkClass}>Saved Addresses</Link></li>
                <li><Link href="/profile/settings" className={footerLinkClass}>Account Settings</Link></li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
                Support
              </h2>
              <ul className="space-y-3">
                <li><Link href="/contact" className={footerLinkClass}>Contact Us</Link></li>
                <li><Link href="/terms#shipping-delivery" className={footerLinkClass}>Shipping Info</Link></li>
                <li><Link href="/terms#returns-refunds" className={footerLinkClass}>Returns &amp; Refunds</Link></li>
                <li><Link href="/myorders" className={footerLinkClass}>Track Orders</Link></li>
                <li><Link href="/contact#faq" className={footerLinkClass}>FAQ &amp; Help</Link></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
                Legal
              </h2>
              <ul className="space-y-3">
                <li><Link href="/privacypolicy" className={footerLinkClass}>Privacy Policy</Link></li>
                <li><Link href="/terms" className={footerLinkClass}>Terms of Service</Link></li>
                <li><Link href="/privacypolicy#cookies" className={footerLinkClass}>Cookie Policy</Link></li>
                <li><Link href="/terms#acceptance" className={footerLinkClass}>Compliance</Link></li>
              </ul>
            </div>
          </div>

          {/* Subfooter */}
          <div className="flex flex-col gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} FreshCart Inc. All rights reserved.</p>
            <div
              aria-label="Accepted payment methods: Cash on Delivery, Visa, Mastercard"
              className="flex flex-wrap items-center gap-4">
              <span className="text-slate-400">Accepted Payments:</span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-800/60 px-2 py-1 text-slate-300">
                <IconCreditCard size={15} /> Visa
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-800/60 px-2 py-1 text-slate-300">
                <IconCreditCard size={15} /> Mastercard
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-800/60 px-2 py-1 text-slate-300">
                <IconTruck size={15} /> Cash on Delivery
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
