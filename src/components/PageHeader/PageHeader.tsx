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
  breadcrumbColor = "rgba(255, 255, 255, 0.82)",
  iconBackgroundColor = "rgba(255, 255, 255, 0.2)",
  iconColor = "#ffffff",
}: PageHeaderProps) {
  const headerBackground =
    background ??
    backgroundColor ??
    "linear-gradient(110deg, #16a34a 0%, #22c55e 100%)";

  return (
    <header
      className="w-full py-8 sm:py-10 lg:py-12"
      style={{ background: headerBackground, color: textColor }}>
      <div className="container mx-auto flex min-h-40 w-full max-w-screen-2xl flex-col justify-center">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-2 text-sm">
              {breadcrumbs.map((breadcrumb, index) => {
                const isCurrent = index === breadcrumbs.length - 1;
                return (
                  <li
                    key={`${breadcrumb.label}-${index}`}
                    className="flex items-center gap-2">
                    {index > 0 && (
                      <IconChevronRight size={15} aria-hidden="true" />
                    )}
                    {breadcrumb.href && !isCurrent ? (
                      <Link
                        href={breadcrumb.href}
                        className="transition-opacity hover:opacity-75"
                        style={{ color: breadcrumbColor }}>
                        {breadcrumb.label}
                      </Link>
                    ) : (
                      <span
                        aria-current={isCurrent ? "page" : undefined}
                        className={isCurrent ? "font-semibold" : undefined}
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
            className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-sm sm:size-20"
            style={{ backgroundColor: iconBackgroundColor, color: iconColor }}>
            {image ? (
              <Image
                src={image}
                alt={imageAlt}
                width={72}
                height={72}
                unoptimized
                className="size-12 object-contain sm:size-14"
              />
            ) : (
              (icon ?? <IconPackage size={36} stroke={2.5} />)
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[44px]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-base leading-relaxed opacity-90 sm:text-lg">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
