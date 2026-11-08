import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMe } from "@/service/auth";
import { getAllCategories } from "@/service/category";
import { getAllNoticesAdmin } from "@/service/notices";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { AdminSidebar } from "@/components/dashboard/layout/AdminSidebar";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { NoticesAdminClient } from "./NoticesAdminClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notices Management",
  description: "View, moderate, and publish government notices.",
};

export default async function AdminNoticesPage() {
  const meRes = await getMe();

  if (!meRes.success || !meRes.data) {
    redirect("/login");
  }

  if (meRes.data.role?.toUpperCase() !== "ADMIN") {
    redirect("/dashboard");
  }

  const admin = meRes.data;

  const [noticesRes, categoriesRes] = await Promise.all([
    getAllNoticesAdmin({ page: 1, limit: 20 }).catch(() => ({ success: false, data: undefined })),
    getAllCategories().catch(() => ({ success: false, data: [] })),
  ]);

  const items = noticesRes.data?.items || [];
  const total = noticesRes.data?.total || 0;
  const totalPages = noticesRes.data?.totalPages || 1;
  const categories = categoriesRes.data || [];

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={{ bn: "নোটিশ ব্যবস্থাপনা", en: "Notices Management" }}
          description={{
            bn: "সকল সরকারি নোটিশ ও প্রজ্ঞাপন পর্যালোচনা, ক্যাটাগরি হালনাগাদ ও নিয়ন্ত্রণ করুন।",
            en: "Moderate, review, and manually publish official notices across categories.",
          }}
          breadcrumbs={[
            { label: { bn: "হোম", en: "Home" }, href: "/" },
            { label: { bn: "অ্যাডমিন ড্যাশবোর্ড", en: "Admin Dashboard" }, href: "/admin/dashboard" },
            { label: { bn: "নোটিশ", en: "Notices" } },
          ]}
        />
      }
      sidebar={
        <AdminSidebar
          admin={admin}
          servicesCount={0}
          categoriesCount={categories.length}
        />
      }
    >
      <div className="p-6">
        <NoticesAdminClient
          initialItems={items}
          initialTotal={total}
          initialTotalPages={totalPages}
          categories={categories}
        />
      </div>
    </DashboardShell>
  );
}
