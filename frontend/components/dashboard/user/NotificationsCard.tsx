import { Bell, Calendar, ChevronRight, FileCheck } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/ui/T";

export function NotificationsCard() {
  return (
    <section aria-labelledby="dash-notif" className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h2 id="dash-notif" className="flex items-center gap-2 text-xs font-black tracking-wide text-slate-800 uppercase">
          <Bell className="h-4 w-4 text-brand-600" aria-hidden="true" />
          <T bn="জরুরি নোটিশ ও বার্তা" en="Notices & Alerts" />
        </h2>
        <Link href="/dashboard/notices" className="text-[11px] font-bold text-brand-700 hover:underline">
          <T bn="সকল নোটিশ" en="All notices" />
        </Link>
      </div>

      <ul className="mt-3.5 space-y-2.5">
        <li className="rounded-xl border border-amber-100 bg-amber-50/60 p-3 transition-colors hover:bg-amber-50">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <Calendar className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-amber-950">
                <T bn="কর রিমাইন্ডার" en="Tax Deadline Reminder" />
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-amber-900/80">
                <T bn="ই-রিটার্ন দাখিলের সময়সীমা ঘনিয়ে আসছে।" en="Online e-Return deadline is approaching." />
              </p>
            </div>
          </div>
        </li>

        <li className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition-colors hover:bg-slate-50">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-800">
              <FileCheck className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-slate-900">
                <T bn="BRTA পরীক্ষার শিডিউল" en="BRTA Test Schedule" />
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                <T bn="ড্রাইভিং লাইসেন্স পরীক্ষার সময়সূচি হালনাগাদ।" en="Driving test schedule updated for zonal offices." />
              </p>
            </div>
          </div>
        </li>
      </ul>
    </section>
  );
}

export default NotificationsCard;
