"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { markHomeNavigationIntent } from "@/lib/home-navigation-intent";

/**
 * Inner-page header with optional breadcrumb trail,
 * on a subtle Bangladesh-inspired patterned band.
 */
export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "relative overflow-hidden border-b border-line bg-canvas",
        className,
      )}
    >
      {/* Subtle civic grid + green tint */}
      <div className="pattern-grid absolute inset-0" aria-hidden="true" />

      <div
        className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-100/60 blur-2xl"
        aria-hidden="true"
      />

      <div
        className="absolute -right-6 top-16 h-16 w-16 rounded-full bg-flag-200/50"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
              {breadcrumbs.map((crumb, i) => (
                <li
                  key={`${crumb.label}-${i}`}
                  className="flex items-center gap-1.5"
                >
                  {i > 0 ? (
                    <ChevronRight
                      className="h-3.5 w-3.5 text-slate-400"
                      aria-hidden="true"
                    />
                  ) : null}

                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      onClick={
                        crumb.href === "/"
                          ? markHomeNavigationIntent
                          : undefined
                      }
                      className="rounded text-slate-500 transition-colors hover:text-brand-700"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      aria-current="page"
                      className="font-medium text-slate-700"
                    >
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h1>

            {description ? (
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>

          {actions ? (
            <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default PageHeader;