import type { Metadata } from "next";
import { getMe } from "@/service/auth";
import { SERVICES } from "@/lib/data/services";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { DemoNote } from "@/components/ui/States";
import { T } from "@/components/ui/T";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { UserSidebar } from "@/components/dashboard/layout/UserSidebar";
import {
  QuickActions,
  AdminAccessBanner,
  ApplicationsCard,
  SavedServicesCard,
  RecentSearchesCard,
  NotificationsCard,
} from "@/components/dashboard/user";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your NagorikSheba citizen dashboard.",
};

export default async function DashboardPage() {
  const meRes = await getMe();
  const user = meRes.success ? meRes.data : null;
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const saved = SERVICES.slice(0, 3);

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={
            user?.name
              ? { bn: `স্বাগতম, ${user.name}!`, en: `Welcome back, ${user.name}!` }
              : { bn: "ফিরে আসায় স্বাগতম!", en: "Welcome back!" }
          }
          description={{
            bn: "সংরক্ষিত সেবা, আবেদন ও সাম্প্রতিক কার্যক্রম — সব এক জায়গায়।",
            en: "Your saved services, applications and recent activity — all in one place.",
          }}
          breadcrumbs={[
            { label: { bn: "হোম", en: "Home" }, href: "/" },
            { label: { bn: "ড্যাশবোর্ড", en: "Dashboard" } },
          ]}
        />
      }
      sidebar={<UserSidebar user={user} />}
    >
      {/* Admin Notice Banner if logged in user is Administrator */}
      {isAdmin && <AdminAccessBanner />}

      {/* Demo Notification Banner */}
      <div>
        <DemoNote />
      </div>

      {/* Quick Action Shortcuts */}
      <section aria-labelledby="dash-quick">
        <h2 id="dash-quick" className="text-sm font-extrabold tracking-wide text-slate-500 uppercase">
          <T bn="দ্রুত কাজ" en="Quick Actions" />
        </h2>
        <div className="mt-3">
          <QuickActions />
        </div>
      </section>

      {/* Main Grid: Left Column for Applications & Saved Services, Right Column for Searches & Notifications */}
      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          <ApplicationsCard />
          <SavedServicesCard services={saved} />
        </div>

        <aside className="space-y-5">
          <RecentSearchesCard />
          <NotificationsCard />
        </aside>
      </div>
    </DashboardShell>
  );
}
