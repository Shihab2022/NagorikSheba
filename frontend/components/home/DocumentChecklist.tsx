"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, FileCheck2 } from "lucide-react";
import { SERVICES } from "@/lib/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

const PREVIEW_SLUGS = ["passport-renewal", "nid-correction", "driving-license", "land-mutation"];

const STRINGS = {
  bn: {
    eyebrow: "ডকুমেন্ট চেকলিস্ট",
    title: "কোন সেবার জন্য কী কী কাগজ লাগবে?",
    description:
      "বাড়ি থেকে বের হওয়ার আগে সঠিক কাগজপত্র প্রস্তুত করুন — বারবার অফিস যেতে হবে না, কোনো অপ্রত্যাশিত বিষয় নেই।",
    viewCompleteChecklist: "সম্পূর্ণ চেকলিস্ট দেখুন",
    chooseService: "একটি সেবা বেছে নিন",
    documentsRequired: "{n} টি ডকুমেন্ট প্রয়োজন",
    openServicePage: "সেবার পাতা খুলুন",
  },
  en: {
    eyebrow: "Document checklist",
    title: "Which papers do you need for which service?",
    description:
      "Prepare the right papers before you leave home — no repeated office visits, no surprises.",
    viewCompleteChecklist: "View Complete Checklist",
    chooseService: "Choose a service",
    documentsRequired: "{n} documents required",
    openServicePage: "Open service page",
  },
};

/** Document checklist preview — switch between popular services. */
export function DocumentChecklist() {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const options = PREVIEW_SLUGS
    .map((slug) => SERVICES.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
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
              eyebrow={s.eyebrow}
              title={s.title}
              description={s.description}
            />
            <Link
              href="/documents"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-bold text-white transition-all hover:bg-brand-700 hover:shadow-md"
            >
              {s.viewCompleteChecklist}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-7">
              {/* service switcher */}
              <div
                className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
                role="tablist"
                aria-label={s.chooseService}
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
                  {s.documentsRequired.replace(
                    "{n}",
                    String(active.requiredDocuments?.length ?? 0),
                  )}
                </span>
                <Link
                  href={`/services/${active.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800"
                >
                  {s.openServicePage}
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
