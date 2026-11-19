import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OFFICES, getOfficeById } from "@/lib/data/offices";
import { OfficeBody } from "./OfficeBody";

export function generateStaticParams() {
  return OFFICES.map((o) => ({ id: o.id }));
}

type OfficeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  props: OfficeDetailPageProps,
): Promise<Metadata> {
  const { id } = await props.params;
  const office = getOfficeById(id);
  if (!office) return { title: "Office not found" };
  return { title: office.name, description: `${office.typeLabel} — ${office.address}` };
}

export default async function OfficeDetailPage(props: OfficeDetailPageProps) {
  const { id } = await props.params;
  const office = getOfficeById(id);
  if (!office) notFound();
  return <OfficeBody id={id} />;
}

