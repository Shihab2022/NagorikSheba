
"use client";

import Link from "next/link";
import type { MouseEventHandler } from "react";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

const STRINGS = {
  bn: {
    home: "হোম",
  },
  en: {
    home: "Home",
  },
};

type HomeButtonProps = {
  tone?: "light" | "dark";
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
};

export function HomeButton({
  tone = "dark",
  href = "/",
  onClick,
  className,
}: HomeButtonProps) {
  const { t } = useTranslation();
  const s = t(STRINGS);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label={s.home}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-bold transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        tone === "light"
          ? "text-white hover:bg-white/10 focus-visible:outline-white"
          : "text-brand-700 hover:bg-brand-50 focus-visible:outline-brand-600",
        className,
      )}
    >
      {s.home}
    </Link>
  );
}

export default HomeButton;
