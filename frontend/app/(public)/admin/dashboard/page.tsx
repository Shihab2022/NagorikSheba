import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMe } from "@/service/auth";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { OFFICES } from "@/lib/data/offices";
import { NOTICES } from "@/lib/data/notices";
import { getAllCategories } from "@/service/category";
import { getAllServices } from "@/service/service";
import { mapBackendServiceToFrontend } from "@/lib/service-adapter";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { AdminSidebar } from "@/components/dashboard/layout/AdminSidebar";
import {
  AdminIdentityBanner,
  AdminStatsGrid,
  AdminModulesGrid,
  AdminRecentServices,
  AdminSystemStatus,
} from "@/components/dashboard/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "NagorikSheba administration and management console.",
};

export default async function AdminDashboardPage() {
  const meRes = await getMe();

  if (!meRes.success || !meRes.data) {
    redirect("/login");
  }

  if (meRes.data.role?.toUpperCase() !== "ADMIN") {
    redirect("/dashboard");
  }

  const admin = meRes.data;

  const [categoriesRes, servicesRes] = await Promise.all([
    getAllCategories().catch(() => ({ success: false, data: [] })),
    getAllServices({ limit: 5 }).catch(() => ({ success: false, data: [], meta: { total: 0 } })),
  ]);

  const categoriesCount = categoriesRes.data?.length ?? 0;
  const servicesCount = servicesRes.meta?.total ?? 0;
  const recentServices = Array.isArray(servicesRes.data)
    ? servicesRes.data.map(mapBackendServiceToFrontend)
    : [];

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={{ bn: "অ্যাডমিন ড্যাশবোর্ড", en: "Admin Dashboard" }}
          description={{
            bn: "নাগরিক সেবা প্ল্যাটফর্মের সামগ্রিক ব্যবস্থাপনা, সেবা পর্যবেক্ষণ ও সিস্টেম নিয়ন্ত্রণ।",
            en: "Platform administration, service oversight, and system management console.",
          }}
          breadcrumbs={[
            { label: { bn: "হোম", en: "Home" }, href: "/" },
            { label: { bn: "অ্যাডমিন ড্যাশবোর্ড", en: "Admin Dashboard" } },
          ]}
        />
      }
      sidebar={
        <AdminSidebar
          admin={admin}
          categoriesCount={categoriesCount}
          servicesCount={servicesCount}
        />
      }
    >
      {/* Admin Identity & Profile Banner */}
      <AdminIdentityBanner admin={admin} />

      {/* KPI Stats Grid */}
      <AdminStatsGrid
        servicesCount={servicesCount}
        categoriesCount={categoriesCount}
        officesCount={OFFICES.length}
        noticesCount={NOTICES.length}
      />

      {/* Two Column Section: Management Modules & Recent Services on Left, System Status on Right */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AdminModulesGrid
            servicesCount={servicesCount}
            categoriesCount={categoriesCount}
            officesCount={OFFICES.length}
            noticesCount={NOTICES.length}
          />

          <AdminRecentServices services={recentServices} />
        </div>

        <AdminSystemStatus admin={admin} />
      </div>
    </DashboardShell>
  );
}
