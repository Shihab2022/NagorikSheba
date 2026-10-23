import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { T } from "@/components/ui/T";
import type { GovernmentService } from "@/lib/types";

export interface AdminRecentServicesProps {
  services: GovernmentService[];
}

export function AdminRecentServices({ services }: AdminRecentServicesProps) {
  return (
    <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <h2 className="text-base font-extrabold text-slate-900">
          <T bn="সাম্প্রতিক যাচাইকৃত সেবা" en="Recently Verified Services" />
        </h2>
        <Link
          href="/services"
          className="text-xs font-bold text-brand-700 hover:text-brand-800"
        >
          <T bn="সব সেবা দেখুন →" en="View all services →" />
        </Link>
      </div>
      <ul className="mt-4 divide-y divide-line">
        {services.map((s) => (
          <li key={s.id} className="flex items-center justify-between py-3">
            <div className="min-w-0 pr-4">
              <p className="truncate text-sm font-bold text-slate-900">{s.name}</p>
              <p className="text-xs text-slate-500">{s.department}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="hidden rounded-md bg-canvas px-2 py-1 text-[11px] font-semibold text-slate-600 sm:inline-block">
                {s.fee}
              </span>
              <Link
                href={`/services/${s.slug}`}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-canvas hover:text-brand-700"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AdminRecentServices;
