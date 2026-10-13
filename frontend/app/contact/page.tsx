import type { Metadata } from "next";
import { AlertTriangle, Lightbulb, Link2Off, MessageSquare } from "lucide-react";
import { TranslatedPageHeader } from "@/components/ui/TranslatedPageHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactCard } from "./ContactCard";
import { T } from "@/components/ui/T";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact NagorikSheba — report incorrect information, suggest a service, or send feedback.",
};

const CARDS = [
  { icon: AlertTriangle, title: { bn: "ভুল তথ্য জানান", en: "Report incorrect information" }, text: { bn: "ভুল ফি বা ডকুমেন্ট? পাতা ও সংশোধন জানান।", en: "Wrong fee, document or step on a service page? Tell us the page and the correction." } },
  { icon: Lightbulb, title: { bn: "সেবার প্রস্তাব দিন", en: "Suggest a service" }, text: { bn: "কোনো সেবা বাদ পড়েছে? প্রস্তাব দিন, আমরা গবেষণা করব।", en: "Missing a service citizens need? Suggest it and we will research the official process." } },
  { icon: Link2Off, title: { bn: "ভাঙা লিংক জানান", en: "Report broken official link" }, text: { bn: "অফিসিয়াল পোর্টাল প্রায়ই বদলায় — জানালে ঠিক করে দেব।", en: "Official portals move often — report a dead link and we will fix it." } },
  { icon: MessageSquare, title: { bn: "সাধারণ মতামত", en: "General feedback" }, text: { bn: "নাগরিকসেবা আরও সহজ করার পরামর্শ দিন।", en: "Ideas to make NagorikSheba clearer, simpler or more accessible for everyone." } },
];

export default function ContactPage() {
  return (
    <>
      <TranslatedPageHeader
        title={{ bn: "নাগরিকসেবায় যোগাযোগ", en: "Contact NagorikSheba" }}
        description={{
          bn: "সরকারি তথ্য সঠিক রাখতে সাহায্য করুন — প্রতিটি সংশোধন সবার কাজে লাগে।",
          en: "Help us keep government information accurate — every correction from citizens helps everyone.",
        }}
        breadcrumbs={[{ label: { bn: "হোম", en: "Home" }, href: "/" }, { label: { bn: "যোগাযোগ", en: "Contact" } }]}
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c) => (
            <ContactCard key={c.title.en} icon={c.icon} title={c.title} text={c.text} />
          ))}
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <ContactForm />
          <aside className="space-y-4">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <h2 className="text-sm font-extrabold text-slate-900"><T bn="লেখার আগে" en="Before you write" /></h2>
              <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-500">
                <li><T bn="আগে সেবা পাতার অফিসিয়াল উৎস দেখুন।" en="Check the Official Source link on the service page first." /></li>
                <li><T bn="পাতার URL ও প্রত্যাশিত তথ্য উল্লেখ করুন।" en="Include the page URL and what you expected to see." /></li>
                <li><T bn="আমরা আবেদন জমা বা পেমেন্ট নিই না।" en="We cannot submit applications or take payments." /></li>
              </ul>
            </div>
            <div className="rounded-2xl bg-brand-800 p-5 text-white">
              <h2 className="text-sm font-extrabold"><T bn="নিজে সমাধান চান?" en="Prefer self-help?" /></h2>
              <p className="mt-1.5 text-sm leading-6 text-brand-100"><T bn="বেশিরভাগ প্রশ্নের উত্তর FAQ-তে আছে।" en="Most questions are already answered in the FAQ." /></p>
              <a href="/faq" className="mt-3 inline-block rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50"><T bn="FAQ দেখুন" en="Visit FAQ" /></a>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
