import { Suspense } from "react";
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
import { WhyEkSheba } from "@/components/home/WhyEkSheba";
import { CTASection } from "@/components/home/CTASection";

import { getAllCategories } from "@/service/category";
import { getAllServices, getSingleService } from "@/service/service";
import { mapBackendCategoryToFrontend, mapBackendServiceToFrontend } from "@/lib/service-adapter";
import type { ServiceCategory, GovernmentService } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NagorikSheba — বাংলাদেশের সরকারি সেবার এক ঠিকানা",
  description:
    "Find the government service you need, understand the process, and access the official service. Services, documents, fees, offices, notices and AI guidance — all in one place.",
};

/** Streaming Server Component: Category Section */
async function CategorySection() {
  let categories: ServiceCategory[] = [];
  try {
    const catRes = await getAllCategories();
    if (catRes?.success && Array.isArray(catRes.data)) {
      categories = catRes.data.map(mapBackendCategoryToFrontend);
    }
  } catch {
    categories = [];
  }
  return <CategoryGrid categories={categories} />;
}

/** Streaming Server Component: Popular Services Section */
async function PopularServicesSection() {
  let services: GovernmentService[] = [];
  try {
    const svcRes = await getAllServices({ limit: 12 });
    if (svcRes?.success && Array.isArray(svcRes.data)) {
      services = svcRes.data.map(mapBackendServiceToFrontend);
    }
  } catch {
    services = [];
  }
  return <PopularServices services={services} />;
}

/** Streaming Server Component: Service Detail Preview */
async function ServiceDetailPreviewSection() {
  let previewService: GovernmentService | null = null;
  try {
    const res = await getSingleService("nid-correction").catch(() => null);
    if (res?.success && res.data) {
      previewService = mapBackendServiceToFrontend(res.data);
    } else {
      const topSvc = await getAllServices({ limit: 1 }).catch(() => null);
      if (topSvc?.success && topSvc.data?.[0]) {
        const first = await getSingleService(topSvc.data[0].slug || topSvc.data[0].id).catch(() => null);
        if (first?.success && first.data) {
          previewService = mapBackendServiceToFrontend(first.data);
        }
      }
    }
  } catch {
    previewService = null;
  }
  return <ServiceDetailPreview service={previewService} />;
}

/** Streaming Server Component: Document Checklist */
async function DocumentChecklistSection() {
  let detailedServices: GovernmentService[] = [];
  try {
    const svcRes = await getAllServices({ limit: 4 });
    if (svcRes?.success && Array.isArray(svcRes.data)) {
      const topSlugs = svcRes.data.slice(0, 4).map((s) => s.slug || s.id);
      const detailResults = await Promise.all(
        topSlugs.map((slug) => getSingleService(slug).catch(() => null)),
      );
      detailedServices = detailResults
        .filter((r): r is NonNullable<typeof r> => Boolean(r?.success && r.data))
        .map((r) => mapBackendServiceToFrontend(r.data!));
    }
  } catch {
    detailedServices = [];
  }
  return <DocumentChecklist services={detailedServices} />;
}

/** Streaming Server Component: Fees Section */
async function FeesSectionSection() {
  let services: GovernmentService[] = [];
  try {
    const svcRes = await getAllServices({ limit: 8 });
    if (svcRes?.success && Array.isArray(svcRes.data)) {
      services = svcRes.data.map(mapBackendServiceToFrontend);
    }
  } catch {
    services = [];
  }
  return <FeesSection services={services} />;
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServiceSearch />

      {/* Categories with custom loader during stream */}
      <Suspense fallback={<CategoryGrid loading />}>
        <CategorySection />
      </Suspense>

      {/* Popular Services with custom loader during stream */}
      <Suspense fallback={<PopularServices loading />}>
        <PopularServicesSection />
      </Suspense>

      <HowItWorks />

      <Suspense fallback={null}>
        <ServiceDetailPreviewSection />
      </Suspense>

      <OfficeFinder />

      <Suspense fallback={null}>
        <DocumentChecklistSection />
      </Suspense>

      <Suspense fallback={null}>
        <FeesSectionSection />
      </Suspense>

      <ApplicationTracker />
      <AIAssistant />
      <WhyEkSheba />
      <CTASection />
    </>
  );
}
