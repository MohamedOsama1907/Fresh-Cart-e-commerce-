"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

type ButtonVariant = "solid" | "outline" | "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  solid:
    "bg-white text-primary-700 shadow-sm hover:bg-primary-50 hover:shadow-md focus-visible:outline-white",
  outline:
    "bg-transparent text-white border-2 border-white/80 hover:bg-white/15 focus-visible:outline-white",
  primary:
    "bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow-md focus-visible:outline-primary-700",
  secondary:
    "bg-slate-100 text-slate-800 hover:bg-slate-200 focus-visible:outline-slate-700",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:outline-primary-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export default function Button({
  children,
  variant = "solid",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 cursor-pointer rounded-xl font-bold tracking-wide transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      whileHover={shouldReduceMotion || disabled || isLoading ? undefined : { scale: 1.03, y: -1 }}
      whileTap={shouldReduceMotion || disabled || isLoading ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 450, damping: 20 }}
      {...rest}>
      {isLoading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </motion.button>
  );
}
