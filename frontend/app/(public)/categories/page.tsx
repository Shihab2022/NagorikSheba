import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllCategories } from "@/service/category";
import { mapBackendCategoryToFrontend } from "@/lib/service-adapter";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { T } from "@/components/ui/T";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Service Categories",
  description:
    "Browse all Bangladesh government service categories — identity, passport, transport, tax, land, education, health and more.",
};

export default async function CategoriesPage() {
  const res = await getAllCategories();
  const categories = (res.success && res.data)
    ? res.data.map(mapBackendCategoryToFrontend)
    : [];

  return (
    <>
      <TranslatedPageHeader
        title={{ bn: "সেবার ক্যাটাগরি", en: "Service Categories" }}
        description={{
          bn: "সব সেবা ক্যাটাগরি অনুযায়ী সাজানো — প্রয়োজনীয় সেবা খুঁজুন।",
          en: "Browse all Bangladesh government service categories — identity, passport, transport, tax, land, education, health and more.",
        }}
        breadcrumbs={[{ label: { bn: "হোম", en: "Home" }, href: "/" }, { label: { bn: "ক্যাটাগরি", en: "Categories" } }]}
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat, i) => (
            <Reveal
              key={cat.id}
              as="li"
              delay={(i % 4) * 50}
              className="flex h-full flex-col"
            >
              <Link
                href={`/categories/${cat.slug}`}
                className="group flex h-full flex-1 flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-6",
                      cat.accent === "green"
                        ? "bg-brand-50 text-brand-700"
                        : "bg-flag-50 text-flag-600",
                    )}
                  >
                    <Icon name={cat.icon || "Folder"} className="h-6 w-6" />
                  </span>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-500">
                    {cat.serviceCount ?? 0} <T bn="সেবা" en="services" />
                  </span>
                </div>
                <h2 className="mt-4 flex min-h-[2.75rem] items-start text-base font-bold text-slate-900 transition-colors group-hover:text-brand-700">
                  <span className="line-clamp-2">{cat.name}</span>
                </h2>
                <p className="mt-1.5 min-h-[3rem] text-sm leading-6 text-slate-500 line-clamp-2">
                  {cat.description}
                </p>
                <div className="mt-auto border-t border-line/60 pt-4">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
                    <T bn="দেখুন" en="Explore" />
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
      </div>
    </>
  );
}
