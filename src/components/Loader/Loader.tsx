"use client";

import { motion } from "motion/react";

interface LoaderProps {
  message?: string;
  className?: string;
}

const DOT_COUNT = 8;

export default function Loader({
  message = "Loading...",
  className = "",
}: LoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-16 ${className}`}
      role="status"
      aria-live="polite">
      {/* Spinning dots circle */}
      <div className="relative size-8">
        {Array.from({ length: DOT_COUNT }).map((_, i) => {
          const angle = (i / DOT_COUNT) * 360;
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * 12;
          const y = Math.sin(rad) * 12;

          return (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 size-1.5 rounded-full bg-primary-600"
              style={{ x: x - 3, y: y - 3 }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.85, 1.15, 0.85] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: (i / DOT_COUNT) * 1,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      {/* Message */}
      {message && (
        <p className="text-sm font-medium tracking-wide text-slate-500">
          {message}
        </p>
      )}
    </div>
  );
}
