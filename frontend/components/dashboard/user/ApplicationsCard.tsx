/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { ArrowRight, Clock, FileText, PlusCircle } from "lucide-react";
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
  let applications: TrackedServiceItem[] = [];
  try {
    const res = await getMyTrackedServices();
    if (res.success && res.data) {
      applications = res.data;
    }
  } catch {
    // If not authenticated or error, leave empty
    applications = [];
  }

  return (
    <section aria-labelledby="dash-apps" className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 id="dash-apps" className="text-base font-black text-slate-900">
              <T bn="আমার আবেদন" en="My Applications" />
            </h2>
            <p className="text-xs text-slate-400">
              <T bn="বর্তমান অগ্রগতি ও ট্র্যাকিং" en="Current progress & tracking" />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-black text-slate-600">
            {applications.length}
          </span>
          <Link
            href="/dashboard/applications"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800 transition-colors"
          >
            <T bn="সব দেখুন" en="View all" />
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-gradient-to-b from-slate-50/50 to-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 text-slate-400">
            <FileText className="h-7 w-7 text-slate-300" />
          </div>
          <h3 className="mt-3.5 text-sm font-black text-slate-800">
            <T bn="এখনো কোনো আবেদন ট্র্যাক করা হয়নি" en="No applications tracked yet" />
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
            <T
              bn="আপনি যেকোনো সেবার পাতায় গিয়ে “আবেদন ট্র্যাক করুন” বোতাম চেপে আপনার আবেদনের প্রতিটি ধাপ পর্যবেক্ষণ করতে পারেন।"
              en="Visit any service page and click “Track Service” to monitor your application milestones step-by-step."
            />
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Link
              href="/dashboard/services"
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <T bn="সেবা খুঁজে ট্র্যাক করুন" en="Browse & Track Service" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {applications.map((app) => (
            <Card
              key={app.id}
              className="hover:border-brand-200 hover:shadow-md transition-all group border-slate-200/80"
            >
              <CardBody className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/dashboard/applications/${app.id}`}
                      className="text-sm font-bold text-slate-900 group-hover:text-brand-600 leading-snug transition-colors"
                    >
                      {app.service_name || app.title || "Untitled service"}
                    </Link>
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
                  <div className="flex items-center gap-3">
                    <Badge
                      tone={(STATUS_TONE[app.status] ?? "slate") as any}
                      className="whitespace-nowrap"
                    >
                      <T
                        bn={STATUS_LABEL[app.status]?.bn ?? app.status}
                        en={STATUS_LABEL[app.status]?.en ?? app.status}
                      />
                    </Badge>
                    <Link
                      href={`/dashboard/applications/${app.id}`}
                      className="inline-flex items-center justify-center text-xs font-bold text-brand-600 hover:text-brand-700 p-1"
                    >
                      <T bn="বিস্তারিত →" en="Details →" />
                    </Link>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 border-t border-slate-100 pt-2.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    <T bn="সর্বশেষ হালনাগাদ:" en="Last updated:" />{" "}
                    {new Date(app.lastUpdatedAt).toLocaleDateString()}
                  </span>
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
