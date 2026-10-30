import {
  IconTruckFilled,
  IconShieldHalfFilled,
  IconArrowBackUp,
  IconHeadset,
} from "@tabler/icons-react";
import type { FeatureItem } from "../types/storeFeatures.types";

const features: FeatureItem[] = [
  {
    id: "free-shipping",
    icon: IconTruckFilled,
    title: "Free Shipping",
    description: "On orders over 500 EGP",
    iconColor: "text-[#2b7fff]",
    bgColor: "bg-[#eff6ff]",
  },
  {
    id: "secure-payment",
    icon: IconShieldHalfFilled,
    title: "Secure Payment",
    description: "100% secure transactions",
    iconColor: "text-[#00bc7d]",
    bgColor: "bg-[#ecfdf5]",
  },
  {
    id: "easy-returns",
    icon: IconArrowBackUp,
    title: "Easy Returns",
    description: "14-day return policy",
    iconColor: "text-[#ff6900]",
    bgColor: "bg-[#fff7ed]",
    stroke: 2.2,
  },
  {
    id: "support",
    icon: IconHeadset,
    title: "24/7 Support",
    description: "Dedicated support team",
    iconColor: "text-[#ad46ff]",
    bgColor: "bg-[#faf5ff]",
    stroke: 2.2,
  },
];

export default function StoreFeatures() {
  return (
    <section
      aria-label="Store Benefits"
      className="w-full bg-[#f9fafb] py-6 sm:py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow duration-200 hover:shadow-md">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${feature.bgColor} ${feature.iconColor}`}>
                  <Icon size={24} stroke={feature.stroke} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-slate-900 tracking-tight sm:text-[15px]">
                    {feature.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500 leading-normal">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
