"use client";
import { useTranslation } from "@/lib/i18n";
export function T({ bn, en }: { bn: string; en: string }) {
  const { lang } = useTranslation();
  return <>{lang === "bn" ? bn : en}</>;
}
export default T;
