import type { Metadata } from "next";
import { FeesView } from "./FeesView";
import { getAllServices } from "@/service/service";
import { mapBackendServiceToFrontend } from "@/lib/service-adapter";
import type { GovernmentService } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fee Guide",
  description: "Indicative government fees for popular Bangladesh services — always verify with the official source.",
};

export default async function FeesPage() {
  let services: GovernmentService[] = [];

  try {
    const res = await getAllServices({ limit: 50 });
    if (res?.success && Array.isArray(res.data)) {
      services = res.data.map(mapBackendServiceToFrontend);
    }
  } catch {
    services = [];
  }

  return <FeesView services={services} />;
}
