import type { Metadata } from "next";
import { LoginView } from "./LoginView";

export const metadata: Metadata = { title: "Login", description: "Log in to your NagorikSheba account." };

export default function LoginPage() {
  return <LoginView />;
}
