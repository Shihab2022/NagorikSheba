import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Layers, Sparkles } from "lucide-react";
import { getMe } from "@/service/auth";
import { getAllServices } from "@/service/service";
import { getAllCategories } from "@/service/category";
import { mapBackendServiceToFrontend, mapBackendCategoryToFrontend } from "@/lib/service-adapter";
import type { GovernmentService, ServiceCategory } from "@/lib/types";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { UserSidebar } from "@/components/dashboard/layout/UserSidebar";
import { ServicesExplorer } from "@/components/services/ServicesExplorer";
import { T } from "@/components/ui/T";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Services | Dashboard",
  description: "Browse all government services inside your citizen dashboard.",
};

const PAGE_SIZE = 12;

interface ServicesPageProps {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    q?: string;
    category?: string;
    department?: string;
    availability?: string;
    sort?: string;
  }>;
}

export default async function DashboardServicesPage(props: ServicesPageProps) {
  const meRes = await getMe();
  const user = meRes.success ? meRes.data : null;

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

      // In-memory filter on server if department or availability specified
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
  } catch {
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
    <DashboardShell sidebar={<UserSidebar user={user} />}>
      {/* Sleek Dashboard Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="-mt-2 mb-1">
        <ol className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <li>
            <Link href="/" className="hover:text-brand-700 transition-colors">
              <T bn="হোম" en="Home" />
            </Link>
          </li>
          <li>
            <ChevronRight className="h-3 w-3 text-slate-300" />
          </li>
          <li>
            <Link href="/dashboard" className="hover:text-brand-700 transition-colors">
              <T bn="ড্যাশবোর্ড" en="Dashboard" />
            </Link>
          </li>
          <li>
            <ChevronRight className="h-3 w-3 text-slate-300" />
          </li>
          <li className="text-slate-700 font-bold">
            <T bn="সকল সেবা" en="All Services" />
          </li>
        </ol>
      </nav>

      {/* Services Explorer Container */}
      <div className="space-y-6">
        {/* Header Block */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Layers className="h-4 w-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                <T bn="সরকারি সেবাসমূহ" en="Government Services" />
              </h1>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
              <T
                bn="নাগরিক সেবা প্ল্যাটফর্মের আওতাভুক্ত সকল সরকারি সেবা ব্রাউজ করুন, প্রয়োজনীয় নথিপত্র ও ধাপ জানুন।"
                en="Browse all official government services, review required documents and track step-by-step procedures."
              />
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full self-start sm:self-auto">
            <Sparkles className="h-3.5 w-3.5 text-brand-600" />
            <span>
              <T
                bn={`মোট ${totalCount} টি সেবা`}
                en={`${totalCount} Total Services`}
              />
            </span>
          </div>
        </div>

        {/* Embedded Interactive Services Explorer */}
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
    </DashboardShell>
  );
}
