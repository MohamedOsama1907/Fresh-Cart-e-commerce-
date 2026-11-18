"use client";

import { useRef, useState, type FormEvent } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import {
  IconArrowRight,
  IconBrandApple,
  IconBrandGooglePlay,
  IconCheck,
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
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion() === true;
  const sectionVariants = prefersReducedMotion
    ? reducedContentVariants
    : contentVariants;
  const childVariants = prefersReducedMotion ? reducedItemVariants : itemVariants;

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsSubscribed(true);
    toast.success("Thank you for subscribing! Check your inbox soon.");
    setEmail("");
  };

  return (
    <motion.section
      ref={sectionRef}
      aria-label="Newsletter and mobile app"
      className="container mx-auto py-8 sm:py-12"
      variants={sectionVariants}
      initial={prefersReducedMotion ? false : "hidden"}
      animate={prefersReducedMotion || isInView ? "visible" : "hidden"}
    >
      <div className="grid gap-8 rounded-3xl border border-emerald-100/90 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 p-6 shadow-sm sm:p-8 lg:grid-cols-[1.65fr_1fr] lg:items-center lg:gap-10 lg:p-12">
        {/* Left Side: Newsletter */}
        <motion.div variants={childVariants} className="min-w-0 lg:border-r lg:border-emerald-100 lg:pr-10">
          <motion.div variants={childVariants} className="flex items-center gap-3.5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-sm sm:size-14">
              <IconMail size={26} stroke={2} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary-700">Newsletter</p>
              <p className="text-xs text-slate-500">Join 50,000+ happy food lovers</p>
            </div>
          </motion.div>

          <motion.div variants={childVariants}>
            <h2 className="mt-5 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Get the Freshest Updates <span className="text-primary-600">Delivered Free</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Seasonal recipes, flash sales &amp; exclusive member coupons straight to your inbox.
            </p>
          </motion.div>

          <motion.ul variants={childVariants} className="mt-5 flex flex-wrap gap-2.5" aria-label="Newsletter benefits">
            {benefits.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-xs">
                <span className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Icon size={14} stroke={2.2} />
                </span>
                {label}
              </li>
            ))}
          </motion.ul>

          <motion.form variants={childVariants} onSubmit={handleSubscribe} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-primary-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
              {isSubscribed ? (
                <>
                  <IconCheck size={18} stroke={2.5} /> Subscribed!
                </>
              ) : (
                <>
                  Subscribe <IconArrowRight size={18} stroke={2.2} />
                </>
              )}
            </button>
          </motion.form>
          <motion.p variants={childVariants} className="mt-2.5 text-xs text-slate-400">
            ✨ Unsubscribe anytime with a single click. Zero spam guaranteed.
          </motion.p>
        </motion.div>

        {/* Right Side: Mobile App */}
        <motion.div variants={childVariants} className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <IconDeviceMobile size={15} /> Mobile App
          </div>
          <h3 className="mt-4 text-xl font-extrabold sm:text-2xl">Shop Faster on Our App</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
            Enjoy exclusive flash deals &amp; get 15% off your first in-app order.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <a
              href="#"
              className="flex min-h-[58px] items-center gap-3.5 rounded-xl border border-white/10 bg-white/10 px-4 transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white">
              <IconBrandApple size={24} fill="currentColor" />
              <span className="text-xs leading-tight text-slate-300">
                Download on the<strong className="mt-0.5 block text-sm font-bold text-white">App Store</strong>
              </span>
            </a>
            <a
              href="#"
              className="flex min-h-[58px] items-center gap-3.5 rounded-xl border border-white/10 bg-white/10 px-4 transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white">
              <IconBrandGooglePlay size={24} />
              <span className="text-xs leading-tight text-slate-300">
                Get it on<strong className="mt-0.5 block text-sm font-bold text-white">Google Play</strong>
              </span>
            </a>
          </div>

          <p className="mt-5 flex items-center gap-2 text-xs text-slate-300">
            <span className="text-amber-400 font-bold" aria-label="5 stars">★★★★★</span>
            <span>4.9 rating · 100K+ happy shoppers</span>
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
