"use client";

import { Logo } from "@/components/ui/Logo";
import { LoginForm } from "@/components/auth/LoginForm";
import { useTranslation } from "@/lib/i18n";

const STRINGS = {
  bn: {
    title: "ফিরে আসুন",
    subtitle: "সেবা সংরক্ষণ ও আবেদন ট্র্যাক করতে লগইন করুন।",
    prototype: "শুধুমাত্র প্রোটোটাইপ — অথেনটিকেশন এখনো সংযুক্ত হয়নি।",
  },
  en: {
    title: "Welcome back",
    subtitle: "Log in to save services and track applications.",
    prototype: "Prototype only — authentication is not connected yet.",
  },
};

export function LoginView() {
  const { t } = useTranslation();
  const s = t(STRINGS);
  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-12 sm:py-16">
      <div className="flex justify-center"><Logo /></div>
      <h1 className="mt-6 text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">{s.title}</h1>
      <p className="mt-2 text-center text-sm text-slate-500">{s.subtitle}</p>
      <LoginForm />
      <p className="mt-4 text-center text-xs text-slate-400">{s.prototype}</p>
    </div>
  );
}

export default LoginView;
