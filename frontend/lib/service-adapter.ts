import type { GovernmentService, ServiceCategory } from "@/lib/types";
import type { ServiceItem } from "@/types/service";
import type { CategoryItem } from "@/types/category";

/**
 * Maps a backend ServiceItem (with relational steps, requirements, fees, sources)
 * to the frontend GovernmentService UI shape.
 */
export function mapBackendServiceToFrontend(item: ServiceItem): GovernmentService {
  const steps = (item.steps || [])
    .sort((a, b) => a.stepNumber - b.stepNumber)
    .map((s) => s.description || s.title);

  const requiredDocuments = (item.requirements || [])
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((r) => r.name);

  // Derive display fee
  let feeDisplay = "Free";
  if (item.fees && item.fees.length > 0) {
    const fee = item.fees[0];
    if (fee.amount !== null && fee.amount !== undefined && Number(fee.amount) > 0) {
      feeDisplay = `৳${Number(fee.amount).toLocaleString("en-US")}`;
    } else if (fee.name) {
      feeDisplay = fee.name;
    }
  }

  const eligibilityList = item.eligibility
    ? item.eligibility.split(";").map((e) => e.trim()).filter(Boolean)
    : [];

  const categorySlug = item.category_slug || "identity-documents";
  const departmentName = item.category_name || "Government Department";

  const hasPortal = Boolean(
    item.officialUrl ||
      (item.steps && item.steps.some((s) => s.actionType === "VISIT_OFFICIAL_PORTAL")),
  );
  const requiresOffice = Boolean(
    item.steps && item.steps.some((s) => s.actionType === "VISIT_OFFICE"),
  );

  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    category: categorySlug,
    department: departmentName,
    description: item.shortDescription || item.description,
    longDescription: item.description,
    eligibility: eligibilityList,
    requiredDocuments,
    fee: feeDisplay,
    processingTime: item.processingTime || "Varies",
    steps,
    authority: departmentName,
    officialUrl: item.officialUrl || undefined,
    lastVerifiedAt: item.createdAt ? item.createdAt.slice(0, 10) : undefined,
    isOnline: hasPortal,
    requiresOfficeVisit: requiresOffice,
    popularity: 90,
    icon: "FileText",
    updatedLabel: "Updated recently",
  };
}

/**
 * Maps a backend CategoryItem to the frontend ServiceCategory UI shape.
 */
export function mapBackendCategoryToFrontend(cat: CategoryItem & { serviceCount?: number }): ServiceCategory {
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || "",
    icon: cat.icon || "Folder",
    serviceCount: cat.serviceCount ?? 0,
    samples: [],
    accent: "green",
  };
}
