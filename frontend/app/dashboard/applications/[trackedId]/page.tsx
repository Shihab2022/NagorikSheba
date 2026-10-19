import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMe } from "@/service/auth";
import { getSingleTrackedService } from "@/service/tracked-service";
import { getTrackedSteps } from "@/service/tracked-service";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { UserSidebar } from "@/components/dashboard/layout/UserSidebar";
import { TrackedServiceDetail } from "@/components/dashboard/user/TrackedServiceDetail";

export const metadata: Metadata = {
  title: "Application Details",
};

export default async function TrackedServicePage({
  params,
}: {
  params: { trackedId: string };
}) {
  const { trackedId } = params;
  const meRes = await getMe();
  const user = meRes.success ? meRes.data : null;

  const svcRes = await getSingleTrackedService(trackedId);
  if (!svcRes.success || !svcRes.data) return notFound();

  const stepsRes = await getTrackedSteps(trackedId);
  const steps = stepsRes.success ? (stepsRes.data || []) : [];

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={{
            bn: "আবেদনের বিবরণ",
            en: "Application Details",
          }}
          description={{
            bn: "আপনার ট্র্যাক করা সেবার সমস্ত ধাপের অগ্রগতি এখানে রয়েছে।",
            en: "Progress of all steps for your tracked service.",
          }}
          breadcrumbs={[
            { label: { bn: "হোম", en: "Home" }, href: "/" },
            { label: { bn: "ড্যাশবোর্ড", en: "Dashboard" }, href: "/dashboard" },
            { label: { bn: "আমার আবেদন", en: "My Applications" }, href: "/dashboard/applications" },
            { label: { bn: "বিস্তারিত", en: "Details" } },
          ]}
        />
      }
      sidebar={<UserSidebar user={user} />}
    >
      <TrackedServiceDetail trackedService={svcRes.data} steps={steps} />
    </DashboardShell>
  );
}
