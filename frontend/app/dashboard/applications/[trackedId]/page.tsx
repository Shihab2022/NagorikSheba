import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getMe } from "@/service/auth";
import { getSingleTrackedService } from "@/service/tracked-service";
import { getTrackedSteps } from "@/service/tracked-service";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { UserSidebar } from "@/components/dashboard/layout/UserSidebar";
import { TrackedServiceDetail } from "@/components/dashboard/user/TrackedServiceDetail";
import { Icon } from "@/components/ui/Icon";
import { T } from "@/components/ui/T";

export const metadata: Metadata = {
  title: "Application Details",
  description: "Track the real-time status and roadmap of your application.",
};

export default async function TrackedServicePage({
  params,
}: {
  params: Promise<{ trackedId: string }> | { trackedId: string };
}) {
  const resolvedParams = await params;
  const { trackedId } = resolvedParams;

  const meRes = await getMe();
  const user = meRes.success ? meRes.data : null;

  if (!user) {
    redirect(`/login?redirect=/dashboard/applications/${trackedId}`);
  }

  const svcRes = await getSingleTrackedService(trackedId);

  if (!svcRes.success || !svcRes.data) {
    return (
      <DashboardShell
        header={
          <TranslatedPageHeader
            title={{
              bn: "আবেদনের বিবরণ",
              en: "Application Details",
            }}
            description={{
              bn: "আপনার ট্র্যাক করা সেবার বিবরণ এখানে প্রদর্শিত হবে।",
              en: "Track the status and progress of your service application.",
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
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 sm:p-14 text-center shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Icon name="ScrollText" className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-lg font-extrabold text-slate-900">
            <T bn="আবেদনটি খুঁজে পাওয়া যায়নি" en="Application Not Found" />
          </h3>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            <T
              bn="এই আবেদনটি হয়তো সরানো হয়েছে অথবা এটি দেখার অনুমতি আপনার অ্যাকাউন্টে নেই।"
              en="This application may have been removed or you do not have permission to view it."
            />
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard/applications"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-700 transition-colors"
            >
              <T bn="আমার আবেদনে ফিরুন" en="Back to My Applications" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <T bn="সেবাসমূহ দেখুন" en="Browse Services" />
            </Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const stepsRes = await getTrackedSteps(trackedId);
  const steps = stepsRes.success ? (stepsRes.data || []) : [];

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={{
            bn: svcRes.data.service_name || svcRes.data.title || "আবেদনের বিবরণ",
            en: svcRes.data.service_name || svcRes.data.title || "Application Details",
          }}
          description={{
            bn: "আপনার আবেদনের বর্তমান অবস্থা ও প্রতিটি ধাপের অগ্রগতি ট্র্যাক করুন।",
            en: "Track the current status and roadmap progress of your application.",
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
