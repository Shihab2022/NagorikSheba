"use client";

import Link from "next/link";
import { ArrowRight, Bell, Calendar, ExternalLink, Globe } from "lucide-react";
import type { NoticeItem } from "@/lib/types";
import { DetailSection } from "./ServiceSteps";

interface ServiceNoticesSectionProps {
  notices: NoticeItem[];
  categorySlug: string;
  categoryName?: string;
}

export function ServiceNoticesSection({
  notices,
  categorySlug,
  categoryName,
}: ServiceNoticesSectionProps) {
  if (!notices || notices.length === 0) {
    return null;
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime())
        ? null
        : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return null;
    }
  }

  function getHostname(urlStr: string) {
    try {
      return new URL(urlStr).hostname;
    } catch {
      return "Official Portal";
    }
  }

  return (
    <DetailSection
      id="notices"
      title="Latest Official Notices"
      icon={<Bell className="h-4 w-4 text-brand-600" />}
    >
      <div className="space-y-3">
        {notices.map((notice) => {
          const date = formatDate(notice.publishedAt);
          const hostname = getHostname(notice.url);

          return (
            <article
              key={notice.id}
              className="group rounded-xl border border-line bg-white p-4 shadow-sm transition-all hover:border-brand-200 hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                      {notice.sourceName || "Government Portal"}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Globe className="h-3 w-3 text-slate-400" />
                      {hostname}
                    </span>
                    {date && (
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {date}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                    <a
                      href={notice.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="line-clamp-2 focus:outline-none focus:underline"
                    >
                      {notice.title}
                    </a>
                  </h4>
                </div>

                <div className="shrink-0 pt-1 sm:pt-0">
                  <a
                    href={notice.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"
                  >
                    View Notice
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </article>
          );
        })}

        <div className="pt-2 text-right">
          <Link
            href={`/notices/${categorySlug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"
          >
            View all {categoryName || ""} notices
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </DetailSection>
  );
}
