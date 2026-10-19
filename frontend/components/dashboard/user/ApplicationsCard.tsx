/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Card, CardBody, MetaItem } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { T } from "@/components/ui/T";
import { getMyTrackedServices } from "@/service/tracked-service";
import type { TrackedServiceItem } from "@/types/tracked-service";

const STATUS_LABEL: Record<string, { bn: string; en: string }> = {
  PREPARING: { bn: "প্রস্তুত", en: "Preparing" },
  READY_TO_APPLY: { bn: "আবেদন করার জন্য প্রস্তুত", en: "Ready to Apply" },
  SUBMITTED_BY_USER: { bn: "জমা দেওয়া হয়েছে", en: "Submitted" },
  FOLLOW_UP_REQUIRED: { bn: "ফলো-আপ প্রয়োজন", en: "Follow-up Required" },
  COMPLETED_BY_USER: { bn: "সম্পন্ন", en: "Completed" },
  CANCELLED: { bn: "বাতিল", en: "Cancelled" },
};

const STATUS_TONE: Record<string, "green" | "red" | "slate" | "amber"> = {
  PREPARING: "slate",
  READY_TO_APPLY: "amber",
  SUBMITTED_BY_USER: "slate",
  FOLLOW_UP_REQUIRED: "amber",
  COMPLETED_BY_USER: "green",
  CANCELLED: "red",
};

export async function ApplicationsCard() {
  const res = await getMyTrackedServices();
  const applications: TrackedServiceItem[] = res.success ? (res.data || []) : [];

  return (
    <section aria-labelledby="dash-apps">
      <div className="flex items-center justify-between">
        <h2 id="dash-apps" className="text-lg font-extrabold text-slate-900">
          <T bn="আমার আবেদন" en="My Applications" />
        </h2>
        <Link
          href="/dashboard/applications"
          className="text-sm font-bold text-brand-700 hover:text-brand-800"
        >
          <T bn="সব দেখুন" en="View all" />
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-dashed border-line bg-white p-6 text-center">
          <Icon name="ScrollText" className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-2 text-sm font-bold text-slate-700">
            <T bn="এখনো কোনো আবেদন নেই" en="No applications yet" />
          </p>
          <p className="mt-1 text-xs text-slate-400">
            <T
              bn="ট্র্যাক করা আবেদন এখানে দেখা যাবে।"
              en="Applications you track will appear here."
            />
          </p>
          <Link
            href="/services"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800"
          >
            <T bn="সেবা ব্রাউজ করুন" en="Browse services" />
            <span className="text-slate-400">→</span>
          </Link>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          {applications.map((app) => (
            <Card
              key={app.id}
              className="hover:border-brand-100 hover:shadow-sm"
            >
              <CardBody className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {app.service_name || app.title || "Untitled service"}
                    </h3>
                    {app.referenceNumber && (
                      <p className="mt-0.5 text-xs font-mono text-slate-500">
                        {app.referenceNumber}
                      </p>
                    )}
                    <div className="mt-1">
                      <MetaItem
                        label="Department"
                        value={
                          app.service_department ||
                          (app.service_category ? "Government service" : "—")
                        }
                        className="mt-0"
                      />
                    </div>
                  </div>
                  <Badge
                    tone={(STATUS_TONE[app.status] ?? "slate") as any}
                    className="whitespace-nowrap"
                  >
                    <T
                      bn={STATUS_LABEL[app.status]?.bn ?? app.status}
                      en={STATUS_LABEL[app.status]?.en ?? app.status}
                    />
                  </Badge>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                  <span>
                    <T bn="শেষ আপডেট" en="Last updated" />{" "}
                  </span>
                  <span>{new Date(app.lastUpdatedAt).toLocaleDateString()}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export default ApplicationsCard;

