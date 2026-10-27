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

import { getAllCategories } from "@/service/category";
import { getAllServices } from "@/service/service";
import { mapBackendCategoryToFrontend, mapBackendServiceToFrontend } from "@/lib/service-adapter";
import type { ServiceCategory, GovernmentService } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NagorikSheba — বাংলাদেশের সরকারি সেবার এক ঠিকানা",
  description:
    "Find the government service you need, understand the process, and access the official service. Services, documents, fees, offices, notices and AI guidance — all in one place.",
};

export default async function HomePage() {
  const [catRes, svcRes] = await Promise.all([
    getAllCategories(),
    getAllServices({ limit: 12 }),
  ]);

  const categories: ServiceCategory[] = (catRes.success && catRes.data)
    ? catRes.data.map(mapBackendCategoryToFrontend)
    : [];

  const services: GovernmentService[] = (svcRes.success && svcRes.data)
    ? svcRes.data.map(mapBackendServiceToFrontend)
    : [];

  return (
    <>
      <Hero />
      <TrustBar />
      <ServiceSearch />
      <CategoryGrid categories={categories} />
      <PopularServices services={services} />
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
