import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSingleService, getAllServices } from "@/service/service";
import { mapBackendServiceToFrontend } from "@/lib/service-adapter";
import { SERVICES, getServiceBySlug } from "@/lib/data/services";
import type { GovernmentService } from "@/lib/types";
import { SvcHeader } from "./SvcHeader";
import { SvcBody } from "./SvcBody";

export const dynamic = "force-dynamic";

async function fetchService(slug: string): Promise<GovernmentService | null> {
  try {
    const res = await getSingleService(slug);
    if (res.success && res.data) {
      return mapBackendServiceToFrontend(res.data);
    }
  } catch {
    // Backend fetch failed, proceed to fallback
  }

  // Fallback to local service data if backend did not return the service
  const localService = getServiceBySlug(slug);
  return localService ?? null;
}

export async function generateStaticParams() {
  try {
    const res = await getAllServices({ limit: 100 });
    if (res.success && res.data && res.data.length > 0) {
      return res.data.map((s) => ({ slug: s.slug }));
    }
  } catch {
    // Backend failed, fallback to local dataset
  }
  return SERVICES.map((s) => ({ slug: s.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  props: PageProps,
): Promise<Metadata> {
  const { slug } = await props.params;
  const service = await fetchService(slug);
  if (!service) return { title: "Service not found" };
  return { title: service.name, description: service.description };
}

export default async function ServiceDetailPage(
  props: PageProps,
) {
  const { slug } = await props.params;
  const service = await fetchService(slug);
  if (!service) notFound();

  return (
    <>
      <SvcHeader service={service} />
      <SvcBody service={service} />
    </>
  );
}
