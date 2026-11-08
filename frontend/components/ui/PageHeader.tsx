import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  containerClassName,
}: {
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <header
      className={cn(
        "relative overflow-hidden border-b border-line bg-canvas",
        className,
      )}
    >
      {/* subtle civic grid + green tint */}
      <div className="pattern-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-100/60 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-6 top-16 h-16 w-16 rounded-full bg-flag-200/50"
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative mx-auto w-full max-w-[1720px] px-3.5 py-6 sm:px-6 sm:py-9 lg:px-8 lg:py-12 xl:px-10 2xl:px-12",
          containerClassName,
        )}
      >
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-3 sm:mb-4">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 sm:text-sm">
              {breadcrumbs.map((crumb, i) => (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  {i > 0 ? (
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  ) : null}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="rounded text-slate-500 transition-colors hover:text-brand-700"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="font-medium text-slate-700">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-2.5 sm:text-base sm:leading-7 lg:text-lg">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap gap-2.5 sm:gap-3">{actions}</div> : null}
        </div>
      </div>
    </header>
  );
}

export default PageHeader;
