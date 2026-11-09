import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMe } from "@/service/auth";
import { getCategoryNotices } from "@/service/notices";
import { getAllCategories } from "@/service/category";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { UserSidebar } from "@/components/dashboard/layout/UserSidebar";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { CategoryNoticesExplorer } from "@/components/notices/CategoryNoticesExplorer";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ page?: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { category: slug } = await props.params;
  const res = await getCategoryNotices(slug, 1, 1);
  if (!res.success || !res.data) {
    return { title: "Category Notices | Dashboard" };
  }
  return {
    title: `${res.data.category.name} Notices | Dashboard`,
    description: `Official notices and announcements for ${res.data.category.name} inside your citizen dashboard.`,
  };
}

export default async function DashboardCategoryNoticesPage(props: PageProps) {
  const { category: slug } = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : {};
  const currentPage = Math.max(1, Number(searchParams?.page) || 1);

  const [meRes, noticesRes, categoriesRes] = await Promise.all([
    getMe().catch(() => ({ success: false, data: null })),
    getCategoryNotices(slug, currentPage, 20),
    getAllCategories().catch(() => ({ success: false, data: [] })),
  ]);

  if (!noticesRes.success || !noticesRes.data) {
    notFound();
  }

  const user = meRes.success ? meRes.data : null;
  const { category, items, total, totalPages, page } = noticesRes.data;
  const allCategories = categoriesRes.data || [];

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={{
            bn: `${category.name} নোটিশ ও ঘোষণা`,
            en: `${category.name} Notices`,
          }}
          description={{
            bn: category.description || "অফিসিয়াল সরকারি নোটিশ, প্রজ্ঞাপন এবং নির্দেশিকা।",
            en: category.description || "Official government notices, circulars, and announcements.",
          }}
          breadcrumbs={[
            { label: { bn: "হোম", en: "Home" }, href: "/" },
            { label: { bn: "ড্যাশবোর্ড", en: "Dashboard" }, href: "/dashboard" },
            { label: { bn: "নোটিশ বোর্ড", en: "Notices" }, href: "/dashboard/notices" },
            { label: { bn: category.name, en: category.name } },
          ]}
        />
      }
      sidebar={<UserSidebar user={user} />}
    >
      <div className="space-y-6">
        <CategoryNoticesExplorer
          category={category}
          items={items}
          allCategories={allCategories}
          page={page}
          totalPages={totalPages}
          total={total}
          basePath="/dashboard/notices"
          isDashboard={true}
        />
      </div>
    </DashboardShell>
  );
}
