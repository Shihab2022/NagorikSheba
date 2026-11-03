import type { Metadata } from "next";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { ServicesExplorer } from "@/components/services/ServicesExplorer";
import { getAllServices } from "@/service/service";
import { getAllCategories } from "@/service/category";
import { mapBackendServiceToFrontend, mapBackendCategoryToFrontend } from "@/lib/service-adapter";
import type { GovernmentService, ServiceCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Government Services",
  description:
    "Browse Bangladesh government services by category, department and availability — with documents, fees and step-by-step guidance.",
};

interface ServicesPageProps {
  searchParams?: Promise<{ category?: string; q?: string }>;
}

export default async function ServicesPage(props: ServicesPageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const initialCategory = searchParams?.category || "all";
  const initialQuery = searchParams?.q || "";

  const [servicesRes, categoriesRes] = await Promise.all([
    getAllServices({ limit: 100 }),
    getAllCategories(),
  ]);

  const initialServices: GovernmentService[] = (servicesRes.success && servicesRes.data)
    ? servicesRes.data.map(mapBackendServiceToFrontend)
    : [];

  const initialCategories: ServiceCategory[] = (categoriesRes.success && categoriesRes.data)
    ? categoriesRes.data.map(mapBackendCategoryToFrontend)
    : [];

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
        <ServicesExplorer
          initialQuery={initialQuery}
          initialCategory={initialCategory}
          initialServices={initialServices}
          initialCategories={initialCategories}
        />
      </div>
    </>
  );
}
