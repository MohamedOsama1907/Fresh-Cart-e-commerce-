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
  "text-base text-slate-400 transition-colors hover:text-white";

export default function Footer() {
  return (
    <>
      <section
        aria-label="Shopping benefits"
        className="border-t border-green-100 bg-green-50">
        <div className="container mx-auto grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 lg:grid-cols-4 lg:py-7">
          {[
            { Icon: IconTruck, title: "Free Shipping", detail: "On orders over 500 EGP" },
            { Icon: IconRefresh, title: "Easy Returns", detail: "14-day return policy" },
            { Icon: IconShieldCheck, title: "Secure Payment", detail: "100% secure checkout" },
            { Icon: IconHeadset, title: "24/7 Support", detail: "Contact us anytime" },
          ].map(({ Icon, title, detail }) => (
            <div key={title} className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-primary-600">
                <Icon size={21} stroke={2.2} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-slate-900">{title}</span>
                <span className="mt-0.5 block text-xs text-slate-600">{detail}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer
        id="footer"
        className="border-t border-slate-800 bg-[#101828] text-white">
        <div className="container mx-auto pt-12">
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 pb-12 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link
              href="/"
              aria-label="FreshCart home"
              className="mb-6 inline-flex rounded-xl bg-white px-5 py-3">
              <Image src={lightLogo} alt="FreshCart" priority />
            </Link>

            <p className="mb-5 max-w-lg text-base leading-7 text-slate-400">
              FreshCart is your one-stop destination for quality products. From
              fashion to electronics, we bring you the best brands at competitive
              prices with a seamless shopping experience.
            </p>

            <div className="mb-6 space-y-3 text-base text-slate-400">
              <a
                href="tel:+01113203572"
                className="flex items-center gap-3 transition-colors hover:text-white">
                <IconPhone size={19} className="shrink-0 text-primary-500" />
                01113203572
              </a>
              <a
                href="mailto:support@freshcart.com"
                className="flex items-center gap-3 transition-colors hover:text-white">
                <IconMail size={19} className="shrink-0 text-primary-500" />
                support@freshcart.com
              </a>
            </div>

            <div className="flex items-center gap-3">
              {[IconBrandFacebook, IconBrandTwitter, IconBrandInstagram, IconBrandPinterest].map(
                (SocialIcon, index) => (
                  <span
                    key={index}
                    className="flex size-11 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white">
                    <SocialIcon size={20} stroke={2} />
                  </span>
                ),
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-5 text-lg font-bold text-white">Shop</h2>
            <ul className="space-y-3.5">
              <li><Link href="/shop" className={footerLinkClass}>All Products</Link></li>
              <li><Link href="/categories" className={footerLinkClass}>Categories</Link></li>
              <li><Link href="/brands" className={footerLinkClass}>Brands</Link></li>
              <li><Link href="/category/6439d2d167d9aa4ca970649f" className={footerLinkClass}>Electronics</Link></li>
              <li><Link href="/category/6439d5b90049ad0b52b90048" className={footerLinkClass}>Men&apos;s Fashion</Link></li>
              <li><Link href="/category/6439d58a0049ad0b52b9003f" className={footerLinkClass}>Women&apos;s Fashion</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-lg font-bold text-white">Account</h2>
            <ul className="space-y-3.5">
              <li><Link href="/profile" className={footerLinkClass}>My Account</Link></li>
              <li><Link href="/myorders" className={footerLinkClass}>Order History</Link></li>
              <li><Link href="/wishlist" className={footerLinkClass}>Wishlist</Link></li>
              <li><Link href="/cart" className={footerLinkClass}>Shopping Cart</Link></li>
              <li><Link href="/login" className={footerLinkClass}>Sign In</Link></li>
              <li><Link href="/signup" className={footerLinkClass}>Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-lg font-bold text-white">Support</h2>
            <ul className="space-y-3.5">
              <li><Link href="/contact" className={footerLinkClass}>Contact Us</Link></li>
              <li><Link href="/contact" className={footerLinkClass}>Help Center</Link></li>
              <li><Link href="/terms" className={footerLinkClass}>Shipping Info</Link></li>
              <li><Link href="/terms" className={footerLinkClass}>Returns &amp; Refunds</Link></li>
              <li><Link href="/myorders" className={footerLinkClass}>Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-lg font-bold text-white">Legal</h2>
            <ul className="space-y-3.5">
              <li><Link href="/privacypolicy" className={footerLinkClass}>Privacy Policy</Link></li>
              <li><Link href="/terms" className={footerLinkClass}>Terms of Service</Link></li>
              <li><Link href="/privacypolicy" className={footerLinkClass}>Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-800 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} FreshCart. All rights reserved.</p>
          <div
            aria-label="Accepted payment methods: Visa, Mastercard, and PayPal"
            className="flex flex-wrap items-center gap-5">
            {["Visa", "Mastercard", "PayPal"].map((method) => (
              <span key={method} className="flex items-center gap-2">
                <IconCreditCard size={19} />
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
      </footer>
    </>
  );
}
