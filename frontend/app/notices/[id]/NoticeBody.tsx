"use client";
import { ExternalLink } from "lucide-react";
import { NOTICES, getNoticeById } from "@/lib/data/notices";
import { NoticeCard } from "@/components/notices/NoticeCard";
import { DemoNote } from "@/components/ui/States";
import { useTranslation } from "@/lib/i18n";
const STR = {
  bn: { verify: "অফিসিয়াল উৎসে যাচাই করুন", related: "সম্পর্কিত নোটিশ" },
  en: { verify: "Verify on Official Source", related: "Related notices" },
};
export function NoticeBody({ id }: { id: string }) {
  const { t } = useTranslation();
  const s = t(STR);
  const notice = getNoticeById(id);
  if (!notice) return null;
  const related = NOTICES.filter((n) => n.id !== notice.id && n.category === notice.category).slice(0, 3);
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-6"><DemoNote /></div>
      <article className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
        <p className="border-l-4 border-brand-500 bg-brand-50/60 px-4 py-3 text-base leading-7 font-medium text-slate-700">{notice.summary}</p>
        <div className="mt-6 space-y-4 text-[15px] leading-7 text-slate-600">
          {notice.body.map((paragraph, i) => (<p key={i}>{paragraph}</p>))}
        </div>
        {notice.officialUrl ? (
          <a href={notice.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-bold text-white hover:bg-brand-700">
            {s.verify}<ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : null}
      </article>
      {related.length > 0 ? (
        <section aria-labelledby="related-notices" className="mt-10">
          <h2 id="related-notices" className="text-lg font-extrabold text-slate-900">{s.related}</h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {related.map((n) => (<NoticeCard key={n.id} notice={n} />))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
