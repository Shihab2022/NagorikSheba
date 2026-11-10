import type { Metadata } from "next";
import { getAllCategories } from "@/service/category";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { NoticesCategoryGrid } from "@/components/notices/NoticesCategoryGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Government Notices by Category",
  description:
    "Browse the latest official Bangladesh government notices, updates and announcements categorized by service sector.",
};

export default async function NoticesOverviewPage() {
  const catRes = await getAllCategories().catch(() => ({ success: false, data: [] }));
  const categories = catRes.data || [];

  return (
    <>
      <TranslatedPageHeader
        title={{ bn: "সর্বশেষ সরকারি নোটিশ", en: "Latest Government Notices" }}
        description={{
          bn: "সরকারি বিভাগ ও সংস্থার সর্বশেষ নোটিশ, প্রজ্ঞাপন ও ঘোষণা — ক্যাটাগরি অনুযায়ী সাজানো।",
          en: "Latest official government notices, gazettes and announcements — organized category-wise from official sources.",
        }}
        breadcrumbs={[
          { label: { bn: "হোম", en: "Home" }, href: "/" },
          { label: { bn: "নোটিশ", en: "Notices" } },
        ]}
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <NoticesCategoryGrid categories={categories} basePath="/notices" />
      </div>
    </>
  );
}
