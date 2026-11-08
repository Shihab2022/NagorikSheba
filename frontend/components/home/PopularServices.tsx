"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { GovernmentService } from "@/lib/types";
import { ServiceCard } from "@/components/services/ServiceCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CustomLoader } from "@/components/ui/CustomLoader";
import { Skeleton } from "@/components/ui/States";

/** Popular government services — receives live backend services. */
export function PopularServices({
  services = [],
  loading = false,
}: {
  services?: GovernmentService[];
  loading?: boolean;
}) {
  return (
    <section aria-labelledby="popular-heading" className="border-y border-line bg-canvas">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading
            id="popular-heading"
            eyebrow="Popular services"
            title="Popular Government Services"
            description="The services citizens look up most often — with documents, fees and official links."
          />
        </Reveal>

        {loading ? (
          <div className="mt-8 space-y-8">
            <CustomLoader
              size="md"
              message="Loading popular services..."
              subMessage="Preparing verified services and requirement details"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-card space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-24 rounded-full" />
                      <Skeleton className="h-5 w-4/5" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                  <div className="mt-4 border-t border-line pt-4 flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : services.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-line bg-white p-12 text-center">
            <p className="text-sm font-medium text-slate-500">
              No government services currently found.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={(i % 3) * 70} className="h-full">
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        )}

        <Reveal>
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md"
            >
              View all services
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default PopularServices;
