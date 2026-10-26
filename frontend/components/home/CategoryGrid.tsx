"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/data/categories";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

const STRINGS = {
  bn: {
    eyebrow: "ক্যাটাগরি",
    title: "সেবার বিভাগসমূহ",
    description:
      "সরকারি সেবা বিভাগ অনুযায়ী দেখুন — পরিচয়পত্র থেকে স্থানীয় সরকার পর্যন্ত।",
    services: "+ সেবা",
    viewServices: "সেবা দেখুন",
    viewAllCategories: "সব ক্যাটাগরি দেখুন",
  },
  en: {
    eyebrow: "Categories",
    title: "Service Categories",
    description:
      "Browse government services by category — from identity documents to local government.",
    services: "+ services",
    viewServices: "View services",
    viewAllCategories: "View all categories",
  },
};

/** Responsive 12-category grid (1 → 2 → 3 → 4 columns). */
export function CategoryGrid() {
  const { t } = useTranslation();
  const s = t(STRINGS);
  return (
    <section aria-labelledby="categories-heading" className="bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading
            id="categories-heading"
            eyebrow={s.eyebrow}
            title={s.title}
            description={s.description}
          />
        </Reveal>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CATEGORIES.map((cat, i) => (
            <Reveal
              key={cat.id}
              as="li"
              delay={(i % 4) * 60}
              className="flex h-full flex-col"
            >
              <Link
                href={`/categories/${cat.slug}`}
                className="group flex h-full flex-1 flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-6",
                      cat.accent === "green"
                        ? "bg-brand-50 text-brand-700 group-hover:bg-brand-100"
                        : "bg-flag-50 text-flag-600 group-hover:bg-flag-100",
                    )}
                  >
                    <Icon name={cat.icon} className="h-6 w-6" />
                  </span>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-500">
                    {cat.serviceCount}
                    {s.services}
                  </span>
                </div>

                <h3 className="mt-4 flex min-h-[2.75rem] items-start text-base font-bold text-slate-900 transition-colors group-hover:text-brand-700">
                  <span className="line-clamp-2">{cat.name}</span>
                </h3>
                <p className="mt-1.5 min-h-[3rem] text-sm leading-6 text-slate-500 line-clamp-2">
                  {cat.description}
                </p>

                <div className="mt-4 flex min-h-[54px] flex-wrap content-start gap-1.5">
                  {cat.samples.slice(0, 3).map((sample) => (
                    <span
                      key={sample}
                      className="inline-block max-w-[150px] truncate rounded-md bg-canvas px-2 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-line"
                    >
                      {sample}
                    </span>
                  ))}
                </div>

                <div className="mt-auto border-t border-line/60 pt-4">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
                    {s.viewServices}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <div className="mt-10 text-center">
            <Link
              href="/categories"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-white px-5 text-sm font-bold text-slate-700 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              {s.viewAllCategories}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default CategoryGrid;
