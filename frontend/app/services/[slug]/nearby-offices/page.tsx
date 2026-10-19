import type { Metadata } from "next";
import { SERVICES, getServiceBySlug } from "@/lib/data/services";
import {
  DEFAULT_RADIUS_KM,
  RADIUS_OPTIONS_KM,
  getOfficeServiceKey,
  parseCoordinateQuery,
} from "@/lib/nearby";
import type { NearbyOrigin } from "@/lib/types";
import { NearbyOfficesView } from "@/components/nearby/NearbyOfficesView";
import { NearbyIntro } from "@/components/nearby/FindNearbyOffices";
import { NearbyUnsupported } from "@/components/nearby/NearbyUnsupported";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";

export function generateStaticParams() {
  return SERVICES.filter((s) => getOfficeServiceKey(s.slug)).map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata(
  props: PageProps<"/services/[slug]/nearby-offices">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Nearby Offices" };
  return {
    title: `Nearby Offices — ${service.name}`,
    description: `Find government offices near you that provide ${service.name}, with distances and Google Maps directions.`,
  };
}

/**
 * Dedicated nearby-offices page. The user's location (GPS coordinates or a
 * manually selected area) and the selected service travel through the URL,
 * so the page survives refresh and can be shared — no client-only state.
 */
export default async function NearbyOfficesPage(
  props: PageProps<"/services/[slug]/nearby-offices">,
) {
  const { slug } = await props.params;
  const sp = await props.searchParams;

  const service = getServiceBySlug(slug);
  const serviceKey = service ? getOfficeServiceKey(slug) : null;

  // Never hard-404: unknown / unsupported slugs get a helpful fallback with
  // links to supported services + the standalone /near-me map.
  if (!service || !serviceKey) {
    const label = service?.name ?? slug;
    return (
      <>
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
            { label: { bn: "সেবা", en: "Services" }, href: "/services" },
            { label: { bn: "নিকটবর্তী অফিস", en: "Nearby Offices" } },
          ]}
        />
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <NearbyUnsupported slug={slug} />
        </div>
      </>
    );
  }

  // ---- Parse location from the URL (validated before use) -------------
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
    <>
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
          { label: { bn: "সেবা", en: "Services" }, href: "/services" },
          { label: { bn: service.name, en: service.name }, href: `/services/${service.slug}` },
          { label: { bn: "নিকটবর্তী অফিস", en: "Nearby Offices" } },
        ]}
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
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
    </>
  );
}
