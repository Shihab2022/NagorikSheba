"use client";
import { AlertTriangle, Lightbulb, Link2Off, MessageSquare, type LucideIcon } from "lucide-react";
import { useTranslation, type Dict } from "@/lib/i18n";

const ICONS: Record<string, LucideIcon> = {
  AlertTriangle,
  Lightbulb,
  Link2Off,
  MessageSquare,
};

export function ContactCard({ icon: iconName, title, text }: { icon: string; title: Dict<string>; text: Dict<string> }) {
  const Icon = ICONS[iconName];
import { Icon } from "@/components/ui/Icon";
import { useTranslation, type Dict } from "@/lib/i18n";
export function ContactCard({ icon, title, text }: { icon: string; title: Dict<string>; text: Dict<string> }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <h2 className="mt-3 text-sm font-extrabold text-slate-900">{t(title)}</h2>
      <p className="mt-1.5 text-sm leading-6 text-slate-500">{t(text)}</p>
    </div>
  );
}
