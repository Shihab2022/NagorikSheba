"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, FileCheck2 } from "lucide-react";
import type { GovernmentService } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const PREVIEW_SLUGS = ["passport-renewal", "nid-correction", "driving-license", "land-mutation"];

/** Document checklist preview — switch between popular services. */
export function DocumentChecklist({ services = [] }: { services?: GovernmentService[] }) {
  const matchedOptions = PREVIEW_SLUGS
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const options = matchedOptions.length > 0 ? matchedOptions : services.slice(0, 4);
  const [activeSlug, setActiveSlug] = useState(options[0]?.slug ?? "");
  const active = options.find((s) => s.slug === activeSlug) ?? options[0];

  if (!active) return null;

  return (
    <section aria-labelledby="checklist-heading" className="border-y border-line bg-canvas">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <SectionHeading
              id="checklist-heading"
              align="left"
              eyebrow="Document checklist"
              title="Which papers do you need for which service?"
              description="Prepare the right papers before you leave home — no repeated office visits, no surprises."
            />
            <Link
              href="/documents"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-bold text-white transition-all hover:bg-brand-700 hover:shadow-md"
            >
              View Complete Checklist
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-7">
              {/* service switcher */}
              <div
                className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
                role="tablist"
                aria-label="Choose a service"
              >
                {options.map((svc) => (
                  <button
                    key={svc.id}
                    role="tab"
                    type="button"
                    aria-selected={svc.slug === active.slug}
                    onClick={() => setActiveSlug(svc.slug)}
                    className={cn(
                      "shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition-all",
                      svc.slug === active.slug
                        ? "bg-brand-600 text-white shadow-sm"
                        : "border border-line bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700",
                    )}
                  >
                    {svc.name}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-flag-50 text-flag-600">
                  <FileCheck2 className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{active.name}</h3>
                  <p className="text-xs text-slate-500">{active.department}</p>
                </div>
              </div>

              <ul className="mt-5 space-y-2.5">
                {(active.requiredDocuments ?? []).map((doc) => (
                  <li
                    key={doc}
                    className="flex items-start gap-3 rounded-xl border border-line bg-canvas px-4 py-3"
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-brand-500 bg-brand-600 text-white">
                      <Check className="h-3 w-3" strokeWidth={4} aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium leading-5 text-slate-700">{doc}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                <span className="text-xs font-semibold text-slate-400">
                  {active.requiredDocuments?.length ?? 0} documents required
                </span>
                <Link
                  href={`/services/${active.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800"
                >
                  Open service page
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default DocumentChecklist;
