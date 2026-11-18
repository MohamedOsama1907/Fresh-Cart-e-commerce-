"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
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
  IconX,
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
      className={`relative inline-flex items-center justify-center transition-colors hover:text-primary-600 focus-visible:rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${active ? "text-primary-700" : "text-slate-600"}`}
    >
      <IconHeart size={mobile ? 22 : 23} stroke={1.8} />
      {count !== undefined && count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-2 -top-2 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
    const timer = setTimeout(() => {
      setMobileMenuOpen(false);
      setMobileSearchOpen(false);
      setProfileMenuOpen(false);
      setCategoriesOpenPath(null);
    }, 0);
    return () => clearTimeout(timer);
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
        setMobileMenuOpen(false);
        setMobileSearchOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/search?keyword=${encodeURIComponent(searchQuery.trim())}`);
  };

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
      {/* Top Banner / Announcement Bar */}
      <div className="w-full border-b border-slate-100 bg-slate-50/90 text-slate-600 text-xs">
        <div className="container mx-auto hidden h-10 items-center justify-between lg:flex">
          <ul className="flex items-center gap-6">
            <li className="flex items-center gap-2 font-medium">
              <IconTruck size={15} className="text-primary-600" />
              <span>Free Shipping on Orders 500 EGP</span>
            </li>
            <li className="flex items-center gap-2 font-medium">
              <IconGift size={15} className="text-primary-600" />
              <span>New Arrivals Daily</span>
            </li>
          </ul>
          <ul className="flex items-center gap-5 text-slate-500">
            <li className="flex items-center gap-1.5 transition-colors hover:text-slate-900">
              <IconPhone size={14} />
              <a href="tel:+01113203572">01113203572</a>
            </li>
            <li className="flex items-center gap-1.5 transition-colors hover:text-slate-900">
              <IconMail size={14} />
              <a href="mailto:support@freshcart.com">support@freshcart.com</a>
            </li>
            <li aria-hidden="true" className="h-3.5 border-l border-slate-200" />
            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    href="/profile"
                    aria-current={isActivePath("/profile") ? "page" : undefined}
                    className={`flex items-center gap-1.5 transition-colors hover:text-primary-600 ${isActivePath("/profile") ? "font-semibold text-primary-700" : ""}`}>
                    <IconUser size={14} /> {user?.name ?? "Account"}
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => void handleLogout()}
                    className="flex items-center gap-1.5 transition-colors hover:text-red-600">
                    <IconLogout size={14} /> Log out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 hover:text-primary-600">
                    <IconUser size={14} /> Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="flex items-center gap-1.5 font-semibold text-primary-600 hover:text-primary-700">
                    <IconUserPlus size={14} /> Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md text-slate-700 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="container mx-auto flex min-h-[70px] w-full max-w-screen-2xl items-center gap-3 sm:min-h-[76px] sm:gap-4 lg:min-h-[82px] lg:gap-8">
          {/* Logo */}
          <Link href="/" aria-label="FreshCart home" className="shrink-0 transition-transform active:scale-95">
            <Image src={logo} alt="FreshCart" priority className="h-7 w-auto sm:h-8 lg:h-9" />
          </Link>

          {/* Desktop Search */}
          <form
            role="search"
            onSubmit={handleSearchSubmit}
            className="relative hidden min-w-48 flex-1 lg:block max-w-xl">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-full border border-slate-200 bg-slate-50/70 py-2.5 pl-5 pr-12 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100"
              placeholder="Search for products, brands and categories..."
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary-600 text-white transition hover:bg-primary-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
              <IconSearch size={16} stroke={2.5} />
            </button>
          </form>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-5 whitespace-nowrap text-sm font-semibold lg:flex">
            <Link
              href="/"
              aria-current={isActivePath("/") ? "page" : undefined}
              className={`relative py-2 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary-600 ${isActivePath("/") ? "text-primary-700 after:content-['']" : "text-slate-700 hover:text-primary-600 after:scale-x-0 after:transition-transform hover:after:scale-x-100 after:content-['']"}`}>
              Home
            </Link>
            <Link
              href="/shop"
              aria-current={isActivePath("/shop") ? "page" : undefined}
              className={`relative py-2 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary-600 ${isActivePath("/shop") ? "text-primary-700 after:content-['']" : "text-slate-700 hover:text-primary-600 after:scale-x-0 after:transition-transform hover:after:scale-x-100 after:content-['']"}`}>
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
                className={`relative flex items-center gap-1 py-2 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary-600 ${isActivePath("/categories") ? "text-primary-700 after:content-['']" : "text-slate-700 hover:text-primary-600 after:scale-x-0 after:transition-transform hover:after:scale-x-100 after:content-['']"}`}>
                Categories
                <IconChevronDown
                  className={`transition-transform duration-200 ${
                    isCategoriesOpen ? "rotate-180" : ""
                  }`}
                  size={15}
                />
              </button>
              <ul
                id="categories-dropdown"
                aria-hidden={!isCategoriesOpen}
                className={`absolute left-0 top-full z-50 mt-1 w-60 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-black/5 transition-all duration-200 ${
                  isCategoriesOpen
                    ? "visible translate-y-0 opacity-100"
                    : "pointer-events-none invisible translate-y-2 opacity-0"
                }`}>
                <li>
                  <Link
                    href="/categories"
                    onClick={() => setCategoriesOpenPath(null)}
                    aria-current={pathname === "/categories" ? "page" : undefined}
                    className={`block rounded-xl px-3 py-2 text-sm transition-colors ${pathname === "/categories" ? "bg-primary-50 font-bold text-primary-700" : "font-semibold text-primary-600 hover:bg-slate-50"}`}>
                    All Categories
                  </Link>
                </li>
                <li className="my-1 border-t border-slate-100" />
                {categoryLinks.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      onClick={() => setCategoriesOpenPath(null)}
                      className="block rounded-lg px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-primary-600">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/brands"
              aria-current={isActivePath("/brands") ? "page" : undefined}
              className={`relative py-2 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary-600 ${isActivePath("/brands") ? "text-primary-700 after:content-['']" : "text-slate-700 hover:text-primary-600 after:scale-x-0 after:transition-transform hover:after:scale-x-100 after:content-['']"}`}>
              Brands
            </Link>
          </nav>

          {/* Desktop Right Actions */}
          <div className="ml-auto hidden shrink-0 items-center gap-5 lg:flex">
            <Link
              href="/contact"
              aria-current={isActivePath("/contact") ? "page" : undefined}
              className={`flex items-center gap-2.5 border-r border-slate-200 pr-5 transition-colors hover:text-primary-600 ${isActivePath("/contact") ? "text-primary-700" : ""}`}>
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <IconHeadset size={20} />
              </span>
              <span className="text-xs leading-tight text-slate-500">
                Support
                <strong className="block text-xs font-bold text-slate-800">
                  24/7 Help
                </strong>
              </span>
            </Link>

            <WishlistNavLink count={isAuthenticated ? wishlistQuery.data?.count : undefined} active={isActivePath("/wishlist")} />

            <Link
              href="/cart"
              aria-current={isActivePath("/cart") ? "page" : undefined}
              aria-label={cartCount === undefined ? "Cart" : `Cart, ${cartCount} items`}
              className={`relative inline-flex items-center justify-center transition-colors hover:text-primary-600 focus-visible:rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${isActivePath("/cart") ? "text-primary-700" : "text-slate-600"}`}>
              <motion.span
                ref={(element) => registerCartTarget("desktop", element)}
                className="relative inline-flex"
                key={arrivalId}
                animate={arrivalId > 0 && !reducedMotion ? { scale: [1, 1.25, 0.9, 1] } : undefined}
                transition={{ duration: 0.35 }}>
                <IconShoppingCart size={23} stroke={1.8} />
                {cartCount !== undefined && cartCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-2 -top-2 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
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
                  className="flex items-center gap-1.5 rounded-full p-1 text-slate-600 transition hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                  <IconUserCircle size={28} stroke={1.8} />
                </button>
                {profileMenuOpen && (
                  <div
                    id="profile-dropdown"
                    className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 bg-slate-50/50">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                        <IconUserCircle size={24} stroke={1.8} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {user?.name ?? "My Account"}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <nav aria-label="Profile menu" className="p-2">
                      <ul className="space-y-0.5">
                        {profileLinks.map(({ href, label, icon: Icon }) => (
                          <li key={href}>
                            <Link
                              href={href}
                              aria-current={isActivePath(href) ? "page" : undefined}
                              onClick={() => setProfileMenuOpen(false)}
                              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-colors hover:bg-slate-50 hover:text-primary-700 ${isActivePath(href) ? "bg-primary-50 text-primary-700" : "text-slate-600"}`}>
                              <Icon size={18} stroke={1.9} aria-hidden="true" />
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
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600">
                        <IconLogout size={18} stroke={1.9} aria-hidden="true" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex h-10 items-center gap-2 rounded-xl bg-primary-600 px-5 text-xs font-bold text-white shadow-sm transition hover:bg-primary-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
                <IconUser size={16} /> Sign In
              </Link>
            )}
          </div>

          {/* Mobile Right Actions */}
          <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4 lg:hidden">
            {/* Mobile Search Toggle */}
            <button
              type="button"
              aria-label={mobileSearchOpen ? "Close search" : "Open search"}
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              className="flex size-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
              <IconSearch size={21} stroke={1.9} />
            </button>

            {/* Mobile Wishlist */}
            <WishlistNavLink count={isAuthenticated ? wishlistQuery.data?.count : undefined} mobile active={isActivePath("/wishlist")} />

            {/* Mobile Cart */}
            <Link
              href="/cart"
              aria-current={isActivePath("/cart") ? "page" : undefined}
              aria-label={cartCount === undefined ? "Cart" : `Cart, ${cartCount} items`}
              className={`relative inline-flex items-center justify-center p-1 text-slate-600 transition hover:text-primary-600 ${isActivePath("/cart") ? "text-primary-700" : ""}`}>
              <motion.span
                ref={(element) => registerCartTarget("mobile", element)}
                className="relative inline-flex"
                key={arrivalId}
                animate={arrivalId > 0 && !reducedMotion ? { scale: [1, 1.25, 0.9, 1] } : undefined}
                transition={{ duration: 0.35 }}>
                <IconShoppingCart size={22} stroke={1.8} />
                {cartCount !== undefined && cartCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-2 -top-2 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
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

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">
              {mobileMenuOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {mobileSearchOpen && (
          <div className="border-t border-slate-100 bg-slate-50/90 px-4 py-3 lg:hidden animate-in fade-in slide-in-from-top-1">
            <form role="search" onSubmit={handleSearchSubmit} className="relative mx-auto flex max-w-lg items-center">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                placeholder="Search products, categories..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-4 pr-11 text-sm text-slate-800 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg bg-primary-600 text-white transition hover:bg-primary-700">
                <IconSearch size={16} stroke={2.5} />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="border-t border-slate-100 bg-white px-5 py-4 shadow-xl lg:hidden animate-in fade-in duration-150">
            <ul className="mx-auto flex max-w-lg flex-col divide-y divide-slate-100 text-sm font-semibold">
              {[
                ["Home", "/"],
                ["Shop All Products", "/shop"],
                ["Categories", "/categories"],
                ["Brands", "/brands"],
                ["Help & Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActivePath(href) ? "page" : undefined}
                    className={`block py-3 transition-colors hover:text-primary-700 ${isActivePath(href) ? "font-bold text-primary-700" : "text-slate-700"}`}>
                    {label}
                  </Link>
                </li>
              ))}
              {isAuthenticated ? (
                <>
                  <li className="pt-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 py-2.5 text-slate-700 hover:text-primary-700">
                      <IconUser size={18} className="text-primary-600" />
                      <span>My Account ({user?.name ?? "Profile"})</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/myorders"
                      className="flex items-center gap-2.5 py-2.5 text-slate-700 hover:text-primary-700">
                      <IconTruck size={18} className="text-primary-600" />
                      <span>My Orders</span>
                    </Link>
                  </li>
                  <li className="pt-2">
                    <button
                      type="button"
                      onClick={() => void handleLogout()}
                      className="flex w-full items-center gap-2.5 rounded-xl py-2.5 text-left text-rose-600 transition-colors hover:text-rose-700">
                      <IconLogout size={18} />
                      <span>Log out</span>
                    </button>
                  </li>
                </>
              ) : (
                <li className="pt-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      className="flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-center text-xs font-bold text-slate-700 hover:bg-slate-50">
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="flex min-h-10 items-center justify-center rounded-xl bg-primary-600 px-3 text-center text-xs font-bold text-white shadow-xs hover:bg-primary-700">
                      Sign Up
                    </Link>
                  </div>
                </li>
              )}
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
