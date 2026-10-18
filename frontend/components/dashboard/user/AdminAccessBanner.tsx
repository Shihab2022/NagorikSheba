import Link from "next/link";
import { Shield } from "lucide-react";
import { T } from "@/components/ui/T";

export function AdminAccessBanner() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white">
          <Shield className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold text-brand-900">
            <T
              bn="আপনি অ্যাডমিনিস্ট্রেটর হিসেবে লগইন আছেন"
              en="You are signed in as an Administrator"
            />
          </p>
          <p className="text-xs text-brand-700">
            <T
              bn="সেবা ও সিস্টেম পরিচালনার জন্য অ্যাডমিন ড্যাশবোর্ডে যান।"
              en="Access system controls and service management in the Admin Dashboard."
            />
          </p>
        </div>
      </div>
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-700 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-800"
      >
        <T bn="অ্যাডমিন ড্যাশবোর্ড" en="Admin Dashboard" />
      </Link>
    </div>
  );
}

export default AdminAccessBanner;
