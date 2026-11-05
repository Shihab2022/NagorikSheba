import type { Metadata } from "next";
import { getMe } from "@/service/auth";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { UserSidebar } from "@/components/dashboard/layout/UserSidebar";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { DocsExplorer } from "@/components/documents/DocsExplorer";

export const metadata: Metadata = {
  title: "Document Checklists | Dashboard",
  description: "Checklists of required documents for every government service.",
};

export default async function DashboardDocumentsPage() {
  const meRes = await getMe();
  const user = meRes.success ? meRes.data : null;

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={{
            bn: "ডকুমেন্ট চেকলিস্ট",
            en: "Document Checklists",
          }}
          description={{
            bn: "একটি সেবা বেছে নিন, প্রতিটি ডকুমেন্ট সংগ্রহ করার সাথে সাথে টিক দিন, এবং পুরোপুরি প্রস্তুত হয়ে যান।",
            en: "Pick a service, tick off each document as you collect it, and arrive fully prepared.",
          }}
          breadcrumbs={[
            { label: { bn: "হোম", en: "Home" }, href: "/" },
            { label: { bn: "ড্যাশবোর্ড", en: "Dashboard" }, href: "/dashboard" },
            { label: { bn: "ডকুমেন্ট চেকলিস্ট", en: "Documents" } },
          ]}
        />
      }
      sidebar={<UserSidebar user={user} />}
    >
      <DocsExplorer />
    </DashboardShell>
  );
}
