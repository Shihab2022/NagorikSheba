import type { Metadata } from "next";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { NearMeView } from "./NearMeView";

export const metadata: Metadata = {
  title: "Near Me Map",
  description:
    "Find nearby government offices on the map — with a Google Maps preview. Defaults to CHAPAI NABABGANJ SADAR Upazila Election Office, CHAPAI NABABGANJ, Bangladesh.",
};

export default function NearMePage() {
  return (
    <>
      <TranslatedPageHeader
        title={{ bn: "আশেপাশের ম্যাপ", en: "Near Me Map" }}
        description={{
          bn: "আপনার কাছাকাছি সরকারি অফিস ম্যাপে দেখুন — Google Maps প্রিভিউসহ।",
          en: "See nearby government offices on the map — with a Google Maps preview.",
        }}
        breadcrumbs={[
          { label: { bn: "হোম", en: "Home" }, href: "/" },
          { label: { bn: "আশেপাশে", en: "Near Me" } },
        ]}
      />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <NearMeView />
      </div>
    </>
  );
}
