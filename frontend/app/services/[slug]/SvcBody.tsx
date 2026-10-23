"use client";
import Link from "next/link";
import { ExternalLink, Globe, MapPin } from "lucide-react";
import { getServiceBySlug } from "@/lib/data/services";
import { ServiceSidebar } from "@/components/services/ServiceSidebar";
import { TrackServiceButton } from "@/components/services/TrackServiceButton";
import { DetailSection } from "@/components/services/ServiceSteps";
import { DemoNote } from "@/components/ui/States";
import { useTranslation } from "@/lib/i18n";
import { SVC_STR } from "./SvcStrings";
import { SvcMain } from "./SvcMain";
export function SvcBody({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const s = t(SVC_STR);
  const service = getServiceBySlug(slug);
  if (!service) return null;
  const anchors = [
    { id: "documents", label: s.docs },
    { id: "eligibility", label: s.elig },
    { id: "steps", label: s.steps },
    { id: "fees", label: s.fee },
    { id: "official", label: s.official },
  ];
  return (
    <>
      <div className="mx-auto w-full max-w-7xl scroll-mt-28 px-4 pt-6 sm:px-6 lg:px-8">
        <nav aria-label="On this page" className="flex flex-wrap gap-2">
          {anchors.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:border-brand-300 hover:text-brand-700"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 lg:hidden">
          <ServiceSidebar service={service} />
        </div>
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="mb-6"><TrackServiceButton slug={slug} /></div>
            <SvcMain slug={slug} />
            <div className="mt-10">
              <DetailSection
                id="official"
                title={s.official}
                icon={<Globe className="h-4 w-4" />}
              >
                {service.officialUrl ? (
                  <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
                    <DemoNote className="mb-2" />
                    <a
                      href={service.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
                    >
                      {service.officialUrl
                        .replace(/^https?:\/\//, "")
                        .replace(/\/$/, "")}
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                    {service.lastVerifiedAt ? (
                      <p className="mt-3 text-xs text-brand-700">
                        {s.lastV} {service.lastVerifiedAt}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="rounded-xl border border-dashed border-line bg-canvas px-4 py-4 text-sm text-slate-500">
                    {s.noPortal}
                  </p>
                )}
              </DetailSection>
            </div>
          </div>
          <div className="hidden lg:block">
            <ServiceSidebar service={service} />
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 z-40 border-t border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-500">
              {service.processingTime ?? s.varies} · {service.fee ?? s.applies}
            </p>
          </div>
          {service.officialUrl ? (
            <a
              href={service.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-bold text-white"
            >
              {s.visit}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : (
            <Link
              href="/government-offices"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-bold text-white"
            >
              {s.find}
              <MapPin className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
