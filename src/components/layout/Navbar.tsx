"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import logo from "../../assets/images/freshcart-logo.svg";
import {
  IconChevronDown,
  IconGift,
  IconHeadset,
  IconHeart,
  IconLogout,
  IconMail,
  IconMenu2,
  IconPhone,
  IconSearch,
  IconShoppingCart,
  IconTruck,
  IconUser,
  IconUserCircle,
  IconUserPlus,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { appState } from "@/store/store";
import { authActions } from "@/features/auth/slices/auth.slice";
import { deleteToken } from "@/features/auth/server/auth.actions";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import { motion, useReducedMotion } from "motion/react";
import { useCartAnimation } from "@/features/cart/components/CartAnimationProvider";
import { useCart } from "@/features/cart/hooks/useCart";

function WishlistNavLink({ count, mobile = false }: { count?: number; mobile?: boolean }) {
  return (
    <Link
      href="/wishlist"
      aria-label={count === undefined ? "Wishlist" : `Wishlist, ${count} items`}
      className="text-slate-500 transition hover:text-primary-600 focus-visible:rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
    >
      <span className="relative inline-flex">
        <IconHeart size={mobile ? 25 : 23} className={mobile ? "max-[400px]:size-5" : ""} stroke={1.8} />
        {count !== undefined && count > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-2 -top-2 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white"
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </span>
    </Link>
  );
}

const categoryLinks = [
  { href: "/categories/6439d2d167d9aa4ca970649f", label: "Electronics" },
  { href: "/categories/6439d58a0049ad0b52b9003f", label: "Women's Fashion" },
  { href: "/categories/6439d5b90049ad0b52b90048", label: "Men's Fashion" },
  { href: "/categories/6439d30b67d9aa4ca97064b1", label: "Beauty & Health" },
];
export default function Navbar() {
  const { registerCartTarget, arrivalId } = useCartAnimation();
  const reducedMotion = useReducedMotion();
  const [categoriesOpenPath, setCategoriesOpenPath] = useState<string | null>(null);
  const categoriesMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isCategoriesOpen = categoriesOpenPath === pathname;
  const { isAuthenticated, user } = useSelector(
    (state: appState) => state.authReducer,
  );
  const wishlistQuery = useWishlist(user?.id ?? user?.email, isAuthenticated);
  const cartQuery = useCart(user?.id ?? user?.email, isAuthenticated);
  const cartCount = isAuthenticated ? cartQuery.data?.numOfCartItems : undefined;
  const queryClient = useQueryClient();
  const { logout } = authActions;
  const dispatch = useDispatch();
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !categoriesMenuRef.current?.contains(event.target)
      ) {
        setCategoriesOpenPath(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCategoriesOpenPath(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="w-full container bg-white text-slate-700">
        <div className="hidden border-b border-slate-200/80 text-sm lg:block">
          <div className="mx-auto flex h-[52px] items-center justify-between ">
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
              <li
                aria-hidden="true"
                className="h-5 border-l border-slate-200"
              />
              {isAuthenticated ? (
                <>
                  <li>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 hover:text-primary-600">
                      <IconUser size={16} /> Account
                    </Link>
                  </li>
                  <li
                    onClick={async () => {
                      dispatch(logout());
                      queryClient.removeQueries({ queryKey: ["getWishlist"] });
                      await deleteToken();
                    }}>
                    <Link
                      href="/login"
                      className="flex items-center gap-2 hover:text-primary-600">
                      <IconLogout size={16} /> Log out
                    </Link>
                  </li>
                </>
              ) : (
                <>
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
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white text-slate-700">
        <div className="container mx-auto flex min-h-[72px] items-center gap-2 max-[400px]:gap-1 max-[400px]:px-4 sm:min-h-[80px] sm:gap-4 lg:min-h-[88px] lg:gap-7">
          <Link href="/" aria-label="FreshCart home" className="shrink-0">
            <Image src={logo} alt="FreshCart" priority className="h-7 w-auto max-[400px]:h-6 sm:h-8 lg:h-9" />
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
                onClick={() =>
                  setCategoriesOpenPath((openPath) =>
                    openPath === pathname ? null : pathname,
                  )
                }
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
                    onClick={() => setCategoriesOpenPath(null)}
                    className="block py-2.5 text-base font-medium text-primary-600 transition hover:text-primary-700">
                    All Categories
                  </Link>
                </li>
                {categoryLinks.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      onClick={() => setCategoriesOpenPath(null)}
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
            <WishlistNavLink count={isAuthenticated ? wishlistQuery.data?.count : undefined} />
            <Link
              href="/cart"
              aria-label={cartCount === undefined ? "Cart" : `Cart, ${cartCount} items`}
              className="text-slate-500 transition hover:text-primary-600">
              <motion.span
                ref={(element) => registerCartTarget("desktop", element)}
                className="relative inline-flex"
                key={arrivalId}
                animate={arrivalId > 0 && !reducedMotion ? { scale: [1, 1.2, 0.92, 1] } : undefined}
                transition={{ duration: 0.35 }}
              >
                <IconShoppingCart size={23} stroke={1.8} />
                {cartCount !== undefined && cartCount > 0 && (
                  <span aria-hidden="true" className="absolute -right-2 -top-2 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
                {arrivalId > 0 && !reducedMotion && (
                  <motion.span
                    key={`ripple-${arrivalId}`}
                    aria-hidden="true"
                    initial={{ opacity: 0.55, scale: 0.45 }}
                    animate={{ opacity: 0, scale: 1.9 }}
                    transition={{ duration: 0.5 }}
                    className="pointer-events-none absolute inset-0 rounded-full border-2 border-primary-500"
                  />
                )}
              </motion.span>
            </Link>
            {isAuthenticated ? (
              <Link
                href="/profile"
                aria-label="Your account"
                className="text-slate-500 transition hover:text-primary-600 focus-visible:rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600">
                <IconUserCircle size={27} stroke={1.8} />
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex h-12 items-center gap-2 rounded-full bg-primary-600 px-[20px] py-[10px] text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
                <IconUser size={18} /> Sign In
              </Link>
            )}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 max-[400px]:gap-1.5 lg:hidden sm:gap-4">
            <WishlistNavLink count={isAuthenticated ? wishlistQuery.data?.count : undefined} mobile />
            <Link
              href="/cart"
              aria-label={cartCount === undefined ? "Cart" : `Cart, ${cartCount} items`}
              className="text-slate-500 transition hover:text-primary-600">
              <motion.span
                ref={(element) => registerCartTarget("mobile", element)}
                className="relative inline-flex"
                key={arrivalId}
                animate={arrivalId > 0 && !reducedMotion ? { scale: [1, 1.2, 0.92, 1] } : undefined}
                transition={{ duration: 0.35 }}
              >
                <IconShoppingCart size={25} className="max-[400px]:size-5" stroke={1.8} />
                {cartCount !== undefined && cartCount > 0 && (
                  <span aria-hidden="true" className="absolute -right-2 -top-2 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
                {arrivalId > 0 && !reducedMotion && (
                  <motion.span
                    key={`ripple-${arrivalId}`}
                    aria-hidden="true"
                    initial={{ opacity: 0.55, scale: 0.45 }}
                    animate={{ opacity: 0, scale: 1.9 }}
                    transition={{ duration: 0.5 }}
                    className="pointer-events-none absolute inset-0 rounded-full border-2 border-primary-500"
                  />
                )}
              </motion.span>
            </Link>
            {isAuthenticated ? (
              <Link
                href="/profile"
                aria-label="Your account"
                className="text-slate-500 transition hover:text-primary-600 focus-visible:rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600">
                <IconUserCircle size={27} className="max-[400px]:size-5" stroke={1.8} />
              </Link>
            ) : (
              <Link
                href="/login"
                aria-label="Sign In"
                className="flex h-10 items-center gap-1.5 rounded-full bg-primary-600 px-3 text-[13px] font-semibold text-white shadow-sm transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 max-[400px]:px-2">
                <IconUser size={16} />
                <span className="max-[400px]:sr-only">Sign In</span>
              </Link>
            )}
            <button
              type="button"
              aria-label="Open menu"
              className="flex size-12 items-center justify-center rounded-full bg-primary-600 text-white max-[400px]:size-10">
              <IconMenu2 size={23} className="max-[400px]:size-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
