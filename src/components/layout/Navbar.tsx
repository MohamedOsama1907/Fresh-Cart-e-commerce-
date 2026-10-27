"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import logo from "../../assets/images/freshcart-logo.svg";
import {
  IconChevronDown,
  IconGift,
  IconHeadset,
  IconHeart,
  IconMail,
  IconMenu2,
  IconPhone,
  IconSearch,
  IconShoppingCart,
  IconTruck,
  IconUser,
  IconUserPlus,
} from "@tabler/icons-react";

const categoryLinks = [
  { href: "/category/6439d2d167d9aa4ca970649f", label: "Electronics" },
  { href: "/category/6439d58a0049ad0b52b9003f", label: "Women's Fashion" },
  { href: "/category/6439d5b90049ad0b52b90048", label: "Men's Fashion" },
  { href: "/category/6439d30b67d9aa4ca97064b1", label: "Beauty & Health" },
];
export default function Navbar() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const categoriesMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !categoriesMenuRef.current?.contains(event.target)
      ) {
        setIsCategoriesOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsCategoriesOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setIsCategoriesOpen(false);
  }, [pathname]);

  return (
    <>
    <div className="w-full bg-white text-slate-700">
      <div className="hidden border-b border-slate-200/80 text-sm lg:block">
        <div className="mx-auto flex h-[52px] w-full max-w-[1504px] items-center justify-between px-4">
          <ul className="flex items-center gap-7">
            <li className="flex items-center gap-2">
              <IconTruck size={17} className="text-primary-600" />
              <span>Free Shipping on Orders 500 EGP</span>
            </li>
            <li className="flex items-center gap-2">
              <IconGift size={17} className="text-primary-600" />
              <span>New Arrivals Daily</span>
            </li>
          </ul>
          <ul className="flex items-center gap-5 text-slate-500">
            <li className="flex items-center gap-2">
              <IconPhone size={16} />
              <a href="tel:+01113203572">01113203572</a>
            </li>
            <li className="flex items-center gap-2">
              <IconMail size={16} />
              <a href="mailto:support@freshcart.com">support@freshcart.com</a>
            </li>
            <li aria-hidden="true" className="h-5 border-l border-slate-200" />
            <li>
              <Link
                href="/login"
                className="flex items-center gap-2 hover:text-primary-600">
                <IconUser size={16} /> Sign In
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                className="flex items-center gap-2 hover:text-primary-600">
                <IconUserPlus size={16} /> Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white text-slate-700">
      <div className="mx-auto flex min-h-[88px] w-full max-w-[1504px] items-center gap-7 px-4">
        <Link href="/" aria-label="FreshCart home" className="shrink-0">
          <Image src={logo} alt="FreshCart" priority className="h-9 w-auto" />
        </Link>

        <form
          role="search"
          className="relative hidden min-w-48 flex-1 lg:block">
          <input
            type="search"
            className="h-11 w-full rounded-full border border-slate-200 bg-slate-50/50 py-3 pl-6 pr-14 text-base outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            placeholder="Search for products, brands and more..."
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary-600 text-white transition hover:bg-primary-700">
            <IconSearch size={18} stroke={2.5} />
          </button>
        </form>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-4 whitespace-nowrap text-base font-medium lg:flex">
          <Link href="/" className="transition hover:text-primary-600">
            Home
          </Link>
          <Link href="/shop" className="transition hover:text-primary-600">
            Shop
          </Link>
          <div ref={categoriesMenuRef} className="relative">
            <button
              onClick={() => setIsCategoriesOpen((prev) => !prev)}
              type="button"
              aria-expanded={isCategoriesOpen}
              aria-controls="categories-dropdown"
              className="flex items-center gap-1.5 transition hover:text-primary-600">
              Categories{" "}
              <IconChevronDown
                className={`transition-transform duration-200 ${
                  isCategoriesOpen ? "rotate-180" : ""
                }`}
                size={16}
              />
            </button>
            <ul
              id="categories-dropdown"
              aria-hidden={!isCategoriesOpen}
              className={`absolute left-0 top-full z-50 w-[250px] rounded-xl border border-slate-100 bg-white px-5 py-2 shadow-xl transition-all duration-200 ${
                isCategoriesOpen
                  ? "visible translate-y-0 opacity-100"
                  : "pointer-events-none invisible translate-y-1 opacity-0"
              }`}>
              <li>
                <Link
                  href="/categories"
                  onClick={() => setIsCategoriesOpen(false)}
                  className="block py-2.5 text-base font-medium text-primary-600 transition hover:text-primary-700">
                  All Categories
                </Link>
              </li>
              {categoryLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                  onClick={() => setIsCategoriesOpen(false)}
                    className="block py-2.5 text-sm font-normal text-slate-600 transition hover:text-primary-600">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Link href="/brands" className="transition hover:text-primary-600">
            Brands
          </Link>
        </nav>

        <div className="ml-auto hidden shrink-0 items-center gap-4 lg:flex">
          <Link
            href="/contact"
            className="flex items-center gap-2 border-r border-slate-200 pr-5 transition hover:text-primary-600">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <IconHeadset size={22} />
            </span>
            <span className="text-xs leading-4 text-slate-500">
              Support
              <br />
              <strong className="text-sm font-semibold text-slate-800">
                24/7 Help
              </strong>
            </span>
          </Link>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="text-slate-500 transition hover:text-primary-600">
            <IconHeart size={23} stroke={1.8} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="text-slate-500 transition hover:text-primary-600">
            <IconShoppingCart size={23} stroke={1.8} />
          </Link>
          <Link
            href="/login"
            className="flex h-12 items-center gap-2 rounded-full bg-primary-600 px-[20px] py-[10px] text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700">
            <IconUser size={18} /> Sign In
          </Link>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          className="ml-auto flex size-10 items-center justify-center rounded-md bg-primary-600 text-white lg:hidden">
          <IconMenu2 size={22} />
        </button>
      </div>
    </div>
    </>
  );
}
