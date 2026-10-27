import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSingleCategory, getAllCategories } from "@/service/category";
import { getAllServices } from "@/service/service";
import { mapBackendCategoryToFrontend, mapBackendServiceToFrontend } from "@/lib/service-adapter";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { CatDetailBody } from "./CatDetailBody";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const res = await getAllCategories();
  if (res.success && res.data) {
    return res.data.map((c) => ({ slug: c.slug }));
  }
  return [];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  props: PageProps,
): Promise<Metadata> {
  const { slug } = await props.params;
  const res = await getSingleCategory(slug);
  if (!res.success || !res.data) return { title: "Category not found" };
  const cat = mapBackendCategoryToFrontend(res.data);
  return { title: `${cat.name} Services`, description: cat.description };
}

export default async function CategoryDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const [catRes, servicesRes] = await Promise.all([
    getSingleCategory(slug),
    getAllServices({ categoryId: slug, limit: 100 }),
  ]);

  if (!catRes.success || !catRes.data) notFound();

  const category = mapBackendCategoryToFrontend(catRes.data);
  const services = (servicesRes.success && servicesRes.data)
    ? servicesRes.data.map(mapBackendServiceToFrontend)
    : [];

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
      <CatDetailBody category={category} services={services} />
    </>
  );
}
