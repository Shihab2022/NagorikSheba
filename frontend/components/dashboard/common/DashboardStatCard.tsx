import React from "react";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { T } from "@/components/ui/T";
import { cn } from "@/lib/utils";

export interface DashboardStatCardProps {
  label: { bn: string; en: string };
  value: number | string;
  icon?: LucideIcon;
  href?: string;
  colorClass?: string;
  badge?: string;
  subtext?: { bn: string; en: string };
  className?: string;
}

export function DashboardStatCard({
  label,
  value,
  icon: Icon,
  href,
  colorClass = "bg-brand-50 text-brand-700 border-brand-200",
  badge,
  subtext,
  className,
}: DashboardStatCardProps) {
  const content = (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300",
        href && "hover:-translate-y-0.5 hover:shadow-card-hover",
        className
      )}
    >
      <div className="flex items-center justify-between">
        {Icon && (
          <span
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-xl border",
              colorClass
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        )}
        <span className="text-3xl font-black text-slate-900">{value}</span>
      </div>

      <div className="mt-3">
        <p className="text-sm font-bold text-slate-600 transition-colors group-hover:text-brand-700">
          <T bn={label.bn} en={label.en} />
        </p>
        {subtext && (
          <p className="mt-0.5 text-xs text-slate-400">
            <T bn={subtext.bn} en={subtext.en} />
          </p>
        )}
      </div>

      {badge && (
        <span className="absolute top-3 right-3 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
          {badge}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
