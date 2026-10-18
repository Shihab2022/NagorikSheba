"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Sparkles,
  UserRound,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslation } from "@/lib/i18n";

const STRINGS = {
  bn: {
    eyebrow: "এআই সহকারী",
    title: "সরকারি সেবা বুঝতে সাহায্য দরকার?",
    description:
      "সরকারি সেবা, প্রয়োজনীয় ডকুমেন্ট, যোগ্যতা ও প্রক্রিয়া সম্পর্কে প্রশ্ন করুন।",
    askAi: "নাগরিক সেবা এআই-এ জিজ্ঞাসা করুন",
    demoNote: "ডেমো উত্তর — অফিসিয়াল উৎস থেকে যাচাই করুন",
    disclaimer:
      "এআই উত্তরগুলো তৈরি করা নির্দেশনা। কাজ করার আগে সর্বদা সরকারি উৎস থেকে তথ্য যাচাই করুন।",
    online: "● অনলাইন — ডেমো",
    userMsg: "আমি কীভাবে পাসপোর্ট নবায়ন করতে পারি?",
    aiMsgIntro: "আপনি পাসপোর্ট নবায়ন করতে পারেন",
    aiMsgService: "ই-পাসপোর্ট রি-ইস্যু",
    aiMsgAfter: " সেবার মাধ্যমে। প্রয়োজনীয় ডকুমেন্ট:",
    doc1: "• বর্তমান পাসপোর্ট (মূল)",
    doc2: "• এনআইডি কার্ড",
    doc3: "• ব্যাংক পেমেন্ট রসিদ",
    portal: "অফিসিয়াল পোর্টাল: epassport.gov.bd — ফি সেখানে যাচাই করুন।",
    typing: "নাগরিক সেবা এআই টাইপ করছে…",
    askPlaceholder: "যেকোনো সরকারি সেবা সম্পর্কে জিজ্ঞাসা করুন…",
  },
  en: {
    eyebrow: "AI assistant",
    title: "Need help understanding government services?",
    description:
      "Ask questions about government services, required documents, eligibility and procedures.",
    askAi: "Ask NagorikSheba AI",
    demoNote: "Demo responses — verify with official sources",
    disclaimer:
      "AI answers are generated guidance. Always verify information against official government sources before acting.",
    online: "● Online — demo",
    userMsg: "How can I renew my passport?",
    aiMsgIntro: "You can renew your passport through the ",
    aiMsgService: "e-Passport re-issue",
    aiMsgAfter: " service. Required documents:",
    doc1: "• Current passport (original)",
    doc2: "• NID card",
    doc3: "• Bank payment receipt",
    portal: "Official portal: epassport.gov.bd — verify fees there.",
    typing: "NagorikSheba AI is typing…",
    askPlaceholder: "Ask about any government service…",
  },
};

/**
 * AI assistant promo with a static chat preview.
 * CTA leads to the demo chat page (/ai-assistant).
 */
export function AIAssistant() {
  const { t } = useTranslation();
  const s = t(STRINGS);
  return (
    <section aria-labelledby="ai-heading" className="bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal>
            <SectionHeading
              id="ai-heading"
              align="left"
              eyebrow={s.eyebrow}
              title={s.title}
              description={s.description}
            />
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/ai-assistant"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md"
              >
                {s.askAi}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <Sparkles
                  className="h-3.5 w-3.5 text-flag-500"
                  aria-hidden="true"
                />
                {s.demoNote}
              </span>
            </div>

            <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
                aria-hidden="true"
              />
              <p className="text-xs leading-5 text-amber-800">{s.disclaimer}</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="relative rounded-3xl border border-line bg-canvas p-5 shadow-card sm:p-7">
              <span
                className="absolute -top-3 right-6 h-6 w-6 rounded-full bg-flag-500 shadow"
                aria-hidden="true"
              />

              <div className="flex items-center gap-2.5 border-b border-line pb-4">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <Bot className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    NagorikSheba AI
                  </p>
                  <p className="text-[11px] font-medium text-brand-600">
                    {s.online}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex justify-end">
                  <div className="flex max-w-[85%] items-start gap-2">
                    <div className="rounded-2xl rounded-tr-sm bg-brand-600 px-4 py-3 text-sm leading-6 text-white">
                      {s.userMsg}
                    </div>
                    <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                      <UserRound className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                    <Bot className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-line bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm">
                    {s.aiMsgIntro}
                    <strong className="text-brand-700">{s.aiMsgService}</strong>
                    {s.aiMsgAfter}
                    <ul className="mt-2 space-y-1 text-slate-600">
                      <li>{s.doc1}</li>
                      <li>{s.doc2}</li>
                      <li>{s.doc3}</li>
                    </ul>
                    <p className="mt-2 text-xs text-slate-400">{s.portal}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-9">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:300ms]" />
                  </span>
                  <span className="text-[11px] text-slate-400">{s.typing}</span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-3">
                <span className="flex-1 text-sm text-slate-400">
                  {s.askPlaceholder}
                </span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default AIAssistant;
