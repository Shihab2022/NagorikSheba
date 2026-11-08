import type { Metadata } from "next";
import { getMe } from "@/service/auth";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { UserSidebar } from "@/components/dashboard/layout/UserSidebar";
import { FileManager } from "@/components/dashboard/files";

export const metadata: Metadata = {
  title: "My Files & Gallery | NagorikSheba",
  description: "Upload, view, organize, and download your documents, images, and PDF files.",
};

export default async function DashboardFilesPage() {
  const meRes = await getMe();
  const user = meRes.success ? meRes.data : null;

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={{
            bn: "আমার ফাইল ও গ্যালারি",
            en: "My Files & Gallery",
          }}
          description={{
            bn: "নাগরিক সেবায় ব্যবহৃত প্রয়োজনীয় ছবি ও পিডিএফ ফাইল আপলোড এবং সহজে ডাউনলোড করুন।",
            en: "Upload, preview, organize, and download your images and PDF documents easily.",
          }}
          breadcrumbs={[
            { label: { bn: "হোম", en: "Home" }, href: "/" },
            { label: { bn: "ড্যাশবোর্ড", en: "Dashboard" }, href: "/dashboard" },
            { label: { bn: "আমার ফাইল ও গ্যালারি", en: "My Files & Gallery" } },
          ]}
        />
      }
      sidebar={<UserSidebar user={user} />}
    >
      <FileManager user={user} />
    </DashboardShell>
  );
}

