/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import Link from "next/link";
import { getMe } from "@/service/auth";
import { getMyTrackedServices } from "@/service/tracked-service";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { DemoNote } from "@/components/ui/States";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { UserSidebar } from "@/components/dashboard/layout/UserSidebar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { T } from "@/components/ui/T";
import type { TrackedServiceItem } from "@/types/tracked-service";

const STATUS_LABEL: Record<string, { bn: string; en: string }> = {
  PREPARING: { bn: "প্রস্তুত", en: "Preparing" },
  READY_TO_APPLY: { bn: "আবেদন করার জন্য প্রস্তুত", en: "Ready to Apply" },
  SUBMITTED_BY_USER: { bn: "জমা দেওয়া হয়েছে", en: "Submitted" },
  FOLLOW_UP_REQUIRED: { bn: "ফলো-আপ প্রয়োজন", en: "Follow-up Required" },
  COMPLETED_BY_USER: { bn: "সম্পন্ন", en: "Completed" },
  CANCELLED: { bn: "বাতিল", en: "Cancelled" },
};

export const metadata: Metadata = {
  title: "My Applications",
  description: "Track the government services you are pursuing.",
};

export default async function ApplicationsPage() {
  const meRes = await getMe();
  const user = meRes.success ? meRes.data : null;
  const res = await getMyTrackedServices();
  const applications: TrackedServiceItem[] = res.success ? (res.data || []) : [];

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={{ bn: "আমার আবেদন", en: "My Applications" }}
          description={{
            bn: "আপনি কোন সেবাগুলো নিচ্ছেন তার অবস্থা यहाँ দেখুন।",
            en: "See the status of the government services you are pursuing.",
          }}
          breadcrumbs={[
            { label: { bn: "হোম", en: "Home" }, href: "/" },
            { label: { bn: "ড্যাশবোর্ড", en: "Dashboard" }, href: "/dashboard" },
            { label: { bn: "আমার আবেদন", en: "My Applications" } },
          ]}
        />
      }
      sidebar={<UserSidebar user={user} />}
    >
      <div className="space-y-6">
        <DemoNote />
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">
            <T bn="সক্রিয় আবেদন" en="Your Applications" />
          </h2>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-bold text-brand-700 shadow-sm hover:bg-brand-50"
          >
            <T bn="নতুন সেবা ট্র্যাক করুন" en="Track a new service" />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
            <Icon name="ScrollText" className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-lg font-bold text-slate-900">
              <T bn="এখনো কোনো আবেদন নেই" en="No applications yet" />
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              <T
                bn="যেকোনো সেবার পাতায় যầngে 'ট্র্যাক করুন' চাপুন।"
                en="Open any service and tap 'Track this service' to start following it."
              />
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((app) => (
              <Card key={app.id} className="hover:border-brand-100 hover:shadow-sm">
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {app.service_name || app.title || "Untitled service"}
                      </h3>
                      {app.referenceNumber && (
                        <p className="mt-0.5 text-xs font-mono text-slate-500">
                          {app.referenceNumber}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-slate-500">
                        {app.service_department ||
                          (app.service_category ? "Government service" : "—")}
                      </p>
                    </div>
                    <Badge
                      tone={
                        (
                          {
                            PREPARING: "slate",
                            READY_TO_APPLY: "amber",
                            SUBMITTED_BY_USER: "slate",
                            FOLLOW_UP_REQUIRED: "amber",
                            COMPLETED_BY_USER: "green",
                            CANCELLED: "red",
                          }[app.status] ?? "slate"
                        ) as any
                      }
                    >
                      <T
                        bn={STATUS_LABEL[app.status]?.bn ?? app.status}
                        en={STATUS_LABEL[app.status]?.en ?? app.status}
                      />
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <Link
                      href={`/dashboard/applications/${app.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-bold text-brand-700 shadow-sm hover:bg-brand-50"
                    >
                      <T bn="বিস্তারিত দেখুন" en="View details" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
