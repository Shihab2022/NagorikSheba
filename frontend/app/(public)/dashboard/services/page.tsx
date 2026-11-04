import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Layers, Sparkles } from "lucide-react";
import { getMe } from "@/service/auth";
import { getAllServices } from "@/service/service";
import { getAllCategories } from "@/service/category";
import { mapBackendServiceToFrontend, mapBackendCategoryToFrontend } from "@/lib/service-adapter";
import { SERVICES } from "@/lib/data/services";
import { CATEGORIES } from "@/lib/data/categories";
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

    if (categoriesRes.success && categoriesRes.data && categoriesRes.data.length > 0) {
      categories = categoriesRes.data.map(mapBackendCategoryToFrontend);
    } else {
      categories = CATEGORIES;
    }

    if (servicesRes.success && servicesRes.data && servicesRes.data.length > 0) {
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
    } else {
      // Server-side fallback filtering
      const filtered = SERVICES.filter((s) => {
        const matchQ =
          !q ||
          s.name.toLowerCase().includes(q.toLowerCase()) ||
          s.description.toLowerCase().includes(q.toLowerCase()) ||
          s.department.toLowerCase().includes(q.toLowerCase());
        const matchCat = category === "all" || s.category === category;
        const matchDept = department === "all" || s.department === department;
        const matchAvail =
          availability === "all" ||
          (availability === "online" && s.isOnline) ||
          (availability === "office" && s.requiresOfficeVisit);
        return matchQ && matchCat && matchDept && matchAvail;
      }).sort((a, b) => {
        if (sort === "popular") return b.popularity - a.popularity;
        if (sort === "az") return a.name.localeCompare(b.name);
        return b.name.localeCompare(a.name);
      });

      totalCount = filtered.length;
      services = filtered.slice((page - 1) * limit, page * limit);
    }
  } catch {
    // Error fallback
    const filtered = SERVICES.filter((s) => {
      const matchQ =
        !q ||
        s.name.toLowerCase().includes(q.toLowerCase()) ||
        s.description.toLowerCase().includes(q.toLowerCase());
      const matchCat = category === "all" || s.category === category;
      return matchQ && matchCat;
    });
    totalCount = filtered.length;
    services = filtered.slice((page - 1) * limit, page * limit);
    categories = CATEGORIES;
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

      {/* Page Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-800/30 bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 p-6 sm:p-7 text-white shadow-md">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-brand-400/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-2.5 py-0.5 text-[10px] font-black text-emerald-200 uppercase tracking-wider">
                <Layers className="h-3 w-3" />
                <T bn="সার্ভার নিয়ন্ত্রিত ক্যাটালগ" en="Server-Paginated Catalogue" />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-black text-emerald-300">
                <Sparkles className="h-2.5 w-2.5" />
                {totalCount} <T bn="সেবা উপলব্ধ" en="Services Found" />
              </span>
            </div>

            <h1 className="mt-2 text-xl sm:text-2xl font-black text-white tracking-tight">
              <T bn="সকল সরকারি সেবা" en="All Government Services" />
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100/80 font-medium">
              <T
                bn="সার্ভার থেকে দ্রুততম সময়ে প্রয়োজনীয় সেবা খুঁজুন ও যাচাই করুন।"
                en="Fast server-rendered citizen services catalogue with real-time pagination."
              />
            </p>
          </div>
        </div>
      </div>

      {/* Main Services Explorer with Server-Controlled Pagination */}
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
    </DashboardShell>
  );
}
