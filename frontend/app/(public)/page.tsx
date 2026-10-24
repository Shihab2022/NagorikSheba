import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { ServiceSearch } from "@/components/home/ServiceSearch";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { PopularServices } from "@/components/home/PopularServices";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ServiceDetailPreview } from "@/components/home/ServiceDetailPreview";
import { OfficeFinder } from "@/components/home/OfficeFinder";
import { DocumentChecklist } from "@/components/home/DocumentChecklist";
import { FeesSection } from "@/components/home/FeesSection";
import { ApplicationTracker } from "@/components/home/ApplicationTracker";
import { AIAssistant } from "@/components/home/AIAssistant";
import { NoticeSection } from "@/components/home/NoticeSection";
import { QuickTools } from "@/components/home/QuickTools";
import { WhyEkSheba } from "@/components/home/WhyEkSheba";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "NagorikSheba — বাংলাদেশের সরকারি সেবার এক ঠিকানা",
  description:
    "Find the government service you need, understand the process, and access the official service. Services, documents, fees, offices, notices and AI guidance — all in one place.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServiceSearch />
      <CategoryGrid />
      <PopularServices />
      <HowItWorks />
      <ServiceDetailPreview />
      <OfficeFinder />
      <DocumentChecklist />
      <FeesSection />
      <ApplicationTracker />
      <AIAssistant />
      <NoticeSection />
      <QuickTools />
      <WhyEkSheba />
      <CTASection />
    </>
  );
}
