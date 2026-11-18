"use client";

import { useRouter } from "next/navigation";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Button from "@/components/Buttons/Buttons";
import heroImage from "../../../assets/images/images.jpg";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    badge: "Fast & Reliable",
    title: "Fresh Groceries Delivered to Your Doorstep",
    description:
      "Get 20% off your first order with free delivery on orders over 500 EGP",
    primaryAction: "Shop Fresh",
    primaryHref: "/shop",
    secondaryAction: "Explore Categories",
    secondaryHref: "/categories",
  },
  {
    badge: "Organic & Pure",
    title: "Fresh Hand-Picked Produce Daily",
    description:
      "Farm-to-table vegetables and fruits sourced directly from local producers",
    primaryAction: "Browse Offers",
    primaryHref: "/shop",
    secondaryAction: "Top Brands",
    secondaryHref: "/brands",
  },
  {
    badge: "Exclusive Deals",
    title: "Great Everyday Value on All Essentials",
    description:
      "Save big on pantry staples, dairy, beverages, and personal care essentials",
    primaryAction: "Explore Deals",
    primaryHref: "/shop",
    secondaryAction: "Contact Support",
    secondaryHref: "/contact",
  },
];

export default function Slider() {
  const router = useRouter();

  return (
    <section aria-label="Featured promotions" className="w-full py-4 sm:py-6">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop
            pagination={{ clickable: true }}
            navigation={{
              nextEl: ".home-hero-next",
              prevEl: ".home-hero-prev",
            }}
            className="home-hero-swiper h-[320px] w-full sm:h-[380px] lg:h-[440px]">
            {slides.map((slide) => (
              <SwiperSlide key={slide.title}>
                <div
                  className="relative flex h-full items-center text-white"
                  style={{
                    backgroundImage: `linear-gradient(105deg, rgba(20, 83, 45, 0.92) 0%, rgba(22, 163, 74, 0.8) 55%, rgba(34, 197, 94, 0.55) 100%), url('${heroImage.src}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}>
                  <div className="w-full px-6 sm:px-12 lg:px-16">
                    <div className="max-w-xl">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-100 mb-3">
                        {slide.badge}
                      </span>
                      <h2 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                        {slide.title}
                      </h2>
                      <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-emerald-50 sm:text-base lg:text-lg">
                        {slide.description}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button
                          variant="solid"
                          onClick={() => router.push(slide.primaryHref)}
                          className="!px-6 !py-2.5 text-sm">
                          {slide.primaryAction}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => router.push(slide.secondaryHref)}
                          className="!px-6 !py-2.5 text-sm">
                          {slide.secondaryAction}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows */}
          <button
            type="button"
            aria-label="Previous slide"
            className="home-hero-prev absolute left-3 top-1/2 z-20 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-primary-700 shadow-md backdrop-blur-xs transition hover:scale-105 hover:bg-white active:scale-95 sm:left-5 sm:size-11">
            <IconChevronLeft size={20} stroke={2.5} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            className="home-hero-next absolute right-3 top-1/2 z-20 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-primary-700 shadow-md backdrop-blur-xs transition hover:scale-105 hover:bg-white active:scale-95 sm:right-5 sm:size-11">
            <IconChevronRight size={20} stroke={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
