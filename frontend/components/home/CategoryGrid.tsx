"use client";

import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";
import type { ServiceCategory } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CustomLoader } from "@/components/ui/CustomLoader";
import { Skeleton } from "@/components/ui/States";
import { cn } from "@/lib/utils";

/** Responsive category grid powered by backend categories. */
export function CategoryGrid({
  categories = [],
  loading = false,
}: {
  categories?: ServiceCategory[];
  loading?: boolean;
}) {
  return (
    <section aria-labelledby="categories-heading" className="bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading
            id="categories-heading"
            eyebrow="Categories"
            title="Service Categories"
            description="Browse government services and real-time official notices by category — from identity documents to tax & finance."
          />
        </Reveal>

        {loading ? (
          <div className="mt-8 space-y-8">
            <CustomLoader
              size="md"
              message="Loading service categories..."
              subMessage="Fetching category information directly from backend server"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-44 flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-card"
                >
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-full rounded" />
                  </div>
                  <Skeleton className="h-4 w-24 rounded pt-2" />
                </div>
              ))}
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-line bg-canvas p-12 text-center">
            <p className="text-sm font-medium text-slate-500">
              No categories currently found.
            </p>
          </div>
        ) : (
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((cat, i) => {
              const noticeCount = cat.noticeCount ?? cat.notice_count ?? 0;
              const newNoticeCount = cat.newNoticeCount ?? cat.new_notice_count ?? 0;

              return (
                <Reveal
                  key={cat.id}
                  as="li"
                  delay={(i % 4) * 60}
                  className="flex h-full flex-col"
                >
                  <div className="group relative flex h-full flex-1 flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={cn(
                          "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-6",
                          cat.accent === "green"
                            ? "bg-brand-50 text-brand-700 group-hover:bg-brand-100"
                            : "bg-flag-50 text-flag-600 group-hover:bg-flag-100",
                        )}
                      >
                        <Icon name={cat.icon || "Folder"} className="h-6 w-6" />
                      </span>

                      <div className="flex flex-col items-end gap-1">
                        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-500">
                          {cat.serviceCount ?? 0} services
                        </span>
                        {newNoticeCount > 0 ? (
                          <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {newNoticeCount} new notices
                          </span>
                        ) : noticeCount > 0 ? (
                          <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                            <Bell className="h-2.5 w-2.5 text-slate-400" />
                            {noticeCount} notices
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <h3 className="mt-4 flex min-h-[2.75rem] items-start text-base font-bold text-slate-900 transition-colors group-hover:text-brand-700">
                      <Link href={`/categories/${cat.slug}`} className="line-clamp-2 hover:underline">
                        {cat.name}
                      </Link>
                    </h3>
                    <p className="mt-1.5 min-h-[3rem] text-sm leading-6 text-slate-500 line-clamp-2">
                      {cat.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-line/60 pt-4">
                      <Link
                        href={`/notices/${cat.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-brand-700"
                      >
                        Explore notices
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"
                      >
                        Services
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        )}

        <Reveal>
          <div className="mt-10 text-center">
            <Link
              href="/categories"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-white px-5 text-sm font-bold text-slate-700 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              View all categories
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default CategoryGrid;
