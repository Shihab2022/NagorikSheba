import type { Metadata } from "next";
import { RegisterView } from "./RegisterView";

export const metadata: Metadata = { title: "Create account", description: "Create your NagorikSheba account." };

export default function RegisterPage() {
  return <RegisterView />;
}
