"use client";

import { ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";
import type { GovernmentNotice } from "@/lib/types";
import { formatNoticeDate, publishedLabel } from "@/lib/data/notices";
import { useTranslation } from "@/lib/i18n";

const STRINGS = {
  bn: {
    notice: "নোটিশ",
    minRead: "{n} মিনিট পড়া",
    readMore: "আরও পড়ুন",
    readNotice: "নোটিশ পড়ুন: {title}",
  },
  en: {
    notice: "NOTICE",
    minRead: "{n} min read",
    readMore: "Read More",
    readNotice: "Read notice: {title}",
  },
};

/** Notice teaser card for the directory listing. */
export function NoticeCard({ notice }: { notice: GovernmentNotice }) {
  const { lang, t } = useTranslation();
  const s = t(STRINGS);
  return (
    <article className="group relative flex flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover sm:p-6">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-flag-50 px-2.5 py-1 text-[11px] font-extrabold tracking-widest text-flag-600 uppercase">
        {s.notice}
      </span>
      <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-brand-700">
        <Link href={`/notices/${notice.id}`} className="transition-colors">
          {notice.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{notice.summary}</p>
      <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-400">
        <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
        {notice.department}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <span className="text-xs font-medium text-slate-400">
          {publishedLabel(notice.publishedAt, lang)} ·{" "}
          {s.minRead.replace("{n}", String(notice.readMinutes))} ·{" "}
          <time dateTime={notice.publishedAt}>
            {formatNoticeDate(notice.publishedAt, lang)}
          </time>
        </span>
        <Link
          href={`/notices/${notice.id}`}
          className="inline-flex items-center gap-1 text-sm font-bold text-brand-700 transition-colors hover:text-brand-800"
          aria-label={s.readNotice.replace("{title}", notice.title)}
        >
          {s.readMore}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default NoticeCard;
