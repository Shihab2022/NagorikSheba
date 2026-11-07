import type { GovernmentService, ServiceCategory } from "@/lib/types";
import type { ServiceItem } from "@/types/service";
import type { CategoryItem } from "@/types/category";
import { getServiceBySlug } from "@/lib/data/services";

/**
 * Maps a backend ServiceItem (with relational steps, requirements, fees, sources)
 * to the frontend GovernmentService UI shape.
 */
export function mapBackendServiceToFrontend(item: ServiceItem): GovernmentService {
  const fallback = getServiceBySlug(item.slug);

  const steps =
    item.steps && item.steps.length > 0
      ? item.steps
          .sort((a, b) => a.stepNumber - b.stepNumber)
          .map((s) => s.description || s.title)
      : (fallback?.steps || []);

  const requiredDocuments =
    item.requirements && item.requirements.length > 0
      ? item.requirements
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
          .map((r) => r.name)
      : (fallback?.requiredDocuments || []);

  const documentsCount =
    typeof item.requirementCount === "number" && item.requirementCount > 0
      ? item.requirementCount
      : requiredDocuments.length;

  // Derive display fee
  let feeDisplay = "Free";
  if (item.fees && item.fees.length > 0) {
    const fee = item.fees[0];
    if (fee.amount !== null && fee.amount !== undefined && Number(fee.amount) > 0) {
      feeDisplay = `৳${Number(fee.amount).toLocaleString("en-US")}`;
    } else if (fee.name) {
      feeDisplay = fee.name;
    }
  } else if (fallback?.fee) {
    feeDisplay = fallback.fee;
  }

  const eligibilityList = item.eligibility
    ? item.eligibility.split(";").map((e) => e.trim()).filter(Boolean)
    : (fallback?.eligibility || []);

  const categorySlug = item.category_slug || fallback?.category || "identity-documents";
  const departmentName = item.category_name || fallback?.department || "Government Department";

  const hasPortal = Boolean(
    item.officialUrl ||
      fallback?.officialUrl ||
      (item.steps && item.steps.some((s) => s.actionType === "VISIT_OFFICIAL_PORTAL")),
  );
  const requiresOffice = Boolean(
    fallback?.requiresOfficeVisit ??
      (item.steps && item.steps.some((s) => s.actionType === "VISIT_OFFICE")),
  );

  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    category: categorySlug,
    department: departmentName,
    description: item.shortDescription || item.description || fallback?.description || "",
    longDescription: item.description || fallback?.longDescription || item.shortDescription || "",
    eligibility: eligibilityList,
    requiredDocuments,
    documentsCount,
    fee: feeDisplay,
    processingTime: item.processingTime || fallback?.processingTime || "Varies",
    steps,
    authority: departmentName,
    officialUrl: item.officialUrl || fallback?.officialUrl || undefined,
    lastVerifiedAt: item.createdAt ? item.createdAt.slice(0, 10) : fallback?.lastVerifiedAt,
    isOnline: hasPortal,
    requiresOfficeVisit: requiresOffice,
    popularity: fallback?.popularity || 90,
    icon: fallback?.icon || "FileText",
    updatedLabel: fallback?.updatedLabel || "Updated recently",
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
