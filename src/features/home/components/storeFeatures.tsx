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
    description: "On all orders over 500 EGP",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "secure-payment",
    icon: IconShieldHalfFilled,
    title: "Secure Payment",
    description: "100% encrypted transactions",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    id: "easy-returns",
    icon: IconArrowBackUp,
    title: "Easy Returns",
    description: "14-day hassle-free return policy",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    stroke: 2.2,
  },
  {
    id: "support",
    icon: IconHeadset,
    title: "24/7 Support",
    description: "Dedicated assistance anytime",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    stroke: 2.2,
  },
];

export default function StoreFeatures() {
  return (
    <section
      aria-label="Store Benefits"
      className="w-full py-5 sm:py-7">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div
                  className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${feature.bgColor} ${feature.iconColor}`}>
                  <Icon size={24} stroke={feature.stroke} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
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
