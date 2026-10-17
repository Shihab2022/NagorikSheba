import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMe } from "@/service/auth";
import { getAllCategories } from "@/service/category";
import { getAllServices } from "@/service/service";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { CategoryManager } from "@/components/dashboard/CategoryManager";
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
    <>
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

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <AdminSidebar
            admin={admin}
            categoriesCount={categories.length}
            servicesCount={servicesCount}
          />

          <main className="min-w-0 flex-1">
            <CategoryManager initialCategories={categories} />
          </main>
        </div>
      </div>
    </>
  );
}
