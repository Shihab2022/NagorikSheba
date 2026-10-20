import type { Metadata } from "next";
import { AiAssistantView } from "./AiAssistantView";

export const metadata: Metadata = {
  title: "AI Assistant",
  description: "Ask NagorikSheba AI about government services, documents, eligibility and procedures.",
};

export default function AiPage() {
  return <AiAssistantView />;
}
