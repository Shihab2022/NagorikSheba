import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryNotices } from "@/service/notices";
import { getAllCategories } from "@/service/category";
import { CategoryNoticesExplorer } from "@/components/notices/CategoryNoticesExplorer";

export const revalidate = 600;

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ page?: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { category: slug } = await props.params;
  const res = await getCategoryNotices(slug, 1, 1);
  if (!res.success || !res.data) {
    return { title: "Category Notices" };
  }
  return {
    title: `${res.data.category.name} - Official Notices | NagorikSheba`,
    description: `Browse latest official government notices and announcements for ${res.data.category.name}.`,
  };
}

export default async function CategoryNoticesPage(props: PageProps) {
  const { category: slug } = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : {};
  const currentPage = Math.max(1, Number(searchParams?.page) || 1);

  // Parallel fetch: category notices + all categories for filter chips
  const [noticesRes, categoriesRes] = await Promise.all([
    getCategoryNotices(slug, currentPage, 20),
    getAllCategories().catch(() => ({ success: false, data: [] })),
  ]);

  if (!noticesRes.success || !noticesRes.data) {
    notFound();
  }

  const { category, items, total, totalPages, page } = noticesRes.data;
  const allCategories = categoriesRes.data || [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <CategoryNoticesExplorer
        category={category}
        items={items}
        allCategories={allCategories}
        page={page}
        totalPages={totalPages}
        total={total}
        basePath="/notices"
        isDashboard={false}
      />
    </div>
  );
}
