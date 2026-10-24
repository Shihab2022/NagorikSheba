import type { Metadata } from "next";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { DemoNote } from "@/components/ui/States";
import { NoticesExplorer } from "@/components/notices/NoticesExplorer";

export const metadata: Metadata = {
  title: "Government Notices",
  description:
    "Browse the latest government notices, updates and announcements across NID, passport, tax, education, land and more.",
};

export default function NoticesPage() {
  return (
    <>
      <TranslatedPageHeader
        title={{ bn: "সর্বশেষ সরকারি নোটিশ", en: "Latest Government Notices" }}
        description={{
          bn: "সরকারি বিভাগগুলোর সর্বশেষ নোটিশ, সেবার হালনাগাদ ও ঘোষণা — পরিষ্কারভাবে সাজানো ও সহজে পড়ার মতো।",
          en: "Latest government notices, service updates and announcements — clearly organized and easy to scan.",
        }}
        breadcrumbs={[
          { label: { bn: "হোম", en: "Home" }, href: "/" },
          { label: { bn: "নোটিশ", en: "Notices" } },
        ]}
      />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6">
          <DemoNote />
        </div>
        <NoticesExplorer />
      </div>
    </>
  );
}
