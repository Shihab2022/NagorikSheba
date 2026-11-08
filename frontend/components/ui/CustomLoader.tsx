"use client";

import { cn } from "@/lib/utils";

interface CustomLoaderProps {
  message?: string;
  subMessage?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Custom NagorikSheba Loader:
 * Branded with deep green & flag red tokens, fluid rotation, and glowing pulse.
 */
export function CustomLoader({
  message = "তথ্য লোড হচ্ছে...",
  subMessage = "অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন",
  size = "md",
  className,
}: CustomLoaderProps) {
  const sizeMap = {
    sm: {
      outer: "h-10 w-10",
      disc: "h-3.5 w-3.5",
      ring: "border-2",
      text: "text-xs",
    },
    md: {
      outer: "h-14 w-14",
      disc: "h-5 w-5",
      ring: "border-3",
      text: "text-sm",
    },
    lg: {
      outer: "h-20 w-20",
      disc: "h-7 w-7",
      ring: "border-4",
      text: "text-base",
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center justify-center p-6 text-center", className)}
    >
      {/* Branded dual-ring spinner with flag red core */}
      <div className={cn("relative flex items-center justify-center", currentSize.outer)}>
        {/* Outer glowing pulsing ring */}
        <div
          className="absolute inset-0 rounded-full bg-brand-500/15 animate-ping opacity-60"
          aria-hidden="true"
        />

        {/* Main rotating track */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border-brand-100 border-t-brand-600 animate-spin",
            currentSize.ring,
          )}
          style={{ animationDuration: "0.9s" }}
          aria-hidden="true"
        />

        {/* Inner reverse rotating accent track */}
        <div
          className={cn(
            "absolute inset-1.5 rounded-full border-flag-100 border-b-flag-500 animate-spin",
            currentSize.ring,
          )}
          style={{ animationDuration: "1.4s", animationDirection: "reverse" }}
          aria-hidden="true"
        />

        {/* Center core pulse disc (inspired by the NagorikSheba mark) */}
        <div
          className={cn(
            "rounded-full bg-gradient-to-tr from-brand-700 to-brand-500 shadow-sm animate-pulse",
            currentSize.disc,
          )}
          aria-hidden="true"
        />
      </div>

      {/* Label and descriptive helper */}
      {message && (
        <p className={cn("mt-4 font-bold text-slate-800 tracking-tight", currentSize.text)}>
          {message}
        </p>
      )}
      {subMessage && (
        <p className="mt-1 text-xs text-slate-500 max-w-xs leading-relaxed">
          {subMessage}
        </p>
      )}
    </div>
  );
}

export default CustomLoader;
