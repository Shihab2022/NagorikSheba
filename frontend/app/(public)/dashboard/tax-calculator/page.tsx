import type { Metadata } from "next";
import { getMe } from "@/service/auth";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import { UserSidebar } from "@/components/dashboard/layout/UserSidebar";
import { IncomeTaxCalculatorView } from "@/app/(public)/income-tax-calculator/IncomeTaxCalculatorView";

export const metadata: Metadata = {
  title: "Income Tax Calculator | Dashboard | NagorikSheba",
  description:
    "জাতীয় রাজস্ব বোর্ড (NBR) আয়কর আইন ২০২৩ অনুযায়ী করযোগ্য আয় ও প্রদেয় কর নিরূপণ করুন।",
};

export default async function DashboardTaxCalculatorPage() {
  const meRes = await getMe();
  const user = meRes.success ? meRes.data : null;

  return (
    <DashboardShell
      header={
        <TranslatedPageHeader
          title={{
            bn: "আয়কর ক্যালকুলেটর",
            en: "Income Tax Calculator",
          }}
          description={{
            bn: "জাতীয় রাজস্ব বোর্ড (NBR) আয়কর আইন ২০২৩ অনুযায়ী আপনার কর ও রেয়াত নিরূপণ করুন।",
            en: "Calculate your annual tax liability, investment rebate, and net payable tax under NBR guidelines.",
          }}
          breadcrumbs={[
            { label: { bn: "হোম", en: "Home" }, href: "/" },
            { label: { bn: "ড্যাশবোর্ড", en: "Dashboard" }, href: "/dashboard" },
            { label: { bn: "আয়কর ক্যালকুলেটর", en: "Income Tax Calculator" } },
          ]}
        />
      }
      sidebar={<UserSidebar user={user} />}
    >
      <IncomeTaxCalculatorView hideHeader />
    </DashboardShell>
  );
}

