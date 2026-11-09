import Link from "next/link";
import { ArrowRight, Bookmark } from "lucide-react";
import { ServiceCard } from "@/components/services/ServiceCard";
import { T } from "@/components/ui/T";
import type { GovernmentService } from "@/lib/types";

export interface SavedServicesCardProps {
  services: GovernmentService[];
}

export function SavedServicesCard({ services }: SavedServicesCardProps) {
  return (
    <section aria-labelledby="dash-saved" className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Bookmark className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="dash-saved" className="text-base font-black text-slate-900">
              <T bn="সংরক্ষিত সেবা" en="Saved Services" />
            </h2>
            <p className="text-xs text-slate-400">
              <T bn="আপনার পছন্দের সেবাসমূহ" en="Quick access to bookmarked services" />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-black text-slate-600">
            {services.length}
          </span>
          <Link
            href="/dashboard/services"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800 transition-colors"
          >
            <T bn="সব দেখুন" en="Browse all" />
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} basePath="/dashboard/services" />
        ))}
      </div>
    </section>
  );
}

export default SavedServicesCard;
