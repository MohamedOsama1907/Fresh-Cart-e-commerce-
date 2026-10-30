"use client";

import { motion } from "motion/react";
import { IconRefresh, IconAlertTriangle } from "@tabler/icons-react";

interface ErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function Error({
  title = "Something went wrong",
  message = "We couldn't load the data you requested. Please try again.",
  onRetry,
}: ErrorProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <motion.div
        className="flex max-w-md flex-col items-center text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}>
        {/* Animated icon container */}
        <div className="relative mb-8">
          {/* Pulsing background ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-red-100"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Icon circle */}
          <motion.div
            className="relative flex size-24 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-200/60"
            animate={{ rotate: [0, -5, 5, -3, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 1,
            }}>
            <IconAlertTriangle size={40} stroke={1.5} className="text-red-500" />
          </motion.div>

          {/* Floating particles — scattered broken pieces effect */}
          {[...Array(5)].map((_, i) => {
            const angle = (i / 5) * 360;
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * 52;
            const y = Math.sin(rad) * 52;
            return (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 size-1.5 rounded-full bg-red-300"
                style={{ marginLeft: -3, marginTop: -3 }}
                animate={{
                  x: [0, x * 0.6, x],
                  y: [0, y * 0.6, y],
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  delay: i * 0.35,
                  ease: "easeOut",
                }}
              />
            );
          })}
        </div>

        {/* Title */}
        <motion.h2
          className="mb-2 text-2xl font-bold text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}>
          {title}
        </motion.h2>

        {/* Message */}
        <motion.p
          className="mb-8 leading-relaxed text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}>
          {message}
        </motion.p>

        {/* Retry button */}
        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="group flex cursor-pointer items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white shadow-lg shadow-primary-600/25 transition-colors hover:bg-primary-700"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}>
            <IconRefresh
              size={18}
              className="transition-transform duration-300 group-hover:-rotate-180"
            />
            Try Again
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
