"use client";

import { Logo } from "@/components/ui/Logo";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useTranslation } from "@/lib/i18n";

const STRINGS = {
  bn: {
    title: "আপনার নাগরিক সেবা অ্যাকাউন্ট তৈরি করুন",
    subtitle: "সম্পূর্ণ বিনামূল্যে। সেবা সংরক্ষণ, আবেদন ট্র্যাক, আপডেট পান।",
    prototype: "শুধুমাত্র প্রোটোটাইপ — অথেনটিকেশন এখনো সংযুক্ত হয়নি।",
  },
  en: {
    title: "Create your NagorikSheba account",
    subtitle: "Free forever. Save services, track applications, get updates.",
    prototype: "Prototype only — authentication is not connected yet.",
  },
};

export function RegisterView() {
  const { t } = useTranslation();
  const s = t(STRINGS);
  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-12 sm:py-16">
      <div className="flex justify-center">
        <Logo />
      </div>
      <h1 className="mt-6 text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">
        {s.title}
      </h1>
      <p className="mt-2 text-center text-sm text-slate-500">{s.subtitle}</p>
      <RegisterForm />
      <p className="mt-4 text-center text-xs text-slate-400">{s.prototype}</p>
    </div>
  );
}

export default RegisterView;
