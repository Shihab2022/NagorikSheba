import { Layers, Database, Building2, Bell } from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard/common/DashboardStatCard";
import { T } from "@/components/ui/T";

export interface AdminStatsGridProps {
  servicesCount: number;
  categoriesCount: number;
  officesCount: number;
  noticesCount: number;
}

export function AdminStatsGrid({
  servicesCount,
  categoriesCount,
  officesCount,
  noticesCount,
}: AdminStatsGridProps) {
  const stats = [
    {
      icon: Layers,
      label: { bn: "মোট সেবা", en: "Total Services" },
      value: servicesCount,
      href: "/admin/services",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      icon: Database,
      label: { bn: "সেবা ক্যাটাগরি", en: "Categories" },
      value: categoriesCount,
      href: "/admin/categories",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      icon: Building2,
      label: { bn: "সরকারি অফিস", en: "Govt Offices" },
      value: officesCount,
      href: "/government-offices",
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      icon: Bell,
      label: { bn: "নাগরিক নোটিশ", en: "Active Notices" },
      value: noticesCount,
      href: "/notices",
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
  ];

  return (
    <section aria-labelledby="admin-stats-heading">
      <h2 id="admin-stats-heading" className="sr-only">
        <T bn="পরিসংখ্যান" en="Statistics" />
      </h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <DashboardStatCard
            key={i}
            label={s.label}
            value={s.value}
            icon={s.icon}
            href={s.href}
            colorClass={s.color}
          />
        ))}
      </div>
    </section>
  );
}

export default AdminStatsGrid;
