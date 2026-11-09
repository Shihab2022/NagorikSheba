import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMe } from "@/service/auth";
import { getSingleService } from "@/service/service";
import { getLatestNotices } from "@/service/notices";
import { mapBackendServiceToFrontend } from "@/lib/service-adapter";
import type { GovernmentService } from "@/lib/types";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { UserSidebar } from "@/components/dashboard/layout/UserSidebar";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { DashboardServiceDetailView } from "@/components/dashboard/services/DashboardServiceDetailView";

export const dynamic = "force-dynamic";

async function fetchService(slug: string): Promise<GovernmentService | null> {
  try {
    const res = await getSingleService(slug);
    if (res.success && res.data) {
      return mapBackendServiceToFrontend(res.data);
    }
  } catch {
    // API fetch failed
  }
  return null;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const service = await fetchService(slug);
  if (!service) return { title: "Service Details | Dashboard" };
  return {
    title: `${service.name} | Dashboard`,
    description: service.description,
  };
}

export default async function DashboardServiceDetailPage(props: PageProps) {
  const { slug } = await props.params;

  const [meRes, service] = await Promise.all([
    getMe().catch(() => ({ success: false, data: null })),
    fetchService(slug),
  ]);

  if (!service) {
    notFound();
  }

  const user = meRes.success ? meRes.data : null;

  const noticesRes = service.category
    ? await getLatestNotices({ slug: service.category, limit: 5 }).catch(() => ({
        success: false,
        data: [],
      }))
    : { success: false, data: [] };

  const notices = noticesRes.data || [];

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={{
            bn: service.name,
            en: service.name,
          }}
          description={{
            bn: service.description || "সরকারি সেবার বিস্তারিত তথ্য ও নির্দেশিকা।",
            en: service.description || "Official government service guidelines and procedures.",
          }}
          breadcrumbs={[
            { label: { bn: "হোম", en: "Home" }, href: "/" },
            { label: { bn: "ড্যাশবোর্ড", en: "Dashboard" }, href: "/dashboard" },
            { label: { bn: "সকল সেবা", en: "All Services" }, href: "/dashboard/services" },
            { label: { bn: service.name, en: service.name } },
          ]}
        />
      }
      sidebar={<UserSidebar user={user} />}
    >
      <DashboardServiceDetailView service={service} notices={notices} />
    </DashboardShell>
  );
}
