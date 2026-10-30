import type { ImageProps } from "next/image";
import type { CSSProperties, ReactNode } from "react";

export interface PageHeaderBreadcrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: PageHeaderBreadcrumb[];
  icon?: ReactNode;
  image?: ImageProps["src"];
  imageAlt?: string;
  backgroundColor?: string;
  background?: CSSProperties["background"];
  textColor?: string;
  breadcrumbColor?: string;
  iconBackgroundColor?: string;
  iconColor?: string;
  className?: string;
}
