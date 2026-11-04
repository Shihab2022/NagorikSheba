import type { Metadata } from "next";
import { Suspense } from "react";
import { getMe } from "@/service/auth";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { UserSidebar } from "@/components/dashboard/layout/UserSidebar";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { SearchExplorer } from "@/components/search/SearchExplorer";
import { Skeleton } from "@/components/ui/States";

export const metadata: Metadata = {
  title: "Search Services | Dashboard",
  description: "Search government services, required documents, offices and notices inside the citizen dashboard.",
};

interface SearchPageProps {
  searchParams?: Promise<{ q?: string }>;
}

export default async function DashboardSearchPage(props: SearchPageProps) {
  const meRes = await getMe();
  const user = meRes.success ? meRes.data : null;

  const sp = props.searchParams ? await props.searchParams : {};
  const q = typeof sp?.q === "string" ? sp.q : "";

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={{ bn: "সেবা ও তথ্য অনুসন্ধান", en: "Search Services & Info" }}
          description={{
            bn: "সরকারি সেবা, প্রয়োজনীয় ডকুমেন্ট, অফিস ও নোটিশ — এক জায়গায় সরাসরি অনুসন্ধান করুন।",
            en: "One unified search across government services, documents, regional offices and notices.",
          }}
          breadcrumbs={[
            { label: { bn: "হোম", en: "Home" }, href: "/" },
            { label: { bn: "ড্যাশবোর্ড", en: "Dashboard" }, href: "/dashboard" },
            { label: { bn: "অনুসন্ধান", en: "Search" } },
          ]}
        />
      }
      sidebar={<UserSidebar user={user} />}
    >
      <div className="w-full">
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-2xl" />}>
          <SearchExplorer initialQuery={q} />
        </Suspense>
      </div>
    </DashboardShell>
  );
}
