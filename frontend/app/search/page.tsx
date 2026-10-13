import type { Metadata } from "next";
import { Suspense } from "react";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { SearchExplorer } from "@/components/search/SearchExplorer";
import { Skeleton } from "@/components/ui/States";

export const metadata: Metadata = {
  title: "Search",
  description: "Search government services, required documents, offices and notices across NagorikSheba.",
};

export default async function SearchPage(props: PageProps<"/search">) {
  const sp = await props.searchParams;
  const q = typeof sp?.q === "string" ? sp.q : "";
  return (
    <>
      <TranslatedPageHeader
        title={{ bn: "সবকিছু অনুসন্ধান করুন", en: "Search everything" }}
        description={{
          bn: "সরকারি সেবা, ডকুমেন্ট, অফিস ও নোটিশ — এক জায়গায় একটি অনুসন্ধান।",
          en: "One search across government services, documents, offices and notices.",
        }}
        breadcrumbs={[
          { label: { bn: "হোম", en: "Home" }, href: "/" },
          { label: { bn: "অনুসন্ধান", en: "Search" } },
        ]}
      />
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-2xl" />}>
          <SearchExplorer initialQuery={q} />
        </Suspense>
      </div>
    </>
  );
}
