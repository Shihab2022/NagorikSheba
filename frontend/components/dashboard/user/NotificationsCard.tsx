import { Bell } from "lucide-react";
import { T } from "@/components/ui/T";

export function NotificationsCard() {
  return (
    <section aria-labelledby="dash-notif" className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <h2 id="dash-notif" className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
        <Bell className="h-[18px] w-[18px] text-brand-600" aria-hidden="true" />
        <T bn="বিজ্ঞপ্তি" en="Notifications" />
      </h2>
      <ul className="mt-3 space-y-2.5 text-sm leading-6 text-slate-500">
        <li className="rounded-xl bg-brand-50/70 px-3.5 py-2.5">
          <strong className="font-bold text-slate-800">
            <T bn="কর রিমাইন্ডার:" en="Tax filing reminder:" />
          </strong>{" "}
          <T bn="ই-রিটার্ন সময়সীমা ঘনিয়ে আসছে।" en="e-Return deadline is approaching." />
        </li>
        <li className="rounded-xl bg-canvas px-3.5 py-2.5">
          <T bn="নতুন নোটিশ: BRTA পরীক্ষার সময়সূচি হালনাগাদ।" en="New notice: BRTA test schedule updated." />
        </li>
      </ul>
    </section>
  );
}

export default NotificationsCard;
