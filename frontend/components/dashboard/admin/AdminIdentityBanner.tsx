import Link from "next/link";
import { Shield, Users, ExternalLink } from "lucide-react";
import { T } from "@/components/ui/T";

export interface AdminIdentityBannerProps {
  admin: {
    name?: string;
    email?: string;
    role?: string;
  };
}

export function AdminIdentityBanner({ admin }: AdminIdentityBannerProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-line bg-gradient-to-r from-brand-900 to-brand-800 p-6 text-white shadow-card sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-brand-100 ring-1 ring-white/20">
          <Shield className="h-7 w-7 text-flag-400" aria-hidden="true" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold sm:text-2xl">{admin.name}</h1>
            <span className="rounded-full bg-flag-500/20 px-2.5 py-0.5 text-xs font-bold tracking-wider text-flag-300 ring-1 ring-flag-400/30">
              {admin.role}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-brand-100/80">{admin.email}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-white/20"
        >
          <Users className="h-3.5 w-3.5" />
          <T bn="নাগরিক ড্যাশবোর্ড" en="Citizen Dashboard" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-brand-900 shadow-sm transition-colors hover:bg-brand-50"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <T bn="সাইট দেখুন" en="View Site" />
        </Link>
      </div>
    </div>
  );
}

export default AdminIdentityBanner;
