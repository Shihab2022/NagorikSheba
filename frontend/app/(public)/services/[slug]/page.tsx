import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSingleService } from "@/service/service";
import { getLatestNotices } from "@/service/notices";
import { mapBackendServiceToFrontend } from "@/lib/service-adapter";
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
    // API fetch failed or network error
  }

  return null;
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

  const noticesRes = service.category
    ? await getLatestNotices({ slug: service.category, limit: 5 }).catch(() => ({ success: false, data: [] }))
    : { success: false, data: [] };

  const notices = noticesRes.data || [];

  return (
    <>
      <SvcHeader service={service} />
      <SvcBody service={service} notices={notices} />
    </>
  );
}
