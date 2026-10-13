"use client";
import Link from "next/link";
import { ArrowLeft, Building2, CalendarDays, Clock } from "lucide-react";
import { formatNoticeDate, getNoticeById, publishedLabel } from "@/lib/data/notices";
import { Badge } from "@/components/ui/Badge";
import { useTranslation, type Lang } from "@/lib/i18n";
const CAT: Record<string, { bn: string; en: string }> = {
  nid: { bn: "NID", en: "NID" }, passport: { bn: "পাসপোর্ট", en: "Passport" },
  tax: { bn: "কর", en: "Tax" }, education: { bn: "শিক্ষা", en: "Education" },
  land: { bn: "ভূমি", en: "Land" }, transport: { bn: "পরিবহন", en: "Transport" },
  health: { bn: "স্বাস্থ্য", en: "Health" },
};
const STR = {
  bn: { all: "সব নোটিশ", notice: "নোটিশ", published: "প্রকাশিত", dept: "দপ্তর", reading: "পড়ার সময়", minRead: "মিনিট পড়া" },
  en: { all: "All notices", notice: "Notice", published: "Published", dept: "Department", reading: "Reading time", minRead: "min read" },
};
export function NoticeHeader({ id }: { id: string }) {
  const { lang, t } = useTranslation();
  const s = t(STR);
  const notice = getNoticeById(id);
  if (!notice) return null;
  const cat = CAT[notice.category] ?? { bn: notice.category, en: notice.category };
  return (
    <div className="border-b border-line bg-canvas">
      <div className="relative mx-auto w-full max-w-4xl overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="pattern-grid absolute inset-0" aria-hidden="true" />
        <div className="relative">
          <Link href="/notices" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />{s.all}
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge tone="soft-red">{s.notice}</Badge>
            <Badge tone="outline">{lang === "bn" ? cat.bn : cat.en}</Badge>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{notice.title}</h1>
          <dl className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
            <div className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" aria-hidden="true" /><dt className="sr-only">{s.published}</dt><dd><time dateTime={notice.publishedAt}>{formatNoticeDate(notice.publishedAt, lang as Lang)}</time> · {publishedLabel(notice.publishedAt, lang as Lang)}</dd></div>
            <div className="flex items-center gap-1.5"><Building2 className="h-4 w-4" aria-hidden="true" /><dt className="sr-only">{s.dept}</dt><dd>{notice.department}</dd></div>
            <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden="true" /><dt className="sr-only">{s.reading}</dt><dd>{notice.readMinutes} {s.minRead}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}
