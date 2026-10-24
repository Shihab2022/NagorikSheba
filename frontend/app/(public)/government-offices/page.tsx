import type { Metadata } from "next";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { OfficesExplorer } from "@/components/offices/OfficesExplorer";
import { DemoNote } from "@/components/ui/States";

export const metadata: Metadata = {
  title: "Find Government Offices",
  description:
    "Find government offices across Bangladesh — passport, land, BRTA, police, hospitals, tax, city corporation, municipality and courts.",
};

export default function GovernmentOfficesPage() {
  return (
    <>
      <TranslatedPageHeader
        title={{ bn: "সরকারি অফিস খুঁজুন", en: "Find Government Offices" }}
        description={{
          bn: "সরকারি অফিস খুঁজুন — বিভাগ, জেলা, উপজেলা ও অফিসের ধরন অনুযায়ী ফিল্টার করুন।",
          en: "Filter by division, district, upazila and office type.",
        }}
        breadcrumbs={[
          { label: { bn: "হোম", en: "Home" }, href: "/" },
          { label: { bn: "সরকারি অফিস", en: "Government Offices" } },
        ]}
      />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6">
          <DemoNote />
        </div>
        <OfficesExplorer />
      </div>
    </>
  );
}
