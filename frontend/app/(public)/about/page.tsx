import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { AboutValues } from "./AboutValues";
import { T } from "@/components/ui/T";

export const metadata: Metadata = {
  title: "About",
  description: "What NagorikSheba is, our mission and vision, and how we help citizens navigate government services.",
};

export default function AboutPage() {
  return (
    <>
      <TranslatedPageHeader
        title={{ bn: "নাগরিকসেবা কী?", en: "What is NagorikSheba?" }}
        description={{
          bn: "একটি স্বাধীন প্ল্যাটফর্ম যা নাগরিকদের সরকারি সেবা খুঁজতে ও বুঝতে সাহায্য করে।",
          en: "An independent civic-tech platform that helps citizens discover, understand and reach official government services.",
        }}
        breadcrumbs={[
          { label: { bn: "হোম", en: "Home" }, href: "/" },
          { label: { bn: "পরিচিতি", en: "About" } },
        ]}
      />
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section aria-labelledby="about-mission" className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-7">
            <h2 id="about-mission" className="text-lg font-extrabold text-slate-900"><T bn="আমাদের লক্ষ্য" en="Our Mission" /></h2>
            <p className="mt-2 text-[15px] leading-7 text-slate-600">
              <T bn="বাংলাদেশের প্রতিটি সরকারি সেবা খুঁজে পাওয়া সহজ করা — যাতে কেউ বিভ্রান্ত হয়ে হাল না ছাড়েন।" en="Make every Bangladesh government service discoverable and understandable — so no citizen gives up because a process felt too confusing." />
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-7">
            <h2 className="text-lg font-extrabold text-slate-900"><T bn="আমাদের স্বপ্ন" en="Our Vision" /></h2>
            <p className="mt-2 text-[15px] leading-7 text-slate-600">
              <T bn="এমন বাংলাদেশ যেখানে যেকোনো ফোন থেকে কয়েক মিনিটে সঠিক সেবা পাওয়া যাবে।" en="A Bangladesh where any citizen, on any phone, can find the right service, prepare the right documents, and reach the right office in minutes." />
            </p>
          </div>
        </section>

        <section aria-labelledby="about-how" className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
          <h2 id="about-how" className="text-lg font-extrabold text-slate-900"><T bn="আমরা কীভাবে কাজ করি" en="How We Work" /></h2>
          <ol className="mt-4 space-y-3 text-[15px] leading-7 text-slate-600">
            <li className="flex gap-3"><span className="font-extrabold text-brand-700">1.</span> <T bn="সম্পাদকরা অফিসিয়াল পোর্টাল ও নোটিশ পড়েন।" en="Editors study official portals, gazettes and office notices." /></li>
            <li className="flex gap-3"><span className="font-extrabold text-brand-700">2.</span> <T bn="সহজ বাংলা ও ইংরেজিতে চেকলিস্টসহ লিখি।" en="We rewrite procedures in plain Bangla and English with checklists." /></li>
            <li className="flex gap-3"><span className="font-extrabold text-brand-700">3.</span> <T bn="প্রতিটি এন্ট্রিতে অফিসিয়াল লিংক থাকে।" en="Each entry links to the official portal where the real application happens." /></li>
            <li className="flex gap-3"><span className="font-extrabold text-brand-700">4.</span> <T bn="নাগরিকরা ভুল জানালে সংশোধন করা হয়।" en="Citizens report errors so entries stay accurate over time." /></li>
          </ol>
        </section>

        <section aria-labelledby="about-why" className="mt-8">
          <h2 id="about-why" className="text-lg font-extrabold text-slate-900"><T bn="সঠিক তথ্য কেন জরুরি" en="Why accurate government information matters" /></h2>
          <AboutValues />
        </section>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <p className="text-[15px] leading-7 font-medium text-amber-900">
            <T bn="নাগরিকসেবা সরকারি ওয়েবসাইটের বিকল্প নয়। সেবা সবসময় অফিসিয়াল কর্তৃপক্ষই দেয়।" en="NagorikSheba does not replace official government websites. We help citizens understand and navigate government services more easily — the service itself is always delivered by the official authority." />
          </p>
          <Link href="/contact" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800">
            <T bn="ভুল তথ্য জানান" en="Report incorrect information" /> <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  );
}
