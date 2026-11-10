import type { Metadata } from "next";
import {
  DEFAULT_RADIUS_KM,
  RADIUS_OPTIONS_KM,
  getOfficeServiceKey,
  parseCoordinateQuery,
} from "@/lib/nearby";
import type { NearbyOrigin } from "@/lib/types";
import { getMe } from "@/service/auth";
import { getSingleService } from "@/service/service";
import { mapBackendServiceToFrontend } from "@/lib/service-adapter";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { UserSidebar } from "@/components/dashboard/layout/UserSidebar";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { NearbyOfficesView } from "@/components/nearby/NearbyOfficesView";
import { NearbyIntro } from "@/components/nearby/FindNearbyOffices";
import { NearbyUnsupported } from "@/components/nearby/NearbyUnsupported";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{
    lat?: string;
    lng?: string;
    district?: string;
    upazila?: string;
    radius?: string;
  }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const res = await getSingleService(slug).catch(() => null);
  const service = res?.data ? mapBackendServiceToFrontend(res.data) : null;
  if (!service) return { title: "Nearby Offices | Dashboard" };
  return {
    title: `Nearby Offices — ${service.name} | Dashboard`,
    description: `Find government offices near you that provide ${service.name}.`,
  };
}

export default async function DashboardNearbyOfficesPage(props: PageProps) {
  const { slug } = await props.params;
  const sp = props.searchParams ? await props.searchParams : {};

  const [meRes, res] = await Promise.all([
    getMe().catch(() => ({ success: false, data: null })),
    getSingleService(slug).catch(() => null),
  ]);

  const user = meRes.success ? meRes.data : null;
  const service = res?.data ? mapBackendServiceToFrontend(res.data) : null;
  const serviceKey = service ? getOfficeServiceKey(slug) : null;

  if (!service || !serviceKey) {
    const label = service?.name ?? slug;
    return (
      <DashboardShell
        header={
          <TranslatedPageHeader
            title={{
              bn: `নিকটবর্তী অফিস — ${label}`,
              en: `Nearby Offices — ${label}`,
            }}
            description={{
              bn: "যে সরকারি অফিস আপনার সেবাটি দেয় সেগুলো খুঁজুন — দূরত্ব ও Google Maps দিকনির্দেশনাসহ।",
              en: "Find the government offices that provide this service — with distances and Google Maps directions.",
            }}
            breadcrumbs={[
              { label: { bn: "হোম", en: "Home" }, href: "/" },
              { label: { bn: "ড্যাশবোর্ড", en: "Dashboard" }, href: "/dashboard" },
              { label: { bn: "সকল সেবা", en: "All Services" }, href: "/dashboard/services" },
              { label: { bn: "নিকটবর্তী অফিস", en: "Nearby Offices" } },
            ]}
          />
        }
        sidebar={<UserSidebar user={user} />}
      >
        <NearbyUnsupported slug={slug} />
      </DashboardShell>
    );
  }

  // Parse location parameters
  let origin: NearbyOrigin | null = null;
  let radiusKm = DEFAULT_RADIUS_KM;

  const hasCoordinateQuery = sp?.lat !== undefined || sp?.lng !== undefined;
  const lat = parseCoordinateQuery(sp?.lat, -90, 90);
  const lng = parseCoordinateQuery(sp?.lng, -180, 180);
  const rawDistrict = typeof sp?.district === "string" ? sp.district.trim() : "";
  const rawUpazila = typeof sp?.upazila === "string" ? sp.upazila.trim() : "";
  const rawRadius = typeof sp?.radius === "string" ? Number(sp.radius) : NaN;

  if ((RADIUS_OPTIONS_KM as readonly number[]).includes(rawRadius)) {
    radiusKm = rawRadius;
  }

  if (hasCoordinateQuery && lat !== null && lng !== null) {
    origin = { mode: "gps", lat, lng };
  } else if (rawDistrict && rawDistrict.length <= 100) {
    origin = {
      mode: "area",
      district: rawDistrict,
      upazila: rawUpazila && rawUpazila.length <= 100 ? rawUpazila : null,
    };
  }

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={{
            bn: `নিকটবর্তী অফিস — ${service.name}`,
            en: `Nearby Offices — ${service.name}`,
          }}
          description={{
            bn: "যে সরকারি অফিস আপনার সেবাটি দেয় সেগুলো খুঁজুন — দূরত্ব ও Google Maps দিকনির্দেশনাসহ।",
            en: "Find the government offices that provide this service — with distances and Google Maps directions.",
          }}
          breadcrumbs={[
            { label: { bn: "হোম", en: "Home" }, href: "/" },
            { label: { bn: "ড্যাশবোর্ড", en: "Dashboard" }, href: "/dashboard" },
            { label: { bn: "সকল সেবা", en: "All Services" }, href: "/dashboard/services" },
            {
              label: { bn: service.name, en: service.name },
              href: `/dashboard/services/${service.slug}`,
            },
            { label: { bn: "নিকটবর্তী অফিস", en: "Nearby Offices" } },
          ]}
        />
      }
      sidebar={<UserSidebar user={user} />}
    >
      <div className="space-y-6">
        {origin ? (
          <NearbyOfficesView
            slug={slug}
            service={serviceKey}
            origin={origin}
            radiusKm={radiusKm}
          />
        ) : hasCoordinateQuery ? (
          <NearbyIntro slug={slug} invalidCoordinates />
        ) : (
          <NearbyIntro slug={slug} />
        )}
      </div>
    </DashboardShell>
  );
}
