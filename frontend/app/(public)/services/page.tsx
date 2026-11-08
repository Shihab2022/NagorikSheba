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

const PAGE_SIZE = 12;

interface ServicesPageProps {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    category?: string;
    q?: string;
    department?: string;
    availability?: string;
    sort?: string;
  }>;
}

export default async function ServicesPage(props: ServicesPageProps) {
  const sp = (await props.searchParams) || {};
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const limit = Math.max(1, parseInt(sp.limit || String(PAGE_SIZE), 10) || PAGE_SIZE);
  const q = sp.q || "";
  const category = sp.category || "all";
  const department = sp.department || "all";
  const availability = sp.availability || "all";
  const sort = (sp.sort as "popular" | "az" | "za") || "popular";

  let services: GovernmentService[] = [];
  let categories: ServiceCategory[] = [];
  let totalCount = 0;

  try {
    const [servicesRes, categoriesRes] = await Promise.all([
      getAllServices({
        page,
        limit,
        search: q || undefined,
        categoryId: category !== "all" ? category : undefined,
        isPublished: "true",
      }),
      getAllCategories(),
    ]);

    if (categoriesRes?.success && Array.isArray(categoriesRes.data)) {
      categories = categoriesRes.data.map(mapBackendCategoryToFrontend);
    }

    if (servicesRes?.success && Array.isArray(servicesRes.data)) {
      services = servicesRes.data.map(mapBackendServiceToFrontend);
      totalCount = servicesRes.meta?.total ?? services.length;

      if (department !== "all" || availability !== "all") {
        services = services.filter((svc) => {
          const matchDept = department === "all" || svc.department === department;
          const matchAvail =
            availability === "all" ||
            (availability === "online" && svc.isOnline) ||
            (availability === "office" && svc.requiresOfficeVisit);
          return matchDept && matchAvail;
        });
      }
    }
  } catch (error) {
    console.error("Failed to load services from API:", error);
    services = [];
    categories = [];
    totalCount = 0;
  }

  const pagination = {
    page,
    limit,
    total: totalCount,
  };

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
          initialServices={services}
          initialCategories={categories}
          pagination={pagination}
          initialQuery={q}
          initialCategory={category}
          initialDepartment={department}
          initialAvailability={availability}
          initialSort={sort}
        />
      </div>
    </>
  );
}
