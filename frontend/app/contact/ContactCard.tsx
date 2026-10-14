"use client";
import type { LucideIcon } from "lucide-react";
import { useTranslation, type Dict } from "@/lib/i18n";
export function ContactCard({ icon: Icon, title, text }: { icon: LucideIcon; title: Dict<string>; text: Dict<string> }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="mt-3 text-sm font-extrabold text-slate-900">{t(title)}</h2>
      <p className="mt-1.5 text-sm leading-6 text-slate-500">{t(text)}</p>
    </div>
  );
}
