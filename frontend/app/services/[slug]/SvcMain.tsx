"use client";
import { ChevronDown, Coins, FileCheck2 } from "lucide-react";
import { HelpCircle, MapPin, UserCheck } from "lucide-react";
import { getServiceBySlug } from "@/lib/data/services";
import {
  ServiceSteps,
  DetailSection,
} from "@/components/services/ServiceSteps";
import { DocumentList } from "@/components/services/DocumentList";
import { useTranslation } from "@/lib/i18n";
import { SVC_FAQ, SVC_STR } from "./SvcStrings";
export function SvcMain({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const s = t(SVC_STR);
  const faq = t(SVC_FAQ);
  const service = getServiceBySlug(slug);
  if (!service) return null;
  return (
    <div className="min-w-0 space-y-10">
      <DetailSection
        id="documents"
        title={s.docs}
        icon={<FileCheck2 className="h-4 w-4" />}
      >
        <DocumentList documents={service.requiredDocuments ?? []} />
      </DetailSection>
      <DetailSection
        id="eligibility"
        title={s.elig}
        icon={<UserCheck className="h-4 w-4" />}
      >
        <ul className="space-y-2.5">
          {(service.eligibility ?? []).map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 rounded-xl border border-line bg-white px-4 py-3 text-sm leading-6 text-slate-600"
            >
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </DetailSection>
      <DetailSection
        id="steps"
        title={s.steps}
        icon={<MapPin className="h-4 w-4" />}
      >
        <ServiceSteps steps={service.steps ?? []} />
      </DetailSection>
      <DetailSection
        id="fees"
        title={s.fee}
        icon={<Coins className="h-4 w-4" />}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-canvas px-4 py-3.5">
            <p className="text-xs font-bold uppercase text-slate-500">
              {s.fee}
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              {service.fee ?? s.applies}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-canvas px-4 py-3.5">
            <p className="text-xs font-bold uppercase text-slate-500">
              {s.steps}
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              {service.processingTime ?? s.varies}
            </p>
          </div>
        </div>
      </DetailSection>
      <DetailSection
        id="faq"
        title={s.faq}
        icon={<HelpCircle className="h-4 w-4" />}
      >
        <div className="space-y-2.5">
          {faq.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-line bg-white px-4 py-3.5 open:border-brand-200 open:bg-brand-50/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-slate-800 [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-slate-400 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-2.5 text-sm leading-6 text-slate-600">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </DetailSection>
    </div>
  );
}
