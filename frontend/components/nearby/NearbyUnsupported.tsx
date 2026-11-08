"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";

const SUPPORTED_OFFICE_SERVICES = [
  { slug: "passport-renewal", name: "e-Passport / Passport Renewal" },
  { slug: "nid-correction", name: "National ID (NID) Correction" },
  { slug: "driving-license", name: "Driving License" },
  { slug: "land-mutation", name: "Land Mutation" },
];

/** Fallback shown instead of a hard 404 when slug has no office network. */
export function NearbyUnsupported({ slug }: { slug: string }) {
  return (
    <div className="mx-auto max-w-2xl space-y-5 text-center">
      <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
        <MapPin className="h-6 w-6" aria-hidden="true" />
      </span>
      <div>
        <h2 className="text-lg font-extrabold text-slate-900">No nearby offices for this service</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          “{slug}” has no direct office map support yet. These services do support office lookup:
        </p>
      </div>
      <div className="rounded-2xl border border-line bg-white p-4 text-left shadow-card">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Services with office lookup
        </p>
        <ul className="mt-3 space-y-2">
          {SUPPORTED_OFFICE_SERVICES.map((svc) => (
            <li key={svc.slug}>
              <Link
                href={`/services/${svc.slug}/nearby-offices?district=Dhaka`}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-700"
              >
                {svc.name}
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Link href="/near-me">
          <Button size="sm">Open Near Me map</Button>
        </Link>
        <Link href={`/services/${slug}`}>
          <Button size="sm" variant="outline">
            Back to service
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NearbyUnsupported;
