import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { getSingleService, getAllServices } from "@/service/service";
import { mapBackendServiceToFrontend } from "@/lib/service-adapter";
import type { GovernmentService } from "@/lib/types";
import { SvcHeader } from "./SvcHeader";
import { SvcBody } from "./SvcBody";

export const dynamic = "force-dynamic";

async function fetchService(slug: string): Promise<GovernmentService | null> {
  const res = await getSingleService(slug);
  if (res.success && res.data) {
    return mapBackendServiceToFrontend(res.data);
  }
  return null;
}

export async function generateStaticParams() {
  const res = await getAllServices({ limit: 100 });
  if (res.success && res.data) {
    return res.data.map((s) => ({ slug: s.slug }));
  }
  return [];
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
