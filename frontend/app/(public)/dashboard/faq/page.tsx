import type { Metadata } from "next";
import { getMe } from "@/service/auth";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { UserSidebar } from "@/components/dashboard/layout/UserSidebar";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { DashboardFaqView } from "./DashboardFaqView";

export const metadata: Metadata = {
  title: "Help & FAQ | Dashboard",
  description: "Frequently asked questions and citizen support inside the dashboard.",
};

export default async function DashboardFaqPage() {
  const meRes = await getMe();
  const user = meRes.success ? meRes.data : null;

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={{ bn: "সাহায্য ও সাধারণ জিজ্ঞাসা", en: "Help & Frequently Asked Questions" }}
          description={{
            bn: "নাগরিক সেবা গ্রহণ, অনলাইন ট্র্যাকিং, অ্যাকাউন্ট ও তথ্যের নির্ভুলতা নিয়ে জরুরি প্রশ্নোত্তর।",
            en: "Answers to common citizen questions about procedures, tracking and service guidelines.",
          }}
          breadcrumbs={[
            { label: { bn: "হোম", en: "Home" }, href: "/" },
            { label: { bn: "ড্যাশবোর্ড", en: "Dashboard" }, href: "/dashboard" },
            { label: { bn: "FAQ", en: "FAQ" } },
          ]}
        />
      }
      sidebar={<UserSidebar user={user} />}
    >
      <DashboardFaqView />
    </DashboardShell>
  );
}
