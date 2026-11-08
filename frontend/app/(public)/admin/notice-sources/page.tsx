import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMe } from "@/service/auth";
import { getAllCategories } from "@/service/category";
import { getAllNoticeSources } from "@/service/notices";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { AdminSidebar } from "@/components/dashboard/layout/AdminSidebar";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { NoticeSourcesClient } from "./NoticeSourcesClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notice Sources Management",
  description: "Configure scrapers and automated notice ingestion from government portals.",
};

export default async function AdminNoticeSourcesPage() {
  const meRes = await getMe();

  if (!meRes.success || !meRes.data) {
    redirect("/login");
  }

  if (meRes.data.role?.toUpperCase() !== "ADMIN") {
    redirect("/dashboard");
  }

  const admin = meRes.data;

  const [sourcesRes, categoriesRes] = await Promise.all([
    getAllNoticeSources().catch(() => ({ success: false, data: [] })),
    getAllCategories().catch(() => ({ success: false, data: [] })),
  ]);

  const sources = sourcesRes.data || [];
  const categories = categoriesRes.data || [];

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={{ bn: "নোটিশ সোর্স স্ক্র্যাপার", en: "Notice Sources Management" }}
          description={{
            bn: "সরকারি ওয়েবসাইট থেকে স্বয়ংক্রিয়ভাবে নোটিশ সংগ্রহের নিয়ম ও সোর্স পরিচালনা করুন।",
            en: "Configure automated web scrapers to ingest official notices from ministry websites.",
          }}
          breadcrumbs={[
            { label: { bn: "হোম", en: "Home" }, href: "/" },
            { label: { bn: "অ্যাডমিন ড্যাশবোর্ড", en: "Admin Dashboard" }, href: "/admin/dashboard" },
            { label: { bn: "নোটিশ সোর্স", en: "Notice Sources" } },
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
        <NoticeSourcesClient initialSources={sources} categories={categories} />
      </div>
    </DashboardShell>
  );
}
