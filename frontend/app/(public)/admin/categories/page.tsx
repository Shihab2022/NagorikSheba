import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMe } from "@/service/auth";
import { getAllCategories } from "@/service/category";
import { getAllServices } from "@/service/service";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { AdminSidebar } from "@/components/dashboard/layout/AdminSidebar";
import { CategoryManager } from "@/components/dashboard/categories/CategoryManager";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";

export const metadata: Metadata = {
  title: "Categories Management",
  description: "Manage and organize citizen service categories.",
};

export default async function AdminCategoriesPage() {
  const meRes = await getMe();

  if (!meRes.success || !meRes.data) {
    redirect("/login");
  }

  if (meRes.data.role?.toUpperCase() !== "ADMIN") {
    redirect("/dashboard");
  }

  const admin = meRes.data;

  const [categoriesRes, servicesRes] = await Promise.all([
    getAllCategories().catch(() => ({ data: [] })),
    getAllServices({ limit: 1 }).catch(() => ({ data: [], meta: { total: 0 } })),
  ]);

  const categories = categoriesRes.data || [];
  const servicesCount = servicesRes.meta?.total || 0;

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={{ bn: "ক্যাটাগরি ব্যবস্থাপনা", en: "Category Management" }}
          description={{
            bn: "সকল নাগরিক সেবা সুনির্দিষ্ট ক্যাটাগরিতে সুবিন্যস্ত ও পরিচালনা করুন।",
            en: "Organize, classify, and configure service categories across the portal.",
          }}
          breadcrumbs={[
            { label: { bn: "হোম", en: "Home" }, href: "/" },
            { label: { bn: "অ্যাডমিন ড্যাশবোর্ড", en: "Admin Dashboard" }, href: "/admin/dashboard" },
            { label: { bn: "ক্যাটাগরি", en: "Categories" } },
          ]}
        />
      }
      sidebar={
        <AdminSidebar
          admin={admin}
          categoriesCount={categories.length}
          servicesCount={servicesCount}
        />
      }
    >
      <CategoryManager initialCategories={categories} />
    </DashboardShell>
  );
}
