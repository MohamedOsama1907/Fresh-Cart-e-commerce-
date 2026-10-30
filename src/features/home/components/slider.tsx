"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Button from "@/components/Buttons/Buttons";
import heroImage from "../../../assets/images/home-slider-1.png";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    title: "Fast & Free Delivery",
    description: "Same day delivery available",
    primaryAction: "Order Now",
    primaryHref: "/shop",
    secondaryAction: "Delivery Info",
    secondaryHref: "/contact",
  },
  {
    title: "Fresh Picks Every Day",
    description: "Discover fresh favorites for your table",
    primaryAction: "Shop Fresh",
    primaryHref: "/shop",
    secondaryAction: "Browse Categories",
    secondaryHref: "/categories",
  },
  {
    title: "Great Deals, Fresh Choices",
    description: "Find something you love at a great price",
    primaryAction: "Explore Offers",
    primaryHref: "/shop",
    secondaryAction: "Shop Categories",
    secondaryHref: "/categories",
  },
];

export default function Slider() {
  const router = useRouter();

  return (
    <section aria-label="Featured offers" className="mx-auto py-5 sm:py-6">
      <div className="relative shadow-sm">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop
          pagination={{ clickable: true }}
          navigation={{
            nextEl: ".home-hero-next",
            prevEl: ".home-hero-prev",
          }}
          className="home-hero-swiper h-[280px] w-full sm:h-[340px] lg:h-[420px]">
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.title}>
              {/* Slide inner wrapper — guarantees position:relative for fill Image + flex centering */}
              <div className="relative flex h-full w-full items-center overflow-hidden">
                {/* Background image */}
                <Image
                  src={heroImage}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="100vw"
                className="object-contain object-right"
                />

                {/* Green tint overlay */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-r from-primary-600/95 via-primary-600/70 to-primary-700/35"
                />

                {/* Content — vertically centered via parent flex */}
                <div className="relative z-10 max-w-2xl px-8 text-white sm:px-12 lg:px-20">
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                    {slide.title}
                  </h2>
                  <p className="mt-3 text-sm font-medium text-white/90 sm:text-base">
                    {slide.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button
                      onClick={() => router.push(slide.primaryHref)}
                      className="!px-5 !py-2 text-sm sm:!px-7">
                      {slide.primaryAction}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push(slide.secondaryHref)}
                      className="!px-5 !py-2 text-sm sm:!px-7">
                      {slide.secondaryAction}
                    </Button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Nav buttons — plain elements, not motion Buttons, to avoid stacking issues */}
        <button
          type="button"
          aria-label="Previous slide"
          className="home-hero-prev absolute left-4 top-1/2 z-20 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-primary-600 shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-white sm:left-5 sm:size-12">
          <IconChevronLeft size={22} stroke={2.5} />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          className="home-hero-next absolute right-4 top-1/2 z-20 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-primary-600 shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-white sm:right-5 sm:size-12">
          <IconChevronRight size={22} stroke={2.5} />
        </button>
      </div>
    </section>
  );
}
