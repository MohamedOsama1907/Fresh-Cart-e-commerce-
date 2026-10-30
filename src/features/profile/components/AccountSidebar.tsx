"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconMapPin,
  IconSettings,
  IconChevronRight,
} from "@tabler/icons-react";

const navItems = [
  {
    href: "/profile/myaddresses",
    label: "My Addresses",
    icon: IconMapPin,
  },
  {
    href: "/profile/settings",
    label: "Settings",
    icon: IconSettings,
  },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <h2 className="mb-3 px-2 text-sm font-bold tracking-tight text-slate-900">
          My Account
        </h2>
        <nav aria-label="Account navigation">
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/profile/settings" && pathname === "/profile");

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`group flex items-center gap-3 rounded-xl p-2 transition-all duration-150 ${
                      isActive
                        ? "bg-primary-50/80 text-slate-900"
                        : "text-slate-600 hover:bg-slate-50/80 hover:text-slate-900"
                    }`}>
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/70 group-hover:text-slate-700"
                      }`}>
                      <item.icon size={18} stroke={2.2} />
                    </div>
                    <span
                      className={`flex-1 text-sm ${
                        isActive ? "font-semibold text-slate-900" : "font-medium"
                      }`}>
                      {item.label}
                    </span>
                    <IconChevronRight
                      size={16}
                      stroke={2.2}
                      className={
                        isActive
                          ? "text-primary-600"
                          : "text-slate-300 transition-transform group-hover:translate-x-0.5"
                      }
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
