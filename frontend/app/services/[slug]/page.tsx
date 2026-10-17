import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES, getServiceBySlug } from "@/lib/data/services";
import { SvcHeader } from "./SvcHeader";
import { SvcBody } from "./SvcBody";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
  props: PageProps<"/services/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };
  return { title: service.name, description: service.description };
}

export default async function ServiceDetailPage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  return (
    <>
      <SvcHeader slug={slug} />
      <SvcBody slug={slug} />
    </>
  );
}
