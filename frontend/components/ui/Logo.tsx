import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * NagorikSheba / নাগরিক সেবা brand lockup.
 * Mark: rounded deep-green tile with a flag-red disc (abstract flag reference).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-brand-700 shadow-sm",
        className,
      )}
      aria-hidden="true"
    >
      <span className="absolute h-4 w-4 rounded-full bg-flag-500" />
      <span className="absolute bottom-1.5 h-[3px] w-4 rounded-full bg-white/85" />
      <span className="absolute bottom-1.5 h-[3px] w-2 translate-x-[-6px] rounded-full bg-white/45" />
    </span>
  );
}

export function Logo({
  href = "/",
  tone = "dark",
  className,
  onClick,
}: {
  href?: string;
  /** dark = text for light backgrounds; light = white text for green nav. */
  tone?: "dark" | "light";
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("group flex items-center gap-2.5 rounded-lg", className)}
      aria-label="NagorikSheba home"
    >
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[17px] font-extrabold tracking-tight transition-transform duration-200 group-hover:-translate-y-px",
            tone === "dark" ? "text-slate-900" : "text-white",
          )}
        >
          Nagorik
          <span
            className={tone === "dark" ? "text-brand-600" : "text-brand-200"}
          >
            Sheba
          </span>
        </span>
        <span
          className={cn(
            "mt-0.5 text-[11px] font-semibold",
            tone === "dark" ? "text-slate-500" : "text-white/70",
          )}
        >
          নাগরিক সেবা
        </span>
      </span>
    </Link>
  );
}

export default Logo;
