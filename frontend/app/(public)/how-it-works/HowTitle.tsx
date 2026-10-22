"use client";
import { useTranslation, type Dict } from "@/lib/i18n";
export function HowTitle({ title }: { title: Dict<string> }) {
  const { t } = useTranslation();
  return <>{t(title)}</>;
}
