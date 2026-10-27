import {
  IconClock,
  IconShieldHalfFilled,
  IconTruck,
} from "@tabler/icons-react";
import loginImage from "@/assets/images/home-slider-1.png";
import Image from "next/image";
export default function LoginHero() {
  return (
    <>
      {/* <!-- Left Side - Image/Branding --> */}
      <div className="min-w-0 py-0 lg:py-8">
        <div className="space-y-4 text-center sm:space-y-6">
          <Image
            loading="lazy"
            className="mx-auto h-40 w-full max-w-md rounded-2xl object-cover shadow-md sm:h-56 lg:h-80 lg:max-w-none"
            src={loginImage}
            alt="fresh vegetables and fruits shopping cart illustration, modern clean style, green theme"
          />
          <div className="mx-auto max-w-2xl space-y-2 sm:space-y-4">
            <h2 className="text-xl font-bold leading-tight text-gray-800 sm:text-2xl lg:text-3xl">
              FreshCart - Your One-Stop Shop for Fresh Products
            </h2>
            <p className="text-sm leading-6 text-gray-600 sm:text-base lg:text-lg">
              Join thousands of happy customers who trust FreshCart for their
              daily grocery needs
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500 sm:gap-x-6 sm:text-sm">
              <div className="flex items-center">
                <IconTruck className="me-1.5 size-4 shrink-0 text-primary-600 sm:me-2 sm:size-5" stroke={2} />
                Free Delivery
              </div>
              <div className="flex items-center">
                <IconShieldHalfFilled className="me-1.5 size-4 shrink-0 text-primary-600 sm:me-2 sm:size-5" />
                Secure Payment
              </div>
              <div className="flex items-center">
                <IconClock stroke={2} className="me-1.5 size-4 shrink-0 text-primary-600 sm:me-2 sm:size-5" />
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
