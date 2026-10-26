import type { Metadata } from "next";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { ServicesExplorer } from "@/components/services/ServicesExplorer";
import { DemoNote } from "@/components/ui/States";

export const metadata: Metadata = {
  title: "Government Services",
  description:
    "Browse Bangladesh government services by category, department and availability — with documents, fees and step-by-step guidance.",
};

export default function ServicesPage() {
  return (
    <>
      <TranslatedPageHeader
        title={{ bn: "সরকারি সেবা", en: "Government Services" }}
        description={{
          bn: "সরকারি সেবা খুঁজুন — প্রতিটি সেবার জন্য ব্রাউজ, ফিল্টার করুন এবং অফিসিয়াল আবেদন লিংক খুলুন।",
          en: "Browse, filter and open the official application link for every service.",
        }}
        breadcrumbs={[
          { label: { bn: "হোম", en: "Home" }, href: "/" },
          { label: { bn: "সেবা", en: "Services" } },
        ]}
      />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6">
          <DemoNote />
        </div>
        <ServicesExplorer />
      </div>
    </>
  );
}
