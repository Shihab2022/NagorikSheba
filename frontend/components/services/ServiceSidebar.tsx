"use client";

import {
  BadgeCheck,
  Clock,
  ExternalLink,
  Landmark,
  MonitorSmartphone,
} from "lucide-react";

import type { GovernmentService } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { FindNearbyOffices } from "@/components/nearby/FindNearbyOffices";
import { getOfficeServiceKey } from "@/lib/nearby";
import { useTranslation } from "@/lib/i18n";
import ShareButton from "@/components/layout/share-button";

const STRINGS = {
  bn: {
    ariaLabel: "সেবার তথ্য",
    title: "সেবার তথ্য",
    onlineAvailable: "অনলাইনে পাওয়া যায়",
    officeVisit: "অফিসে যেতে হবে",
    governmentService: "সরকারি সেবা",
    processing: "প্রক্রিয়াকরণ",
    varies: "বিভিন্ন",
    fee: "ফি",
    basedOnService: "সেবানির্ভর",
    visitOfficialWebsite: "অফিসিয়াল ওয়েবসাইট দেখুন",
    noPortal:
      "এই সেবার জন্য কোনো একক অনলাইন পোর্টাল নেই — দায়িত্বপ্রাপ্ত অফিসে ব্যক্তিগতভাবে আবেদন করুন।",
    officialSource: "অফিসিয়াল উৎস:",
    lastVerified: "সর্বশেষ যাচাই:",
    guidanceOnly:
      "নাগরিক সেবা কেবল নির্দেশনা প্রদান করে। আবেদন জমা দেওয়া হয় সরকারি সিস্টেমের মাধ্যমে।",
  },
  en: {
    ariaLabel: "Service information",
    title: "Service Information",
    onlineAvailable: "Online Available",
    officeVisit: "Office Visit",
    governmentService: "Government Service",
    processing: "Processing",
    varies: "Varies",
    fee: "Fee",
    basedOnService: "Based on service",
    visitOfficialWebsite: "Visit Official Website",
    noPortal:
      "No single online portal for this service — apply at the responsible office in person.",
    officialSource: "Official Source:",
    lastVerified: "Last Verified:",
    guidanceOnly:
      "NagorikSheba provides guidance only. Applications are submitted through official government systems.",
  },
};

/**
 * Sticky Service Information card for the service detail page.
 * Includes service information and social sharing actions.
 */
export function ServiceSidebar({
  service,
}: {
  service: GovernmentService;
}) {
  const { t } = useTranslation();
  const s = t(STRINGS);

  const serviceUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/services/${service.slug}`
      : `/services/${service.slug}`;

  return (
    <aside
      aria-label={s.ariaLabel}
      className="lg:sticky lg:top-28"
    >
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <div className="border-b border-line bg-brand-50 px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-brand-800">
            <BadgeCheck
              className="h-4 w-4"
              aria-hidden="true"
            />
            {s.title}
          </h2>
        </div>

        <div className="space-y-3 p-5">
          <div className="flex flex-wrap gap-2">
            <Badge tone={service.isOnline ? "soft-green" : "soft-red"}>
              <MonitorSmartphone
                className="h-3 w-3"
                aria-hidden="true"
              />
              {service.isOnline
                ? s.onlineAvailable
                : s.officeVisit}
            </Badge>

            <Badge tone="slate">
              {s.governmentService}
            </Badge>
          </div>

          <dl className="space-y-3 border-t border-line pt-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <dt className="flex items-center gap-1.5 text-slate-500">
                <Clock
                  className="h-4 w-4 text-brand-600"
                  aria-hidden="true"
                />
                {s.processing}
              </dt>

              <dd className="text-right font-bold text-slate-900">
                {service.processingTime ?? s.varies}
              </dd>
            </div>

            <div className="flex items-start justify-between gap-3">
              <dt className="flex items-center gap-1.5 text-slate-500">
                <Landmark
                  className="h-4 w-4 text-brand-600"
                  aria-hidden="true"
                />
                {s.fee}
              </dt>

              <dd className="max-w-[60%] text-right font-bold text-slate-900">
                {service.fee ?? s.basedOnService}
              </dd>
            </div>
          </dl>

          {service.officialUrl ? (
            <a
              href={service.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white transition-all hover:bg-brand-700 hover:shadow-md"
            >
              {s.visitOfficialWebsite}

              <ExternalLink
                className="h-4 w-4"
                aria-hidden="true"
              />
            </a>
          ) : (
            <p className="rounded-xl border border-dashed border-line bg-canvas px-4 py-3 text-xs leading-5 text-slate-500">
              {s.noPortal}
            </p>
          )}

          {/* Social sharing */}
          <div className="flex flex-wrap items-center gap-2">
            <ShareButton
              url={serviceUrl}
              title={service.name}
              text={service.description}
            />
          </div>

          {/* Official source and verification date */}
          <div className="rounded-xl bg-canvas px-4 py-3 text-xs leading-5 text-slate-500">
            <p>
              <strong className="font-semibold text-slate-700">
                {s.officialSource}
              </strong>{" "}
              {service.authority}
            </p>

            {service.lastVerifiedAt ? (
              <p className="mt-1">
                <strong className="font-semibold text-slate-700">
                  {s.lastVerified}
                </strong>{" "}
                {service.lastVerifiedAt}
              </p>
            ) : null}
          </div>

          {/* Nearby government offices */}
          {getOfficeServiceKey(service.slug) ? (
            <FindNearbyOffices slug={service.slug} />
          ) : null}

          <p className="text-[11px] leading-4 text-slate-400">
            {s.guidanceOnly}
          </p>
        </div>
      </div>
    </aside>
  );
}

export default ServiceSidebar;
