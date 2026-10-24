import type { Metadata } from "next";
import { FeesView } from "./FeesView";

export const metadata: Metadata = {
  title: "Fee Guide",
  description: "Indicative government fees for popular Bangladesh services — always verify with the official source.",
};

export default function FeesPage() {
  return <FeesView />;
}
