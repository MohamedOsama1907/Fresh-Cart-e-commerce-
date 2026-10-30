"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  IconArrowRight,
  IconBrandApple,
  IconBrandGooglePlay,
  IconDeviceMobile,
  IconLeaf,
  IconMail,
  IconTag,
  IconTruck,
} from "@tabler/icons-react";

const contentVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const reducedContentVariants = { visible: {} };
const reducedItemVariants = { visible: { opacity: 1, y: 0 } };

const benefits = [
  { label: "Fresh Picks Weekly", icon: IconLeaf },
  { label: "Free Delivery Codes", icon: IconTruck },
  { label: "Members-Only Deals", icon: IconTag },
];

export default function DownloadAppBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion() === true;
  const sectionVariants = prefersReducedMotion
    ? reducedContentVariants
    : contentVariants;
  const childVariants = prefersReducedMotion ? reducedItemVariants : itemVariants;

  return (
    <motion.section
      ref={sectionRef}
      aria-label="Newsletter and mobile app"
      className="container mx-auto py-8 sm:py-10"
      variants={sectionVariants}
      initial={prefersReducedMotion ? false : "hidden"}
      animate={prefersReducedMotion || isInView ? "visible" : "hidden"}
    >
      <div className="grid gap-8 rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 shadow-[0_18px_50px_rgba(16,185,129,0.08)] sm:p-8 lg:grid-cols-[1.7fr_1fr] lg:items-center lg:gap-10 lg:p-12">
        <motion.div variants={childVariants} className="min-w-0 lg:border-r lg:border-emerald-100 lg:pr-10">
          <motion.div variants={childVariants} className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-200/70 sm:size-16">
              <IconMail size={28} stroke={2} />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Newsletter</p>
              <p className="text-sm text-slate-500">50,000+ subscribers</p>
            </div>
          </motion.div>

          <motion.div variants={childVariants}>
            <h2 className="mt-7 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Get the Freshest Updates <span className="text-emerald-600">Delivered Free</span>
            </h2>
            <p className="mt-4 text-base text-slate-500 sm:text-lg">
              Weekly recipes, seasonal offers &amp; exclusive member perks.
            </p>
          </motion.div>

          <motion.ul variants={childVariants} className="mt-6 flex flex-wrap gap-3" aria-label="Newsletter benefits">
            {benefits.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-3 rounded-full border border-emerald-100 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm">
                <span className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Icon size={16} stroke={2.2} />
                </span>
                {label}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={childVariants} className="mt-7 flex flex-col gap-3 sm:flex-row">
            <div className="flex min-h-14 min-w-0 flex-1 items-center rounded-2xl border border-slate-200 bg-white px-5 text-slate-400 shadow-sm">
              you@example.com
            </div>
            <div className="flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-7 font-semibold text-white shadow-lg shadow-emerald-200/70">
              Subscribe <IconArrowRight size={20} />
            </div>
          </motion.div>
          <motion.p variants={childVariants} className="mt-3 text-xs text-slate-400">
            ✨ Unsubscribe anytime. No spam, ever.
          </motion.p>
        </motion.div>

        <motion.div variants={childVariants} className="rounded-[1.75rem] bg-slate-900 p-6 text-white shadow-xl sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-400">
            <IconDeviceMobile size={15} /> Mobile App
          </div>
          <h3 className="mt-6 text-xl font-bold sm:text-2xl">Shop Faster on Our App</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
            Get app-exclusive deals &amp; 15% off your first order.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="flex min-h-[62px] items-center gap-4 rounded-xl border border-white/10 bg-white/10 px-4">
              <IconBrandApple size={25} fill="currentColor" />
              <span className="text-xs leading-tight text-slate-300">Download on<strong className="mt-1 block text-base text-white">App Store</strong></span>
            </div>
            <div className="flex min-h-[62px] items-center gap-4 rounded-xl border border-white/10 bg-white/10 px-4">
              <IconBrandGooglePlay size={25} />
              <span className="text-xs leading-tight text-slate-300">Get it on<strong className="mt-1 block text-base text-white">Google Play</strong></span>
            </div>
          </div>

          <p className="mt-6 flex items-center gap-3 text-sm text-slate-300">
            <span className="text-amber-400" aria-label="5 stars">★★★★★</span>
            <span>4.9 · 100K+ downloads</span>
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
