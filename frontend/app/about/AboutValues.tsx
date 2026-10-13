"use client";
import { Eye, HeartHandshake, Target } from "lucide-react";
import { useTranslation, type Dict } from "@/lib/i18n";
const ITEMS: { icon: typeof Eye; title: Dict<string>; text: Dict<string> }[] = [
  { icon: HeartHandshake, title: { bn: "নাগরিক আগে", en: "Citizens first" },
    text: { bn: "জটিল তথ্য সহজ ভাষায়।", en: "Complex government information explained in simple, respectful language anyone can follow." } },
  { icon: Target, title: { bn: "নির্ভুলতা", en: "Accuracy over speed" },
    text: { bn: "প্রতিটি এন্ট্রিতে অফিসিয়াল উৎস।", en: "Every entry links to its official source and carries a last-verified date for transparency." } },
  { icon: Eye, title: { bn: "স্বচ্ছতা", en: "Transparent by design" },
    text: { bn: "ডেমো ডেটা চিহ্নিত থাকে।", en: "Demo data is labelled as demo. We never pretend guidance is an official transaction." } },
];
export function AboutValues() {
  const { t } = useTranslation();
  return (
    <div className="mt-4 grid gap-5 sm:grid-cols-3">
      {ITEMS.map((v) => (
        <div key={v.title.en} className="rounded-2xl border border-line bg-white p-5 shadow-card">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <v.icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="mt-3 text-sm font-extrabold text-slate-900">{t(v.title)}</h3>
          <p className="mt-1.5 text-sm leading-6 text-slate-500">{t(v.text)}</p>
        </div>
      ))}
    </div>
  );
}
