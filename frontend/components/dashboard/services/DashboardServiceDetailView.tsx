"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  FileText,
  Globe,
  Landmark,
  MapPin,
  MonitorSmartphone,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import type { GovernmentService, NoticeItem } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { TrackServiceButton } from "@/components/services/TrackServiceButton";
import { DocumentList } from "@/components/services/DocumentList";
import { ServiceSteps, DetailSection } from "@/components/services/ServiceSteps";
import { ServiceNoticesSection } from "@/components/services/ServiceNoticesSection";
import { FindNearbyOffices } from "@/components/nearby/FindNearbyOffices";
import { getOfficeServiceKey } from "@/lib/nearby";
import ShareButton from "@/components/layout/share-button";
import { useTranslation } from "@/lib/i18n";
import { COMMON } from "@/lib/i18n/common";

interface Props {
  service: GovernmentService;
  notices?: NoticeItem[];
}

const STRINGS = {
  bn: {
    backToServices: "সকল সেবায় ফিরুন",
    onlineService: "অনলাইন সেবা",
    officeService: "অফিস সেবা",
    documents: "প্রয়োজনীয় কাগজপত্র",
    eligibility: "আবেদনের যোগ্যতা",
    steps: "আবেদন প্রক্রিয়া ও ধাপ",
    fees: "সরকারি ফি ও চার্জ",
    officialPortal: "অফিসিয়াল পোর্টাল ও বিভাগ",
    relatedNotices: "সংশ্লিষ্ট সরকারি নোটিশ",
    visitPortal: "অফিসিয়াল পোর্টালে যান",
    lastVerified: "সর্বশেষ যাচাই:",
    authority: "কর্তৃপক্ষ:",
    processingTime: "সময়সীমা:",
    feeTitle: "ফি:",
    noPortal: "এই সেবার জন্য কোনো একক অনলাইন পোর্টাল নেই — সরাসরি দায়িত্বপ্রাপ্ত অফিসে আবেদন করুন।",
    guidanceNote: "নাগরিক সেবা প্ল্যাটফর্ম কেবল সঠিক দিকনির্দেশনা প্রদান করে। আবেদন সরাসরি সংশ্লিষ্ট সরকারি পোর্টালে সম্পন্ন হবে।",
    allCitizens: "সকল যোগ্য বাংলাদেশি নাগরিকের জন্য প্রযোজ্য।",
    feeAmount: "ধার্য ফি",
    taxCalcTitle: "আয়কর হিসাব করুন",
    taxCalcDesc: "আয়কর ক্যালকুলেটর ব্যবহার করে বিনিয়োগ রেয়াত ও স্ল্যাব হিসাব করুন",
  },
  en: {
    backToServices: "Back to All Services",
    onlineService: "Online Service",
    officeService: "Office Visit Required",
    documents: "Required Documents",
    eligibility: "Eligibility Criteria",
    steps: "Step-by-Step Procedure",
    fees: "Fees & Payment",
    officialPortal: "Official Portal & Authority",
    relatedNotices: "Related Official Notices",
    visitPortal: "Visit Official Portal",
    lastVerified: "Last verified:",
    authority: "Authority:",
    processingTime: "Processing time:",
    feeTitle: "Fee:",
    noPortal: "No single online portal for this service — apply at the responsible office in person.",
    guidanceNote: "NagorikSheba provides guidance only. Applications are submitted directly through official government portals.",
    allCitizens: "Open to all eligible citizens.",
    feeAmount: "Official Fee",
    taxCalcTitle: "Calculate Income Tax",
    taxCalcDesc: "Use the tax calculator for tax slab and rebate estimation",
  },
};

export function DashboardServiceDetailView({ service, notices = [] }: Props) {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const c = t(COMMON);

  const docCount = service.documentsCount ?? service.requiredDocuments?.length ?? 0;
  const isTaxRelated = service.category === "tax-finance" || service.slug.includes("tax");
  const officeKey = getOfficeServiceKey(service.slug);

  const anchors = [
    { id: "dash-docs", label: s.documents },
    { id: "dash-elig", label: s.eligibility },
    { id: "dash-steps", label: s.steps },
    { id: "dash-fees", label: s.fees },
    { id: "dash-portal", label: s.officialPortal },
    ...(notices.length > 0 ? [{ id: "notices", label: s.relatedNotices }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Top Back Link */}
      <div>
        <Link
          href="/dashboard/services"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {s.backToServices}
        </Link>
      </div>

      {/* Main Service Hero Card */}
      <div className="rounded-2xl border border-line bg-white p-5 sm:p-7 shadow-card">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 border border-brand-100 shadow-sm">
              <Icon name={service.icon || "FileText"} className="h-7 w-7 sm:h-8 sm:w-8" />
            </span>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={service.isOnline ? "soft-green" : "soft-red"}>
                  {service.isOnline ? (
                    <MonitorSmartphone className="h-3 w-3 shrink-0" />
                  ) : (
                    <MapPin className="h-3 w-3 shrink-0" />
                  )}
                  {service.isOnline ? s.onlineService : s.officeService}
                </Badge>

                {service.categoryName && (
                  <Link
                    href={`/dashboard/services?category=${service.category}`}
                    className="inline-flex items-center text-[11px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 px-2.5 py-0.5 rounded-full transition-colors"
                  >
                    {service.categoryName}
                  </Link>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {service.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 self-stretch md:self-auto sm:w-auto md:w-56">
            <TrackServiceButton slug={service.slug} />

            {service.officialUrl && (
              <a
                href={service.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-line bg-white px-4 text-xs font-bold text-slate-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition-all shadow-sm"
              >
                {s.visitPortal}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Highlight Metrics Bar */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-line/60 pt-5 text-xs">
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <Banknote className="h-3.5 w-3.5 text-brand-600" />
              {s.feeTitle}
            </span>
            <p className="mt-1 text-sm font-extrabold text-slate-900 truncate">
              {service.fee ?? "Free"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              {s.processingTime}
            </span>
            <p className="mt-1 text-sm font-extrabold text-slate-900 truncate">
              {service.processingTime ?? "Varies"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <FileText className="h-3.5 w-3.5 text-indigo-600" />
              {s.documents}
            </span>
            <p className="mt-1 text-sm font-extrabold text-slate-900 truncate">
              {docCount} items
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <Building2 className="h-3.5 w-3.5 text-emerald-600" />
              {s.authority}
            </span>
            <p className="mt-1 text-sm font-extrabold text-slate-900 truncate" title={service.department}>
              {service.department}
            </p>
          </div>
        </div>
      </div>

      {/* Anchor Navigation Pills */}
      <div className="overflow-x-auto no-scrollbar flex items-center gap-2 py-1">
        {anchors.map((anchor) => (
          <a
            key={anchor.id}
            href={`#${anchor.id}`}
            className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50/40 shrink-0 transition-colors shadow-xs"
          >
            {anchor.label}
          </a>
        ))}
      </div>

      {/* Two Column Layout: Main Content (Left) + Utility Sidebar (Right) */}
      <div className="grid gap-6 xl:grid-cols-[1fr_320px] items-start">
        {/* Left Column: Comprehensive Details */}
        <div className="space-y-6 min-w-0">
          {/* Section: Required Documents */}
          <DetailSection
            id="dash-docs"
            title={s.documents}
            icon={<FileCheck2 className="h-4 w-4" />}
          >
            <DocumentList documents={service.requiredDocuments ?? []} />
          </DetailSection>

          {/* Section: Eligibility */}
          <DetailSection
            id="dash-elig"
            title={s.eligibility}
            icon={<UserCheck className="h-4 w-4" />}
          >
            <ul className="space-y-2.5">
              {(service.eligibility ?? []).length > 0 ? (
                service.eligibility!.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 rounded-xl border border-line bg-white px-4 py-3 text-xs sm:text-sm leading-relaxed text-slate-700"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))
              ) : (
                <li className="rounded-xl border border-dashed border-line bg-slate-50 px-4 py-3 text-xs text-slate-500">
                  {s.allCitizens}
                </li>
              )}
            </ul>
          </DetailSection>

          {/* Section: Steps */}
          <DetailSection
            id="dash-steps"
            title={s.steps}
            icon={<MapPin className="h-4 w-4" />}
          >
            <ServiceSteps steps={service.steps ?? []} />
          </DetailSection>

          {/* Section: Fees */}
          <DetailSection
            id="dash-fees"
            title={s.fees}
            icon={<Banknote className="h-4 w-4" />}
          >
            <div className="rounded-2xl border border-line bg-white p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-xs font-semibold text-slate-500">{s.feeAmount}</span>
                <span className="text-base font-extrabold text-brand-700">{service.fee ?? "Free"}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {s.guidanceNote}
              </p>
            </div>
          </DetailSection>

          {/* Section: Official Portal & Source */}
          <DetailSection
            id="dash-portal"
            title={s.officialPortal}
            icon={<Globe className="h-4 w-4" />}
          >
            <div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-5 space-y-3">
              {service.officialUrl ? (
                <>
                  <p className="text-xs text-slate-600">
                    Official Application Portal:
                  </p>
                  <a
                    href={service.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-brand-700 transition-colors shadow-sm"
                  >
                    {service.officialUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </>
              ) : (
                <p className="text-xs text-slate-500">{s.noPortal}</p>
              )}

              {service.lastVerifiedAt && (
                <p className="text-[11px] text-brand-800 font-medium pt-1">
                  {s.lastVerified} {service.lastVerifiedAt}
                </p>
              )}
            </div>
          </DetailSection>

          {/* Section: Related Notices */}
          {notices.length > 0 && (
            <ServiceNoticesSection
              notices={notices}
              categorySlug={service.category}
              categoryName={service.categoryName}
              baseNoticesPath="/dashboard/notices"
            />
          )}
        </div>

        {/* Right Column: Utility Sidebar Cards */}
        <aside className="space-y-5">
          {/* Quick Info Box */}
          <div className="rounded-2xl border border-line bg-white p-5 shadow-card space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Service Overview
            </h3>

            <dl className="space-y-3 text-xs">
              <div className="flex items-start justify-between gap-2 border-b border-line/60 pb-2.5">
                <dt className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-brand-600" />
                  Processing:
                </dt>
                <dd className="font-bold text-slate-800 text-right">
                  {service.processingTime ?? "Varies"}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-2 border-b border-line/60 pb-2.5">
                <dt className="text-slate-500 flex items-center gap-1.5">
                  <Banknote className="h-3.5 w-3.5 text-brand-600" />
                  Govt Fee:
                </dt>
                <dd className="font-bold text-slate-800 text-right">
                  {service.fee ?? "Free"}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-2">
                <dt className="text-slate-500 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-brand-600" />
                  Authority:
                </dt>
                <dd className="font-bold text-slate-800 text-right">
                  {service.department}
                </dd>
              </div>
            </dl>

            <div className="border-t border-line/60 pt-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Share Service:</span>
              <ShareButton
                url={`/dashboard/services/${service.slug}`}
                title={service.name}
                text={service.description}
              />
            </div>
          </div>

          {/* Nearby Government Offices Locator */}
          {officeKey && (
            <div className="rounded-2xl border border-line bg-white p-5 shadow-card space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Government Offices
              </h3>
              <FindNearbyOffices slug={service.slug} basePath="/dashboard/services" />
            </div>
          )}

          {/* Tax Calculator Link (if tax related) */}
          {isTaxRelated && (
            <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-emerald-50/50 p-4 shadow-xs">
              <Link
                href="/dashboard/tax-calculator"
                className="group flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-brand-800 transition-colors">
                    {s.taxCalcTitle}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {s.taxCalcDesc}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-brand-700 transition-transform group-hover:translate-x-1 shrink-0" />
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
