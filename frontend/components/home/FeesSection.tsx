"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Coins } from "lucide-react";
import type { GovernmentService } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const FEE_ITEMS = [
  {
    slug: "epassport-new",
    label: "Passport",
    note: "Starting from",
  },
  {
    slug: "driving-license",
    label: "Driving License",
    note: "One category",
  },
  {
    slug: "land-mutation",
    label: "Land Mutation",
    note: "Based on land value",
  },
  {
    slug: "birth-registration",
    label: "Birth Registration",
    note: "Within 60 days",
  },
];

/** Government fee examples with the mandatory verification disclaimer. */
export function FeesSection({ services = [] }: { services?: GovernmentService[] }) {
  const items = FEE_ITEMS.map((item) => ({
    ...item,
    service: services.find((s) => s.slug === item.slug),
  })).filter((item): item is typeof item & { service: GovernmentService } => Boolean(item.service));

  const displayItems =
    items.length > 0
      ? items
      : services
          .filter((s) => Boolean(s.fee))
          .slice(0, 4)
          .map((s) => ({
            slug: s.slug,
            label: s.name,
            note: s.department,
            service: s,
          }));

  if (displayItems.length === 0) return null;

  return (
    <section aria-labelledby="fees-heading" className="bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading
            id="fees-heading"
            eyebrow="Fee guide"
            title="Know About Government Fees"
            description="Indicative government fees for popular services — always confirm before paying."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {displayItems.map((item, i) => (
            <Reveal key={item.slug} delay={i * 70} className="h-full">
              <Link
                href={`/services/${item.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-transform group-hover:-translate-y-1">
                    <Icon name={item.service!.icon} className="h-5 w-5" />
                  </span>
                  <Coins className="h-5 w-5 text-flag-500 transition-transform group-hover:scale-110" aria-hidden="true" />
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {item.label}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-400">{item.note}</p>
                <p className="mt-2 text-lg font-extrabold leading-6 text-slate-900 group-hover:text-brand-700">
                  {item.service!.fee}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
                  View Details
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-flag-200 bg-flag-50 p-5">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-flag-500 text-white">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="text-sm leading-6 text-flag-800">
              <strong className="font-bold">Fees may change.</strong> Always verify the latest fee from the official government source.{" "}
              <Link
                href="/fees"
                className="font-bold underline decoration-flag-400 underline-offset-2 hover:text-flag-900"
              >
                See the full fee guide →
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default FeesSection;
