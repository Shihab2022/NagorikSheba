import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMe } from "@/service/auth";

export const metadata: Metadata = {
  title: {
    template: "%s | NagorikSheba Admin",
    default: "Admin Panel | NagorikSheba",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const meRes = await getMe();

  if (!meRes.success || !meRes.data) {
    redirect("/login");
  }

  if (meRes.data.role?.toUpperCase() !== "ADMIN") {
    redirect("/dashboard");
  }

  return <div className="min-h-screen bg-canvas/30">{children}</div>;
}
