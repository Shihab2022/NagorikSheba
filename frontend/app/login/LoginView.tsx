"use client";

import { Logo } from "@/components/ui/Logo";
import { LoginForm } from "@/components/auth/LoginForm";
import { useTranslation } from "@/lib/i18n";
import { ShieldCheck } from "lucide-react";

const STRINGS = {
  bn: {
    title: "আপনার নাগরিক সেবার যাত্রা এখান থেকেই",
    trust: "সহজ তথ্য • নির্ভরযোগ্য লিংক • বাংলা ও ইংরেজি",
    formTitle: "আবার স্বাগতম!",
    formSubtitle: "আপনার অ্যাকাউন্টে লগইন করে সেবা ব্যবহার চালিয়ে যান।",
    prototype: "প্রোটোটাইপ — অথেনটিকেশন এখনো সংযুক্ত হয়নি।",
  },
  en: {
    title: "Your government service journey starts here",
    trust: "Simple information • Official links • Bangla and English",
    formTitle: "Welcome back!",
    formSubtitle: "Log in to your account to continue accessing services.",
    prototype: "Prototype only — authentication is not connected yet.",
  },
};

export function LoginView() {
  const { t } = useTranslation();
  const s = t(STRINGS);

  return (
    <div className="mx-auto grid min-h-[calc(100svh-2rem)] w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 py-8 md:grid-cols-2 md:gap-16 lg:px-8">
      {/* Left Side */}
      <section className="flex flex-col items-center text-center md:items-start md:text-left">
        {/* <Logo />
 */}
        <h1 className="mt-8 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
          {s.title}
        </h1>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-2xl">
            {s.formTitle}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {s.formSubtitle}
          </p>
          <p className="mt-4 text-center text-xs leading-5 text-slate-400">
            {s.prototype}
          </p>

          <div className="mt-8 flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span>{s.trust}</span>
          </div>
        </div>
      </section>

      {/* Right Side: Login Form */}
      <section className="mx-auto w-full max-w-md">
        <LoginForm />
      </section>
    </div>
  );
}

export default LoginView;
