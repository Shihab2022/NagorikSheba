import type { Metadata } from "next";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { DocsExplorer } from "@/components/documents/DocsExplorer";
import { getAllServices, getSingleService } from "@/service/service";
import { mapBackendServiceToFrontend } from "@/lib/service-adapter";
import type { GovernmentService } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Document Checklists",
  description: "Interactive checklists of required documents for every major Bangladesh government service.",
};

export default async function DocumentsPage() {
  let services: GovernmentService[] = [];

  try {
    const res = await getAllServices({ limit: 20 });
    if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
      // Fetch details with actual required documents for the services
      const detailResults = await Promise.all(
        res.data.map((s) => getSingleService(s.slug || s.id).catch(() => null)),
      );
      services = detailResults
        .filter((r): r is NonNullable<typeof r> => Boolean(r?.success && r.data))
        .map((r) => mapBackendServiceToFrontend(r.data!));
    }
  } catch {
    services = [];
  }

  return (
    <>
      <TranslatedPageHeader
        title={{
          bn: "কোন সেবার জন্য কী কী কাগজ লাগবে?",
          en: "Which papers do you need for which service?",
        }}
        description={{
          bn: "একটি সেবা বেছে নিন, প্রতিটি ডকুমেন্ট সংগ্রহ করার সাথে সাথে টিক দিন, এবং পুরোপুরি প্রস্তুত হয়ে যান।",
          en: "Pick a service, tick off each document as you collect it, and arrive fully prepared.",
        }}
        breadcrumbs={[
          { label: { bn: "হোম", en: "Home" }, href: "/" },
          { label: { bn: "ডকুমেন্ট", en: "Documents" } },
        ]}
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <DocsExplorer services={services} />
      </div>
    </>
  );
}
