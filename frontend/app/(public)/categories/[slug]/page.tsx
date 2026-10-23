import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategoryBySlug } from "@/lib/data/categories";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { CatDetailBody } from "./CatDetailBody";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/categories/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return { title: `${category.name} Services`, description: category.description };
}

export default async function CategoryDetailPage(props: PageProps<"/categories/[slug]">) {
  const { slug } = await props.params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <>
      <TranslatedPageHeader
        title={{ bn: category.name, en: category.name }}
        description={{ bn: category.description, en: category.description }}
        breadcrumbs={[
          { label: { bn: "হোম", en: "Home" }, href: "/" },
          { label: { bn: "ক্যাটাগরি", en: "Categories" }, href: "/categories" },
          { label: { bn: category.name, en: category.name } },
        ]}
      />
      <CatDetailBody slug={slug} />
    </>
  );
}
