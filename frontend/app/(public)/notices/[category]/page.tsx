import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Calendar, Building, Globe, Bell } from "lucide-react";
import { getCategoryNotices } from "@/service/notices";
import { getAllCategories } from "@/service/category";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export const revalidate = 600;

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ page?: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { category: slug } = await props.params;
  const res = await getCategoryNotices(slug, 1, 1);
  if (!res.success || !res.data) {
    return { title: "Category Notices" };
  }
  return {
    title: `${res.data.category.name} - Official Notices | NagorikSheba`,
    description: `Browse latest official government notices and announcements for ${res.data.category.name}.`,
  };
}

function getHostname(urlStr: string): string {
  try {
    return new URL(urlStr).hostname;
  } catch {
    return "Official Portal";
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Recent";
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? "Recent"
      : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "Recent";
  }
}

export default async function CategoryNoticesPage(props: PageProps) {
  const { category: slug } = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : {};
  const currentPage = Math.max(1, Number(searchParams?.page) || 1);

  // Parallel fetch: category notices + all categories for filter chips
  const [noticesRes, categoriesRes] = await Promise.all([
    getCategoryNotices(slug, currentPage, 20),
    getAllCategories().catch(() => ({ success: false, data: [] })),
  ]);

  if (!noticesRes.success || !noticesRes.data) {
    notFound();
  }

  const { category, items, total, totalPages, page } = noticesRes.data;
  const allCategories = categoriesRes.data || [];

  return (
    <div className="min-h-screen bg-canvas/30 pb-16">
      {/* Category Hero / Header */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mb-4">
            <Link
              href="/notices"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-700 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Notices
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 border border-brand-100">
                <Icon name={category.icon || "Folder"} className="h-7 w-7" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {category.name} Notices
                </h1>
                <p className="mt-1 text-sm text-slate-500 max-w-2xl line-clamp-2">
                  {category.description || "Official government notices, advisories, and gazettes."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold text-slate-700 border border-slate-200">
                <Bell className="h-3.5 w-3.5 text-brand-600" />
                {total} {total === 1 ? "Notice" : "Notices"}
              </span>
            </div>
          </div>

          {/* Dynamic Category Filter Chips */}
          {allCategories.length > 0 && (
            <div className="mt-8 pt-4 border-t border-line/60 overflow-x-auto no-scrollbar flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 shrink-0 uppercase tracking-wider mr-1">
                Category:
              </span>
              {allCategories.map((cat) => {
                const isActive = cat.slug === slug;
                const count = cat.noticeCount ?? cat.notice_count ?? 0;
                return (
                  <Link
                    key={cat.id}
                    href={`/notices/${cat.slug}`}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold shrink-0 transition-all border",
                      isActive
                        ? "bg-brand-700 text-white border-brand-700 shadow-sm"
                        : "bg-white text-slate-600 border-line hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50/50"
                    )}
                  >
                    <span>{cat.name}</span>
                    {count > 0 && (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-500"
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Notices Content */}
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-line bg-white p-12 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Bell className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-800">No notices published yet</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
              There are currently no active public announcements scraped or added for this category.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((notice, idx) => {
              const hostname = getHostname(notice.url);
              return (
                <Reveal key={notice.id} delay={(idx % 6) * 40}>
                  <article className="group relative rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-200 hover:border-brand-200 hover:shadow-lift">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-100">
                            <Building className="h-3 w-3" />
                            {notice.sourceName || "Government Portal"}
                          </span>

                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-100">
                            <Globe className="h-3 w-3 text-slate-400" />
                            Source: {hostname}
                          </span>

                          {notice.publishedAt && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                              <Calendar className="h-3 w-3 text-slate-400" />
                              {formatDate(notice.publishedAt)}
                            </span>
                          )}
                        </div>

                        <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                          <a
                            href={notice.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="focus:outline-none focus:underline"
                          >
                            {notice.title}
                          </a>
                        </h2>
                      </div>

                      <div className="shrink-0 pt-1">
                        <a
                          href={notice.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 shadow-sm"
                        >
                          View Official Notice
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
                <div>
                  {page > 1 ? (
                    <Link
                      href={`/notices/${slug}?page=${page - 1}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-brand-300 hover:text-brand-700 shadow-sm"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Previous
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-line/40 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-300 cursor-not-allowed">
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Previous
                    </span>
                  )}
                </div>

                <span className="text-xs font-medium text-slate-500">
                  Page <strong className="font-bold text-slate-800">{page}</strong> of{" "}
                  <strong className="font-bold text-slate-800">{totalPages}</strong>
                </span>

                <div>
                  {page < totalPages ? (
                    <Link
                      href={`/notices/${slug}?page=${page + 1}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-brand-300 hover:text-brand-700 shadow-sm"
                    >
                      Next
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-line/40 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-300 cursor-not-allowed">
                      Next
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
