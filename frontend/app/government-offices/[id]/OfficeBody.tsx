"use client";
import Link from "next/link";
import { ArrowRight, Building2, Clock, ExternalLink, MapPin, Phone } from "lucide-react";
import { getOfficeById } from "@/lib/data/offices";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { DemoNote } from "@/components/ui/States";
import { useTranslation } from "@/lib/i18n";
const STR = {
  bn: { home: "হোম", offices: "সরকারি অফিস", info: "অফিসের তথ্য", services: "উপলব্ধ সেবা", official: "অফিসিয়াল ওয়েবসাইট", related: "সম্পর্কিত সেবা", mapSoon: "ম্যাপ শীঘ্রই আসছে", mapNote: "ভবিষ্যৎ ম্যাপ ভিউয়ের জন্য স্থানাঙ্ক সংরক্ষিত আছে।" },
  en: { home: "Home", offices: "Government Offices", info: "Office Information", services: "Services Available", official: "Visit Official Website", related: "Find related services", mapSoon: "Map integration coming soon", mapNote: "Coordinates are stored in the data model for a future map view." },
};
export function OfficeBody({ id }: { id: string }) {
  const { t } = useTranslation();
  const s = t(STR);
  const office = getOfficeById(id);
  if (!office) return null;
  return (
    <>
      <header className="relative overflow-hidden border-b border-line bg-canvas">
        <div className="pattern-grid absolute inset-0" aria-hidden="true" />
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-100/70 blur-2xl" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
              <li><Link href="/" className="hover:text-brand-700">{s.home}</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/government-offices" className="hover:text-brand-700">{s.offices}</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-slate-700">{office.typeLabel}</li>
            </ol>
          </nav>
          <div className="mt-5 flex items-start gap-4 sm:gap-5">
            <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-card"><Icon name={office.icon} className="h-7 w-7" /></span>
            <div>
              <Badge tone="soft-green">{office.typeLabel}</Badge>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{office.name}</h1>
              <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-600"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-flag-500" aria-hidden="true" />{office.address}</p>
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6"><DemoNote /></div>
        <div className="grid gap-6 sm:grid-cols-2">
          <section aria-labelledby="office-info" className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
            <h2 id="office-info" className="text-base font-extrabold text-slate-900">{s.info}</h2>
            <dl className="mt-4 space-y-3.5 text-sm">
              <div className="flex items-start gap-2.5"><Building2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" /><div><dd className="text-slate-600">{office.address}</dd></div></div>
              <div className="flex items-start gap-2.5"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" /><div><dd className="text-slate-600">{office.openingHours}</dd></div></div>
              <div className="flex items-start gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" /><div><dd className="text-slate-600">{office.contact}</dd></div></div>
            </dl>
            {office.officialUrl ? (
              <a href={office.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-bold text-white hover:bg-brand-700">{s.official}<ExternalLink className="h-4 w-4" aria-hidden="true" /></a>
            ) : null}
          </section>
          <section aria-labelledby="office-services" className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
            <h2 id="office-services" className="text-base font-extrabold text-slate-900">{s.services}</h2>
            <ul className="mt-4 space-y-2.5">
              {office.services.map((sv) => (
                <li key={sv} className="flex items-center gap-2.5 rounded-xl border border-line bg-canvas px-4 py-3 text-sm font-medium text-slate-700"><span className="h-1.5 w-1.5 rounded-full bg-flag-500" aria-hidden="true" />{sv}</li>
              ))}
            </ul>
            <Link href="/services" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800">{s.related}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </section>
        </div>
        <div className="relative mt-6 overflow-hidden rounded-2xl border border-line bg-brand-50/50 p-8 text-center">
          <div className="pattern-grid absolute inset-0" aria-hidden="true" />
          <div className="relative">
            <MapPin className="mx-auto h-8 w-8 text-brand-600" aria-hidden="true" />
            <p className="mt-3 text-sm font-bold text-slate-800">{s.mapSoon}</p>
            <p className="mt-1 text-xs text-slate-500">{s.mapNote}</p>
          </div>
        </div>
      </div>
    </>
  );
}
