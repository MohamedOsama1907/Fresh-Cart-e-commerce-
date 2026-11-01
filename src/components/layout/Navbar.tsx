"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import logo from "../../assets/images/freshcart-logo.svg";
import {
  IconChevronDown,
  IconGift,
  IconHeadset,
  IconHeart,
  IconLogout,
  IconMapPin,
  IconMail,
  IconMenu2,
  IconPhone,
  IconSearch,
  IconShoppingCart,
  IconSettings,
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

function isCurrentRoute(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

function WishlistNavLink({ count, mobile = false, active = false }: { count?: number; mobile?: boolean; active?: boolean }) {
  return (
    <Link
      href="/wishlist"
      aria-current={active ? "page" : undefined}
      aria-label={count === undefined ? "Wishlist" : `Wishlist, ${count} items`}
      className={`transition hover:text-primary-600 focus-visible:rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 ${active ? "text-primary-700" : "text-slate-500"}`}
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

const profileLinks = [
  { href: "/profile", label: "My Profile", icon: IconUser },
  { href: "/myorders", label: "My Orders", icon: IconTruck },
  { href: "/wishlist", label: "My Wishlist", icon: IconHeart },
  { href: "/profile/myaddresses", label: "Addresses", icon: IconMapPin },
  { href: "/profile/settings", label: "Settings", icon: IconSettings },
];

export default function Navbar() {
  const { registerCartTarget, arrivalId } = useCartAnimation();
  const reducedMotion = useReducedMotion();
  const [categoriesOpenPath, setCategoriesOpenPath] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const categoriesMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isActivePath = (href: string) => isCurrentRoute(pathname, href);
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
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node) {
        if (!categoriesMenuRef.current?.contains(event.target)) {
          setCategoriesOpenPath(null);
        }
        if (!profileMenuRef.current?.contains(event.target)) {
          setProfileMenuOpen(false);
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCategoriesOpenPath(null);
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    dispatch(logout());
    queryClient.removeQueries({ queryKey: ["getWishlist"] });
    queryClient.removeQueries({ queryKey: ["getUserAddresses"] });
    queryClient.removeQueries({ queryKey: ["getSpecificAddress"] });
    await deleteToken();
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    router.replace("/login");
    router.refresh();
  };

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
                      aria-current={isActivePath("/profile") ? "page" : undefined}
                      className={`flex items-center gap-2 transition-colors hover:text-primary-600 ${isActivePath("/profile") ? "font-semibold text-primary-700" : ""}`}>
                      <IconUser size={16} /> {user?.name ?? "Account"}
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => void handleLogout()}
                      className="flex items-center gap-2 transition-colors hover:text-red-600">
                      <IconLogout size={16} /> Log out
                    </button>
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
        <div className="container mx-auto flex min-h-[76px] w-full max-w-screen-2xl items-center gap-2 sm:min-h-[80px] sm:gap-4 lg:min-h-[88px] lg:gap-7">
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
            <Link href="/" aria-current={isActivePath("/") ? "page" : undefined} className={`relative py-2 transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-primary-600 ${isActivePath("/") ? "font-semibold text-primary-700 after:content-['']" : "text-slate-700 hover:text-primary-600 after:scale-x-0 after:transition-transform after:content-[''] hover:after:scale-x-100"}`}>
              Home
            </Link>
            <Link href="/shop" aria-current={isActivePath("/shop") ? "page" : undefined} className={`relative py-2 transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-primary-600 ${isActivePath("/shop") ? "font-semibold text-primary-700 after:content-['']" : "text-slate-700 hover:text-primary-600 after:scale-x-0 after:transition-transform after:content-[''] hover:after:scale-x-100"}`}>
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
                aria-current={isActivePath("/categories") ? "page" : undefined}
                aria-controls="categories-dropdown"
                className={`relative flex items-center gap-1.5 py-2 transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-primary-600 ${isActivePath("/categories") ? "font-semibold text-primary-700 after:content-['']" : "text-slate-700 hover:text-primary-600 after:scale-x-0 after:transition-transform after:content-[''] hover:after:scale-x-100"}`}>
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
                    aria-current={pathname === "/categories" ? "page" : undefined}
                    className={`block rounded-lg px-2 py-2.5 text-base transition-colors hover:text-primary-700 ${pathname === "/categories" ? "bg-primary-50 font-semibold text-primary-700" : "font-medium text-primary-600"}`}>
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
            <Link href="/brands" aria-current={isActivePath("/brands") ? "page" : undefined} className={`relative py-2 transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-primary-600 ${isActivePath("/brands") ? "font-semibold text-primary-700 after:content-['']" : "text-slate-700 hover:text-primary-600 after:scale-x-0 after:transition-transform after:content-[''] hover:after:scale-x-100"}`}>
              Brands
            </Link>
          </nav>

          <div className="ml-auto hidden shrink-0 items-center gap-4 lg:flex">
            <Link
              href="/contact"
              aria-current={isActivePath("/contact") ? "page" : undefined}
              className={`flex items-center gap-2 border-r border-slate-200 pr-5 transition-colors hover:text-primary-600 ${isActivePath("/contact") ? "text-primary-700" : ""}`}>
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
            <WishlistNavLink count={isAuthenticated ? wishlistQuery.data?.count : undefined} active={isActivePath("/wishlist")} />
            <Link
              href="/cart"
              aria-current={isActivePath("/cart") ? "page" : undefined}
              aria-label={cartCount === undefined ? "Cart" : `Cart, ${cartCount} items`}
              className={`transition hover:text-primary-600 ${isActivePath("/cart") ? "text-primary-700" : "text-slate-500"}`}>
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
              <div ref={profileMenuRef} className="relative">
                <button
                  type="button"
                  aria-label={profileMenuOpen ? "Close profile menu" : "Open profile menu"}
                  aria-expanded={profileMenuOpen}
                  aria-controls="profile-dropdown"
                  onClick={() => setProfileMenuOpen((open) => !open)}
                  className="text-slate-500 transition hover:text-primary-600 focus-visible:rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                >
                  <IconUserCircle size={27} stroke={1.8} />
                </button>
                {profileMenuOpen && (
                  <div
                    id="profile-dropdown"
                    className="absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl"
                  >
                    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                        <IconUserCircle size={27} stroke={1.8} />
                      </span>
                      <span className="truncate font-semibold text-slate-800">
                        {user?.name ?? user?.email ?? "My Account"}
                      </span>
                    </div>
                    <nav aria-label="Profile menu" className="py-2">
                      <ul>
                        {profileLinks.map(({ href, label, icon: Icon }) => (
                          <li key={href}>
                            <Link
                              href={href}
                              aria-current={isActivePath(href) ? "page" : undefined}
                              onClick={() => setProfileMenuOpen(false)}
                              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors hover:bg-slate-50 hover:text-primary-700 ${isActivePath(href) ? "font-semibold text-primary-700" : "text-slate-600"}`}
                            >
                              <Icon size={19} stroke={1.9} aria-hidden="true" />
                              {label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                    <div className="border-t border-slate-100 p-2">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          void handleLogout();
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                      >
                        <IconLogout size={19} stroke={1.9} aria-hidden="true" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex h-12 items-center gap-2 rounded-full bg-primary-600 px-[20px] py-[10px] text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
                <IconUser size={18} /> Sign In
              </Link>
            )}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-5 lg:hidden sm:gap-6">
            <WishlistNavLink count={isAuthenticated ? wishlistQuery.data?.count : undefined} mobile active={isActivePath("/wishlist")} />
            <Link
              href="/cart"
              aria-current={isActivePath("/cart") ? "page" : undefined}
              aria-label={cartCount === undefined ? "Cart" : `Cart, ${cartCount} items`}
              className={`transition hover:text-primary-600 ${isActivePath("/cart") ? "text-primary-700" : "text-slate-500"}`}>
              <motion.span
                ref={(element) => registerCartTarget("mobile", element)}
                className="relative inline-flex"
                key={arrivalId}
                animate={arrivalId > 0 && !reducedMotion ? { scale: [1, 1.2, 0.92, 1] } : undefined}
                transition={{ duration: 0.35 }}
              >
                <IconShoppingCart size={25} stroke={1.8} />
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
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex size-[50px] items-center justify-center rounded-full bg-primary-600 text-white transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
              <IconMenu2 size={24} />
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="border-t border-slate-100 bg-white px-6 py-3 shadow-lg lg:hidden">
            <ul className="mx-auto flex max-w-7xl flex-col">
              {[
                ["Home", "/"],
                ["Shop", "/shop"],
                ["Categories", "/categories"],
                ["Brands", "/brands"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActivePath(href) ? "page" : undefined}
                    className={`block border-b border-slate-100 py-3 transition-colors hover:text-primary-700 ${isActivePath(href) ? "font-semibold text-primary-700" : "text-slate-700"}`}>
                    {label}
                  </Link>
                </li>
              ))}
              {isAuthenticated ? (
                <>
                  <li>
                    <Link href="/profile" className="block border-b border-slate-100 py-3 text-slate-700 hover:text-primary-700">
                      Account
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => void handleLogout()}
                      className="group flex w-full items-center gap-3 rounded-xl p-2 text-left text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                      Log out
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/login" className="block py-3 text-slate-700 hover:text-primary-700">
                    Sign In / Sign Up
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </>
  );
}
