import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { T } from "@/components/ui/T";
import { HowPhases } from "./HowPhases";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Discover, understand, prepare, apply and track — how NagorikSheba guides you to the right official government service.",
};

export default function HowItWorksPage() {
  return (
    <>
      <TranslatedPageHeader
        title={{ bn: "কীভাবে কাজ করে?", en: "How It Works" }}
        description={{
          bn: "পাঁচটি সহজ ধাপ — খুঁজুন, বুঝুন, প্রস্তুতি, আবেদন, ট্র্যাক।",
          en: "Five simple phases take you from a confusing government process to a confident application — Discover, Understand, Prepare, Apply, Track.",
        }}
        breadcrumbs={[{ label: { bn: "হোম", en: "Home" }, href: "/" }, { label: { bn: "কীভাবে কাজ করে", en: "How It Works" } }]}
      />
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <HowPhases />

        <div className="relative mt-12 overflow-hidden rounded-3xl bg-brand-800 px-6 py-10 text-center sm:px-10 sm:py-12">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-flag-500/25" aria-hidden="true" />
          <div className="pattern-grid-light absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl"><T bn="চেষ্টা করে দেখুন?" en="Ready to try it?" /></h2>
            <p className="mx-auto mt-2 max-w-xl text-[15px] leading-7 text-brand-100">
              <T bn="সবচেয়ে সাধারণ কাজ দিয়ে শুরু করুন — এখনই প্রয়োজনীয় সেবা খুঁজুন।" en="Start with the most common task — searching for the service you need right now." />
            </p>
            <Link
              href="/search"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-brand-800 shadow-card transition-colors hover:bg-brand-50"
            >
              <T bn="সেবা খুঁজুন" en="Search services" />
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
