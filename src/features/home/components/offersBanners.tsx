"use client";

import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";

export default function OffersBanners() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Promotional Offers"
      className="container mx-auto py-8 sm:py-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left Banner: Deal of the Day */}
        <motion.div
          role="article"
          initial={shouldReduceMotion ? false : { opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: "some" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#00a86b] via-[#00925f] to-[#007b50] p-6 text-white shadow-sm sm:min-h-[260px] sm:rounded-3xl sm:p-8">
          {/* Subtle Decorative Background Circles */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-white/5"
          />

          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-xs">
              <span aria-hidden="true">🔥</span> Deal of the Day
            </span>
            <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Fresh Organic Fruits
            </h3>
            <p className="text-xs text-white/90 sm:text-sm">
              Get up to 40% off on selected organic fruits
            </p>
          </div>

          <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                40% OFF
              </span>
              <span className="text-xs font-semibold text-white/90 sm:text-sm">
                Use code: <strong className="font-bold">ORGANIC40</strong>
              </span>
            </div>

            <Link
              href="/categories"
              aria-label="Shop fresh organic fruits"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#008f53] shadow-sm transition-all duration-200 hover:bg-emerald-50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <span>Shop Now</span>
              <IconArrowRight size={16} stroke={2.5} aria-hidden="true" />
            </Link>
          </div>
        </motion.div>

        {/* Right Banner: New Arrivals */}
        <motion.div
          role="article"
          initial={shouldReduceMotion ? false : { opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: "some" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#ff8a3d] via-[#ff5745] to-[#ff2a54] p-6 text-white shadow-sm sm:min-h-[260px] sm:rounded-3xl sm:p-8">
          {/* Subtle Decorative Background Circles */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-white/5"
          />

          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-xs">
              <span aria-hidden="true">✨</span> New Arrivals
            </span>
            <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Exotic Vegetables
            </h3>
            <p className="text-xs text-white/90 sm:text-sm">
              Discover our latest collection of premium vegetables
            </p>
          </div>

          <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                25% OFF
              </span>
              <span className="text-xs font-semibold text-white/90 sm:text-sm">
                Use code: <strong className="font-bold">FRESH25</strong>
              </span>
            </div>

            <Link
              href="/categories"
              aria-label="Explore exotic vegetables"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#ff5745] shadow-sm transition-all duration-200 hover:bg-orange-50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <span>Explore Now</span>
              <IconArrowRight size={16} stroke={2.5} aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
