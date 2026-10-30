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
    <div className="w-full max-w-full overflow-x-hidden">
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
      <div className="mx-auto w-full max-w-[1720px] px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 xl:px-10 2xl:px-12 min-w-0">
        <div className="mb-4 sm:mb-6">
          <DemoNote />
        </div>
        <ServicesExplorer />
      </div>
    </div>
  );
}
