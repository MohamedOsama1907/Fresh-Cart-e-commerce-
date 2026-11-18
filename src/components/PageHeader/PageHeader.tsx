import Image from "next/image";
import Link from "next/link";
import { IconChevronRight, IconPackage } from "@tabler/icons-react";
import type { PageHeaderProps } from "../../types/PageHeader.types";

export type { PageHeaderBreadcrumb, PageHeaderProps } from "../../types/PageHeader.types";

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  icon,
  image,
  imageAlt = "",
  backgroundColor,
  background,
  textColor = "#ffffff",
  breadcrumbColor = "rgba(255, 255, 255, 0.85)",
  iconBackgroundColor = "rgba(255, 255, 255, 0.2)",
  iconColor = "#ffffff",
}: PageHeaderProps) {
  const headerBackground =
    background ??
    backgroundColor ??
    "linear-gradient(110deg, #16a34a 0%, #22c55e 100%)";

  return (
    <header
      className="w-full py-7 sm:py-9 lg:py-11 shadow-xs"
      style={{ background: headerBackground, color: textColor }}>
      <div className="container mx-auto flex min-h-36 w-full max-w-screen-2xl flex-col justify-center">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5 sm:mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              {breadcrumbs.map((breadcrumb, index) => {
                const isCurrent = index === breadcrumbs.length - 1;
                return (
                  <li
                    key={`${breadcrumb.label}-${index}`}
                    className="flex items-center gap-1.5 sm:gap-2">
                    {index > 0 && (
                      <IconChevronRight size={14} aria-hidden="true" className="opacity-70" />
                    )}
                    {breadcrumb.href && !isCurrent ? (
                      <Link
                        href={breadcrumb.href}
                        className="rounded transition-opacity hover:opacity-100 hover:underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                        style={{ color: breadcrumbColor }}>
                        {breadcrumb.label}
                      </Link>
                    ) : (
                      <span
                        aria-current={isCurrent ? "page" : undefined}
                        className={isCurrent ? "font-bold text-white" : undefined}
                        style={{
                          color: isCurrent ? textColor : breadcrumbColor,
                        }}>
                        {breadcrumb.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        <div className="flex items-center gap-4 sm:gap-6">
          <div
            aria-hidden={image ? undefined : true}
            className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-sm sm:size-18 lg:size-20"
            style={{ backgroundColor: iconBackgroundColor, color: iconColor }}>
            {image ? (
              <Image
                src={image}
                alt={imageAlt}
                width={72}
                height={72}
                unoptimized
                className="size-10 object-contain sm:size-12 lg:size-14"
              />
            ) : (
              (icon ?? <IconPackage size={32} stroke={2.3} className="sm:size-10" />)
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1.5 text-sm leading-relaxed opacity-90 sm:text-base lg:text-lg">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
