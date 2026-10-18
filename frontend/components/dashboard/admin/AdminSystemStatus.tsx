import Link from "next/link";
import { Sparkles, CheckCircle } from "lucide-react";
import { T } from "@/components/ui/T";

export interface AdminSystemStatusProps {
  admin: {
    role?: string;
    hasPassword?: boolean;
  };
}

export function AdminSystemStatus({ admin }: AdminSystemStatusProps) {
  return (
    <aside className="space-y-6">
      {/* System Status Metrics */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
        <div className="flex items-center gap-2 border-b border-line pb-4">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h2 className="text-base font-extrabold text-slate-900">
            <T bn="সিস্টেম স্ট্যাটাস" en="System Status" />
          </h2>
        </div>
        <div className="mt-4 space-y-3.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              <T bn="ডাটাবেজ" en="Database" />
            </span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
              <CheckCircle className="h-4 w-4" /> PostgreSQL
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              <T bn="অথেনটিকেশন" en="Authentication" />
            </span>
            <span className="font-bold text-slate-700">JWT / Local + Google</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              <T bn="ইউজার রোল" en="Current Role" />
            </span>
            <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
              {admin.role || "ADMIN"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              <T bn="পাসওয়ার্ড স্ট্যাটাস" en="Password Set" />
            </span>
            <span className="text-xs font-bold text-slate-700">
              {admin.hasPassword ? "Yes (Local)" : "No (OAuth only)"}
            </span>
          </div>
        </div>
      </section>

      {/* Administrator Guidance Card */}
      <section className="rounded-2xl border border-line bg-brand-50/50 p-6 shadow-card">
        <h2 className="text-base font-extrabold text-brand-900">
          <T bn="প্রশাসনিক নির্দেশনা" en="Administrator Notice" />
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-brand-800/80">
          <T
            bn="প্রতিটি সরকারি সেবার তথ্য নিয়মিত সরকারি পোর্টাল থেকে যাচাই করুন এবং ফি, সময়সীমা ও আবেদন প্রক্রিয়ার আপডেট নিশ্চিত করুন।"
            en="Regularly verify service specifications against official government portals to ensure fees, timelines and requirement procedures remain accurate."
          />
        </p>
        <div className="mt-4">
          <Link
            href="/search"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-800"
          >
            <T bn="সেবা যাচাই শুরু করুন" en="Inspect Services" />
          </Link>
        </div>
      </section>
    </aside>
  );
}

export default AdminSystemStatus;
