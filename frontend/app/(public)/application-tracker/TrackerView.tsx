"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { TrackerWidget } from "@/components/tracker/TrackerWidget";
import { useTranslation } from "@/lib/i18n";

const STRINGS = {
  bn: {
    title: "আপনার আবেদন কোথায় আছে?",
    description:
      "লাইভ স্ট্যাটাস ট্র্যাকিং কীভাবে কাজ করবে তার একটি প্রদর্শনী দেখতে আপনার আবেদন আইডি লিখুন — ব্যাকএন্ড সিস্টেম সংযুক্ত হলে।",
    home: "হোম",
    tracker: "আবেদন ট্র্যাকার",
    howRealWorks: "প্রকৃত ট্র্যাকিং কীভাবে কাজ করে",
    step1:
      "অফিসিয়াল পোর্টালে আবেদন করুন এবং আপনার আবেদন / প্রাপ্তিস্বীকার আইডি সংরক্ষণ করুন।",
    step2:
      "লাইভ স্ট্যাটাসের জন্য কর্তৃপক্ষের নিজস্ব ট্র্যাকিং পেজ বা হেল্পলাইন ব্যবহার করুন।",
    step3:
      "ইন্টিগ্রেশনের পর এই পাতাটি সরাসরি সেই সিস্টেমগুলোতে কোয়েরি করবে।",
  },
  en: {
    title: "Where is your application?",
    description:
      "Enter your application ID to see a demonstration of how live status tracking will work once backend systems are connected.",
    home: "Home",
    tracker: "Application Tracker",
    howRealWorks: "How real tracking works",
    step1: "Apply on the official portal and save your application / acknowledgement ID.",
    step2: "Use the authority's own tracking page or helpline for the live status.",
    step3: "Once integrated, this page will query those systems directly.",
  },
};

export function TrackerView() {
  const { t } = useTranslation();
  const s = t(STRINGS);
  return (
    <>
      <PageHeader
        title={s.title}
        description={s.description}
        breadcrumbs={[{ label: s.home, href: "/" }, { label: s.tracker }]}
      />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <TrackerWidget />
        <div className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-card">
          <h2 className="text-sm font-extrabold text-slate-900">{s.howRealWorks}</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-500">
            <li>{s.step1}</li>
            <li>{s.step2}</li>
            <li>{s.step3}</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default TrackerView;
