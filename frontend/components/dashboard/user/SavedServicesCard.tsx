import Link from "next/link";
import { Bookmark } from "lucide-react";
import { ServiceCard } from "@/components/services/ServiceCard";
import { T } from "@/components/ui/T";
import type { GovernmentService } from "@/lib/types";

export interface SavedServicesCardProps {
  services: GovernmentService[];
}

export function SavedServicesCard({ services }: SavedServicesCardProps) {
  return (
    <section aria-labelledby="dash-saved">
      <div className="flex items-center justify-between">
        <h2
          id="dash-saved"
          className="flex items-center gap-2 text-lg font-extrabold text-slate-900"
        >
          <Bookmark className="h-5 w-5 text-brand-600" aria-hidden="true" />
          <T bn="সংরক্ষিত সেবা" en="Saved Services" />
        </h2>
        <Link
          href="/services"
          className="text-sm font-bold text-brand-700 hover:text-brand-800"
        >
          <T bn="সব দেখুন" en="Browse all" />
        </Link>
      </div>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>
    </section>
  );
}

export default SavedServicesCard;
