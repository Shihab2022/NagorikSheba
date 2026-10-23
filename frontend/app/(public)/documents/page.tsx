import type { Metadata } from "next";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { DemoNote } from "@/components/ui/States";
import { DocsExplorer } from "@/components/documents/DocsExplorer";

export const metadata: Metadata = {
  title: "Document Checklists",
  description: "Interactive checklists of required documents for every major Bangladesh government service.",
};

export default function DocumentsPage() {
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
        <div className="mb-6"><DemoNote /></div>
        <DocsExplorer />
      </div>
    </>
  );
}
