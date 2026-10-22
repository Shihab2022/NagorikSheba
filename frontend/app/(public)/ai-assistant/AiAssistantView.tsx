"use client";

import { ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ChatWidget } from "@/components/ai/ChatWidget";
import { useTranslation } from "@/lib/i18n";

const STRINGS = {
  bn: {
    title: "সরকারি সেবা বুঝতে সাহায্য দরকার?",
    description:
      "সরকারি সেবা, প্রয়োজনীয় ডকুমেন্ট, যোগ্যতা ও প্রক্রিয়া সম্পর্কে প্রশ্ন করুন।",
    home: "হোম",
    aiAssistant: "এআই সহকারী",
    prototypeDemo: "প্রোটোটাইপ ডেমো:",
    prototypeBody:
      "উত্তরগুলো ডেমো ডেটা থেকে তৈরি করা হয়। কাজ করার আগে সর্বদা অফিসিয়াল উৎস থেকে যাচাই করুন।",
  },
  en: {
    title: "Need help understanding government services?",
    description:
      "Ask questions about government services, required documents, eligibility and procedures.",
    home: "Home",
    aiAssistant: "AI Assistant",
    prototypeDemo: "Prototype demo:",
    prototypeBody:
      "answers are generated from mock data. Always verify against the official source before acting.",
  },
};

export function AiAssistantView() {
  const { t } = useTranslation();
  const s = t(STRINGS);
  return (
    <>
      <PageHeader
        title={s.title}
        description={s.description}
        breadcrumbs={[{ label: s.home, href: "/" }, { label: s.aiAssistant }]}
      />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <ChatWidget />
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span><strong className="font-semibold">{s.prototypeDemo}</strong> {s.prototypeBody}</span>
        </p>
      </div>
    </>
  );
}

export default AiAssistantView;
