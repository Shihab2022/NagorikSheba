import React from "react";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { T } from "@/components/ui/T";
import { cn } from "@/lib/utils";

export interface DashboardSectionProps {
  title: { bn: string; en: string };
  subtitle?: { bn: string; en: string };
  icon?: LucideIcon;
  iconColorClass?: string;
  action?: {
    label: { bn: string; en: string };
    href?: string;
    onClick?: () => void;
  };
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export function DashboardSection({
  title,
  subtitle,
  icon: Icon,
  iconColorClass = "text-brand-600",
  action,
  children,
  className,
  headerClassName,
}: DashboardSectionProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-line bg-white p-6 shadow-card",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between border-b border-line pb-4",
          headerClassName
        )}
      >
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className={cn("h-5 w-5", iconColorClass)} />}
          <div>
            <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
              <T bn={title.bn} en={title.en} />
            </h2>
            {subtitle && (
              <p className="text-xs text-slate-500">
                <T bn={subtitle.bn} en={subtitle.en} />
              </p>
            )}
          </div>
        </div>

        {action &&
          (action.href ? (
            <Link
              href={action.href}
              className="text-xs font-bold text-brand-700 transition hover:text-brand-800"
            >
              <T bn={action.label.bn} en={action.label.en} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className="text-xs font-bold text-brand-700 transition hover:text-brand-800 cursor-pointer"
            >
              <T bn={action.label.bn} en={action.label.en} />
            </button>
          ))}
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}
