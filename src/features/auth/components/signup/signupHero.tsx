import {
  IconShieldHalfFilled,
  IconStarFilled,
  IconTruckFilled,
} from "@tabler/icons-react";
import reviewAuthorImg from "../../../../assets/images/review-author.png";
import Image from "next/image";

export default function SignupHero() {
  return (
    <div className="min-w-0 py-5 sm:py-7 lg:py-8">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl max-w-1/2 md:max-w-full">
          Welcome to  <span className=" text-primary-600">FreshCart</span>
        </h1>
        <p className="mb-4 mt-2 text-meduim  leading-7 text-slate-600 sm:text-lg">
          Join thousands of happy customers who enjoy fresh groceries delivered
          right to their doorstep.
        </p>
        <ul className="my-6 space-y-5 sm:my-8 sm:space-y-6 [&>li]:flex [&>li]:items-start [&>li]:gap-3 sm:[&>li]:gap-4">
          <li>
            <div className="icon flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg text-primary-600 sm:size-12">
              <IconStarFilled />
            </div>
            <div className="content min-w-0">
              <h2 className="text-base font-semibold sm:text-lg">
                Premium Quality
              </h2>
              <p className="text-sm leading-6 text-gray-600 sm:text-base">
                Premium quality products sourced from trusted suppliers.
              </p>
            </div>
          </li>

          <li>
            <div className="icon flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg text-primary-600 sm:size-12">
              <IconTruckFilled />
            </div>
            <div className="content min-w-0">
              <h2 className="text-base font-semibold sm:text-lg">
                Fast Delivery
              </h2>
              <p className="text-sm leading-6 text-gray-600 sm:text-base">
                Same-day delivery available in most areas
              </p>
            </div>
          </li>

          <li>
            <div className="icon flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg text-primary-600 sm:size-12">
              <IconShieldHalfFilled />
            </div>
            <div className="content min-w-0">
              <h2 className="text-base font-semibold sm:text-lg">
                Secure Shopping
              </h2>
              <p className="text-sm leading-6 text-gray-600 sm:text-base">
                Your data and payments are completely secure
              </p>
            </div>
          </li>
        </ul>

        <div className="review rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="author mb-3 flex items-center gap-3 sm:mb-4 sm:gap-4">
            <Image
              src={reviewAuthorImg}
              alt=""
              className="size-12 rounded-full"
            />
            <div className="min-w-0">
              <h3 className="text-sm font-semibold sm:text-base">
                Sarah Johnson
              </h3>
              <div className="rating flex *:text-yellow-300">
                <IconStarFilled size={19} />
                <IconStarFilled size={19} />
                <IconStarFilled size={19} />
                <IconStarFilled size={19} />
                <IconStarFilled size={19} />
              </div>
            </div>
          </div>
          <blockquote>
            <p className="text-sm italic leading-6 text-gray-600 sm:text-base">
              "FreshCart has transformed my shopping experience. The quality of
              the products is outstanding, and the delivery is always on time.
              Highly recommend!"
            </p>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
