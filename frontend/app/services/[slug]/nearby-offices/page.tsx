import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/data/services";
import {
  DEFAULT_RADIUS_KM,
  RADIUS_OPTIONS_KM,
  getOfficeServiceKey,
  isValidCoordinate,
} from "@/lib/nearby";
import type { NearbyOrigin } from "@/lib/types";
import { NearbyOfficesView } from "@/components/nearby/NearbyOfficesView";
import { NearbyIntro } from "@/components/nearby/FindNearbyOffices";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";

export async function generateMetadata(
  props: PageProps<"/services/[slug]/nearby-offices">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };
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
  if (!service || !serviceKey) notFound();

  // ---- Parse location from the URL (validated before use) -------------
  let origin: NearbyOrigin | null = null;
  let radiusKm = DEFAULT_RADIUS_KM;

  const rawLat = typeof sp?.lat === "string" ? Number(sp.lat) : NaN;
  const rawLng = typeof sp?.lng === "string" ? Number(sp.lng) : NaN;
  const rawDistrict =
    typeof sp?.district === "string" ? sp.district.trim() : "";
  const rawUpazila = typeof sp?.upazila === "string" ? sp.upazila.trim() : "";
  const rawRadius = typeof sp?.radius === "string" ? Number(sp.radius) : NaN;

  if ((RADIUS_OPTIONS_KM as readonly number[]).includes(rawRadius)) {
    radiusKm = rawRadius;
  }

  if (isValidCoordinate(rawLat, rawLng)) {
    origin = { mode: "gps", lat: rawLat, lng: rawLng };
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
          {
            label: { bn: service.name, en: service.name },
            href: `/services/${service.slug}`,
          },
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
        ) : (
          <NearbyIntro slug={slug} />
        )}
      </div>
    </>
  );
}
