import type { Metadata } from "next";
import { getMe } from "@/service/auth";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { UserSidebar } from "@/components/dashboard/layout/UserSidebar";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { OfficesExplorer } from "@/components/offices/OfficesExplorer";

export const metadata: Metadata = {
  title: "Government Offices | Dashboard",
  description: "Find government offices across Bangladesh from your citizen dashboard.",
};

export default async function DashboardOfficesPage() {
  const meRes = await getMe();
  const user = meRes.success ? meRes.data : null;

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={{ bn: "সরকারি অফিস খুঁজুন", en: "Find Government Offices" }}
          description={{
            bn: "নিকটস্থ পাসপোর্ট, ভূমি, বিআরটিএ ও অন্যান্য সরকারি অফিসের ঠিকানা ও সেবা জানুন।",
            en: "Locate passport, land, transport and regional citizen desks across Bangladesh.",
          }}
          breadcrumbs={[
            { label: { bn: "হোম", en: "Home" }, href: "/" },
            { label: { bn: "ড্যাশবোর্ড", en: "Dashboard" }, href: "/dashboard" },
            { label: { bn: "সরকারি অফিস", en: "Government Offices" } },
          ]}
        />
      }
      sidebar={<UserSidebar user={user} />}
    >
      <OfficesExplorer />
    </DashboardShell>
  );
}
