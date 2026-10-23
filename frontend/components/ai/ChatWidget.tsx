"use client";
import { useRef, useState } from "react";
import { Bot, SendHorizonal, User } from "lucide-react";
import { SERVICES } from "@/lib/data/services";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useTranslation, type Dict } from "@/lib/i18n";

type Msg = { role: "user" | "ai"; text: string };

const STARTERS: Dict<string>[] = [
  { bn: "পাসপোর্ট কীভাবে নবায়ন করব?", en: "How can I renew my passport?" },
  {
    bn: "NID সংশোধনে কী কী ডকুমেন্ট লাগবে?",
    en: "What documents do I need for NID correction?",
  },
  {
    bn: "ড্রাইভিং লাইসেন্সের ফি কত?",
    en: "How much is the driving licence fee?",
  },
];

const STRINGS = {
  bn: {
    subtitle: "ডেমো সহকারী · উত্তর অফিসিয়াল উৎসে যাচাই করুন",
    chatLabel: "চ্যাট বার্তা",
    inputLabel: "সরকারি সেবা সম্পর্কে জিজ্ঞাসা করুন",
    placeholder: "ডকুমেন্ট, ফি, ধাপ সম্পর্কে জিজ্ঞাসা করুন…",
    send: "বার্তা পাঠান",
    greetingUser: "পাসপোর্ট কীভাবে নবায়ন করব?",
    greetingAi:
      "আপনি ই-পাসপোর্ট সেবার মাধ্যমে পাসপোর্ট নবায়ন করতে পারেন। আপনার এনআইডি, আগের পাসপোর্ট, পেমেন্ট রসিদ ও ছবি লাগবে। সম্পূর্ণ ধাপের জন্য ই-পাসপোর্ট সেবার পাতাটি খুলুন — এবং আবেদনের আগে অফিসিয়াল পোর্টালে সবকিছু যাচাই করুন।",
    hitAnswer:
      "আপনি {authority} এর মাধ্যমে {name} এর জন্য আবেদন করতে পারেন।{docs}ফি: {fee}। প্রক্রিয়াকরণ: {time}। সম্পূর্ণ ধাপের জন্য সেবার পাতাটি খুলুন — এবং আবেদনের আগে অফিসিয়াল পোর্টালে সর্বদা যাচাই করুন।",
    keyDocs: "প্রয়োজনীয় ডকুমেন্ট: {docs}। ",
    fallback:
      "প্রশ্নের জন্য ধন্যবাদ! পূর্ণাঙ্গ সংস্করণে আমি যাচাইকৃত সেবা নির্দেশিকা থেকে উত্তর দেব। এখন পাসপোর্ট, এনআইডি, ড্রাইভিং লাইসেন্স বা জমির নামজারি সম্পর্কে জিজ্ঞাসা করুন — এবং উত্তর সর্বদা অফিসিয়াল উৎসে যাচাই করুন।",
    defaultFee: "দেখুন অফিসিয়াল উৎস",
    varies: "বিভিন্ন",
  },
  en: {
    subtitle: "Demo assistant · verify answers officially",
    chatLabel: "Chat messages",
    inputLabel: "Ask about a government service",
    placeholder: "Ask about documents, fees, steps...",
    send: "Send message",
    greetingUser: "How can I renew my passport?",
    greetingAi:
      "You can renew your passport through the e-Passport service. You will need your NID, previous passport, payment receipt and a photograph. Open the e-Passport service page for the full steps — and verify everything on the official portal.",
    hitAnswer:
      "You can apply for {name} through {authority}.{docs}Fee: {fee}. Processing: {time}. Open the service page for full steps — and always verify on the official portal before applying.",
    keyDocs: "Key documents: {docs}. ",
    fallback:
      "Thanks for asking! In the full version I will answer from verified service guides. For now, try asking about passports, NID, driving licences or land mutation — and always verify answers against the official source.",
    defaultFee: "see official source",
    varies: "varies",
  },
};

function demoAnswer(q: string, s: (typeof STRINGS)["en"]): string {
  const lower = q.toLowerCase();
  const hit = SERVICES.find(
    (sv) =>
      lower.includes(sv.name.toLowerCase().split(" ")[0]) ||
      sv.name
        .toLowerCase()
        .split(" ")
        .some((w) => w.length > 3 && lower.includes(w)),
  );
  if (hit) {
    const docs = (hit.requiredDocuments ?? []).slice(0, 3).join("; ");
    return s.hitAnswer
      .replace("{name}", hit.name)
      .replace("{authority}", hit.authority ?? hit.department)
      .replace("{docs}", docs ? s.keyDocs.replace("{docs}", docs) : "")
      .replace("{fee}", hit.fee ?? s.defaultFee)
      .replace("{time}", hit.processingTime ?? s.varies);
  }
  return s.fallback;
}

export function ChatWidget() {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "user", text: s.greetingUser },
    { role: "ai", text: s.greetingAi },
  ]);
  const [input, setInput] = useState("");
  const bottom = useRef<HTMLDivElement>(null);

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    setMsgs((m) => [
      ...m,
      { role: "user", text: q },
      { role: "ai", text: demoAnswer(q, s) },
    ]);
    setInput("");
    window.setTimeout(
      () =>
        bottom.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        }),
      50,
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="flex items-center gap-3 border-b border-line bg-brand-800 px-5 py-4 text-white">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
          <Bot className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-extrabold">NagorikSheba AI</p>
          <p className="text-xs text-brand-200">{s.subtitle}</p>
        </div>
      </div>
      <div
        className="max-h-[380px] space-y-3 overflow-y-auto bg-canvas px-4 py-5 sm:px-5"
        role="log"
        aria-label={s.chatLabel}
        aria-live="polite"
      >
        {msgs.map((m, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2.5",
              m.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            {m.role === "ai" ? (
              <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </span>
            ) : null}
            <p
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-6",
                m.role === "user"
                  ? "rounded-br-md bg-brand-600 text-white"
                  : "rounded-bl-md border border-line bg-white text-slate-700",
              )}
            >
              {m.text}
            </p>
            {m.role === "user" ? (
              <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                <User className="h-4 w-4" aria-hidden="true" />
              </span>
            ) : null}
          </div>
        ))}
        <div ref={bottom} />
      </div>
      <div className="border-t border-line p-3 sm:p-4">
        <div className="mb-2.5 flex flex-wrap gap-2">
          {STARTERS.map((starter) => (
            <button
              key={starter.en}
              type="button"
              onClick={() => send(t(starter))}
              className="rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              {t(starter)}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <label htmlFor="ai-input" className="sr-only">
            {s.inputLabel}
          </label>
          <input
            id="ai-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={s.placeholder}
            className="h-11 flex-1 rounded-xl border border-line bg-canvas px-4 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
          <Button type="submit" size="icon" aria-label={s.send}>
            <SendHorizonal className="h-[18px] w-[18px]" aria-hidden="true" />
          </Button>
        </form>
      </div>
    </div>
  );
}
export default ChatWidget;
