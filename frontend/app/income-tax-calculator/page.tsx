import type { Metadata } from "next";
import { IncomeTaxCalculatorView } from "./IncomeTaxCalculatorView";

export const metadata: Metadata = {
  title: "বাংলাদেশ আয়কর ক্যালকুলেটর | Bangladesh Income Tax Calculator | NagorikSheba",
  description:
    "জাতীয় রাজস্ব বোর্ড (NBR) আয়কর আইন ২০২৩ ও অর্থ আইন ২০২৪-২০২৫ অনুযায়ী ব্যক্তিশ্রেণির আয়কর, বিনিয়োগ রেয়াত, নিট কর ও স্ল্যাবভিত্তিক কর নিরূপণ করুন এবং প্রতিবেদন সরাসরি PDF ডাউনলোড করুন।",
  keywords: [
    "Bangladesh Income Tax Calculator",
    "NBR Tax Calculator",
    "BD Tax Calculator 2025-26",
    "আয়কর ক্যালকুলেটর",
    "বিনিয়োগ কর রেয়াত",
    "আয়কর আইন ২০২৩",
    "একসেবা কর সেবা",
  ],
};

export default function IncomeTaxCalculatorPage() {
  return <IncomeTaxCalculatorView />;
}
