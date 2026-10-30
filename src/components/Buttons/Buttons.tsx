"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

type ButtonVariant = "solid" | "outline";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  solid:
    "bg-white text-primary-600 shadow-lg shadow-black/10 hover:bg-primary-50",
  outline:
    "bg-transparent text-white border-2 border-white/80 hover:bg-white/10",
};

export default function Button({
  children,
  variant = "solid",
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      className={`cursor-pointer rounded-lg px-7 py-2.5 text-sm font-bold tracking-wide transition-colors duration-200 ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...rest}>
      {children}
    </motion.button>
  );
}
