"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SuccessNote } from "@/components/ui/States";
import { useTranslation, type Dict } from "@/lib/i18n";

const TOPICS: { value: string; label: Dict<string> }[] = [
  { value: "report-info", label: { bn: "ভুল তথ্য জানান", en: "Report incorrect information" } },
  { value: "suggest-service", label: { bn: "সেবার প্রস্তাব দিন", en: "Suggest a service" } },
  { value: "broken-link", label: { bn: "ভাঙা অফিসিয়াল লিংক জানান", en: "Report broken official link" } },
  { value: "feedback", label: { bn: "সাধারণ মতামত", en: "General feedback" } },
];

const STRINGS = {
  bn: {
    formLabel: "যোগাযোগ ফর্ম",
    name: "নাম",
    namePlaceholder: "আপনার নাম",
    email: "ইমেইল",
    emailPlaceholder: "you@example.com",
    subject: "বিষয়",
    message: "বার্তা",
    messagePlaceholder:
      "কোন পাতায় সমস্যাটি হয়েছে এবং কী পরিবর্তন হওয়া উচিত তা আমাদের জানান…",
    sendMessage: "বার্তা পাঠান",
    thankYou:
      "ধন্যবাদ — আপনার বার্তা নোট করা হয়েছে। এটি একটি ইউআই প্রোটোটাইপ, তাই এখনো কোনো সার্ভারে পাঠানো হয়নি।",
  },
  en: {
    formLabel: "Contact form",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@example.com",
    subject: "Subject",
    message: "Message",
    messagePlaceholder:
      "Tell us which page the issue is on and what should change...",
    sendMessage: "Send message",
    thankYou:
      "Thank you — your message has been noted. This is a UI prototype, so nothing was sent to a server yet.",
  },
};

export function ContactForm() {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState(TOPICS[0].value);

  return sent ? (
    <SuccessNote>{s.thankYou}</SuccessNote>
  ) : (
    <form
      onSubmit={(e) => { e.preventDefault(); setSent(true); }}
      className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-7"
      aria-label={s.formLabel}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-sm font-bold text-slate-700">{s.name}</label>
          <input id="cf-name" required autoComplete="name" placeholder={s.namePlaceholder}
            className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-sm font-bold text-slate-700">{s.email}</label>
          <input id="cf-email" type="email" required autoComplete="email" placeholder={s.emailPlaceholder}
            className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="cf-subject" className="mb-1.5 block text-sm font-bold text-slate-700">{s.subject}</label>
        <select id="cf-subject" value={topic} onChange={(e) => setTopic(e.target.value)}
          className="h-12 w-full rounded-xl border border-line bg-canvas px-4 text-sm font-medium text-slate-700 focus:border-brand-500 focus:outline-none">
          {TOPICS.map((topic2) => (<option key={topic2.value} value={topic2.value}>{t(topic2.label)}</option>))}
        </select>
      </div>
      <div className="mt-4">
        <label htmlFor="cf-msg" className="mb-1.5 block text-sm font-bold text-slate-700">{s.message}</label>
        <textarea id="cf-msg" required rows={5} placeholder={s.messagePlaceholder}
          className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm leading-6 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
      </div>
      <Button type="submit" className="mt-5 w-full sm:w-auto">
        <Send className="h-4 w-4" aria-hidden="true" /> {s.sendMessage}
      </Button>
    </form>
  );
}

export default ContactForm;
