
"use client";

import { Logo } from "@/components/ui/Logo";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useTranslation } from "@/lib/i18n";
import { SearchCheck, FileCheck, MapPin } from "lucide-react";
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
    <div className="mx-auto grid min-h-[calc(100svh-100px)] w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 py-8 md:grid-cols-2 md:gap-16 lg:px-8">
      {/* Left side: Logo and text */}
      <section className="flex flex-col items-center text-center md:items-start md:text-left">
        <Logo />

        <h1 className="mt-6 text-2xl font-extrabold text-slate-900 sm:text-3xl lg:text-4xl">
          {s.title}
        </h1>

        <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
          {s.subtitle}
        </p>

        <p className="mt-4 text-xs text-slate-400">
          {s.prototype}
        </p>



        <div className="mt-8 space-y-5">
  <div className="flex items-start gap-3">
    <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
      <SearchCheck className="h-5 w-5" />
    </div>
    <div>
      <h3 className="font-semibold text-slate-900">
        সহজে সরকারি সেবা খুঁজুন
      </h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">
        প্রয়োজনীয় সেবা, যোগ্যতা ও আবেদন পদ্ধতি এক জায়গায় জানুন।
      </p>
    </div>
  </div>

  <div className="flex items-start gap-3">
    <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
      <FileCheck className="h-5 w-5" />
    </div>
    <div>
      <h3 className="font-semibold text-slate-900">
        প্রয়োজনীয় কাগজপত্র আগে থেকেই জানুন
      </h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">
        আবেদন করার আগে প্রয়োজনীয় ডকুমেন্ট ও ফি সম্পর্কে জানুন।
      </p>
    </div>
  </div>

  <div className="flex items-start gap-3">
    <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
      <MapPin className="h-5 w-5" />
    </div>
    <div>
      <h3 className="font-semibold text-slate-900">
        সরকারি অফিসের তথ্য পান
      </h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">
        প্রাসঙ্গিক অফিস ও সরকারি ওয়েবসাইটের তথ্য খুঁজুন।
      </p>
    </div>
  </div>
</div>
      </section>

      {/* Right side: Register form */}
      <section className="mx-auto w-full max-w-md">
        <RegisterForm />
      </section>
    </div>
  );
}

export default RegisterView;
