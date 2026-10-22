import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMe } from "@/service/auth";
import { getAllCategories } from "@/service/category";
import { getAllServices } from "@/service/service";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { AdminSidebar } from "@/components/dashboard/layout/AdminSidebar";
import { ServiceManager } from "@/components/dashboard/services/ServiceManager";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";

export const metadata: Metadata = {
  title: "Services Management",
  description: "Manage citizen services, requirements, processing times, and publication status.",
};

export default async function AdminServicesPage() {
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
    getAllServices({ limit: 100 }).catch(() => ({ data: [], meta: { total: 0 } })),
  ]);

  const categories = categoriesRes.data || [];
  const services = servicesRes.data || [];
  const servicesTotal = servicesRes.meta?.total ?? services.length;

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={{ bn: "সেবা ব্যবস্থাপনা", en: "Services Management" }}
          description={{
            bn: "সরকারি সেবাসমূহের তথ্য, বিবরণ, সময়সীমা ও লাইভ প্রকাশনা পর্যবেক্ষণ ও নিয়ন্ত্রণ করুন।",
            en: "Configure and maintain public government services, fees, requirements and publish status.",
          }}
          breadcrumbs={[
            { label: { bn: "হোম", en: "Home" }, href: "/" },
            { label: { bn: "অ্যাডমিন ড্যাশবোর্ড", en: "Admin Dashboard" }, href: "/admin/dashboard" },
            { label: { bn: "সেবা ব্যবস্থাপনা", en: "Services" } },
          ]}
        />
      }
      sidebar={
        <AdminSidebar
          admin={admin}
          categoriesCount={categories.length}
          servicesCount={servicesTotal}
        />
      }
    >
      <ServiceManager
        initialServices={services}
        categories={categories}
        initialTotal={servicesTotal}
      />
    </DashboardShell>
  );
}
