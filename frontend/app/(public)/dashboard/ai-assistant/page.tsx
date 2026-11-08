import type { Metadata } from "next";
import { getMe } from "@/service/auth";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { UserSidebar } from "@/components/dashboard/layout/UserSidebar";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { ChatWidget } from "@/components/ai/ChatWidget";

export const metadata: Metadata = {
  title: "Citizen AI Assistant | Dashboard",
  description: "Ask questions about government services, documents, eligibility and procedures.",
};

export default async function DashboardAiAssistantPage() {
  const meRes = await getMe();
  const user = meRes.success ? meRes.data : null;

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={{ bn: "নাগরিক এআই সহকারী", en: "Citizen AI Assistant" }}
          description={{
            bn: "সরকারি সেবা, প্রয়োজনীয় ডকুমেন্ট, আবেদনের ধাপ ও নিয়মাবলী সম্পর্কে সরাসরি প্রশ্ন করুন।",
            en: "Ask questions about civic procedures, documentation checklists, and application steps.",
          }}
          breadcrumbs={[
            { label: { bn: "হোম", en: "Home" }, href: "/" },
            { label: { bn: "ড্যাশবোর্ড", en: "Dashboard" }, href: "/dashboard" },
            { label: { bn: "এআই সহকারী", en: "AI Assistant" } },
          ]}
        />
      }
      sidebar={<UserSidebar user={user} />}
    >
      <div className="w-full">
        <ChatWidget />
      </div>
    </DashboardShell>
  );
}
