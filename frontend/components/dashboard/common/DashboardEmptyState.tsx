import React from "react";
import Link from "next/link";
import { type LucideIcon, FolderOpen, Plus } from "lucide-react";
import { T } from "@/components/ui/T";
import { cn } from "@/lib/utils";

export interface DashboardEmptyStateProps {
  icon?: LucideIcon;
  title: { bn: string; en: string };
  description?: { bn: string; en: string };
  action?: {
    label: { bn: string; en: string };
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function DashboardEmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  action,
  className,
}: DashboardEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center text-xs text-slate-500",
        className
      )}
    >
      <Icon className="h-10 w-10 text-slate-300 mb-3" />
      <p className="font-bold text-slate-700 text-sm">
        <T bn={title.bn} en={title.en} />
      </p>
      {description && (
        <p className="mt-1 text-xs text-slate-400 max-w-sm">
          <T bn={description.bn} en={description.en} />
        </p>
      )}
      {action && (
        <div className="mt-4">
          {action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-brand-800"
            >
              <Plus className="h-3.5 w-3.5" />
              <T bn={action.label.bn} en={action.label.en} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-brand-800 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <T bn={action.label.bn} en={action.label.en} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
