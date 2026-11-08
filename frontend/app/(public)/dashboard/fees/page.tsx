import type { Metadata } from "next";
import { getMe } from "@/service/auth";
import { getAllServices } from "@/service/service";
import { mapBackendServiceToFrontend } from "@/lib/service-adapter";
import type { GovernmentService } from "@/lib/types";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { UserSidebar } from "@/components/dashboard/layout/UserSidebar";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { DashboardFeesView } from "./DashboardFeesView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Government Fees | Dashboard",
  description: "Indicative government fees for citizen services inside the dashboard.",
};

export default async function DashboardFeesPage() {
  const meRes = await getMe();
  const user = meRes.success ? meRes.data : null;

  let services: GovernmentService[] = [];
  try {
    const res = await getAllServices({ limit: 50 });
    if (res?.success && Array.isArray(res.data)) {
      services = res.data.map(mapBackendServiceToFrontend);
    }
  } catch {
    services = [];
  }

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={{
            bn: "সরকারি ফি নির্দেশিকা",
            en: "Government Fee Guide",
          }}
          description={{
            bn: "এক নজরে আনুমানিক সরকারি ফি — আবেদনের আগে বাজেট ও তথ্য যাচাই করুন।",
            en: "Indicative government fees at a glance — budget and verify before applying.",
          }}
          breadcrumbs={[
            { label: { bn: "হোম", en: "Home" }, href: "/" },
            { label: { bn: "ড্যাশবোর্ড", en: "Dashboard" }, href: "/dashboard" },
            { label: { bn: "ফি", en: "Fees" } },
          ]}
        />
      }
      sidebar={<UserSidebar user={user} />}
    >
      <DashboardFeesView services={services} />
    </DashboardShell>
  );
}
