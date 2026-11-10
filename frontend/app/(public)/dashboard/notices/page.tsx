import type { Metadata } from "next";
import { getMe } from "@/service/auth";
import { getAllCategories } from "@/service/category";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { UserSidebar } from "@/components/dashboard/layout/UserSidebar";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { NoticesCategoryGrid } from "@/components/notices/NoticesCategoryGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Government Notices | Dashboard",
  description: "Browse the latest official government notices inside your dashboard.",
};

export default async function DashboardNoticesPage() {
  const [meRes, catRes] = await Promise.all([
    getMe().catch(() => ({ success: false, data: null })),
    getAllCategories().catch(() => ({ success: false, data: [] })),
  ]);

  const user = meRes.success ? meRes.data : null;
  const categories = catRes.data || [];

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={{ bn: "নোটিশ বোর্ড ও ঘোষণা", en: "Notice Board & Announcements" }}
          description={{
            bn: "বিভিন্ন সরকারি বিভাগ ও দপ্তরের সর্বশেষ নোটিশ, সময়সূচি এবং সেবার হালনাগাদ তথ্য।",
            en: "Latest official government notices, circulars, and service update alerts.",
          }}
          breadcrumbs={[
            { label: { bn: "হোম", en: "Home" }, href: "/" },
            { label: { bn: "ড্যাশবোর্ড", en: "Dashboard" }, href: "/dashboard" },
            { label: { bn: "নোটিশ বোর্ড", en: "Notices" } },
          ]}
        />
      }
      sidebar={<UserSidebar user={user} />}
    >
      <div className="space-y-6">
        <NoticesCategoryGrid
          categories={categories}
          basePath="/dashboard/notices"
          showHeader={false}
        />
      </div>
    </DashboardShell>
  );
}
