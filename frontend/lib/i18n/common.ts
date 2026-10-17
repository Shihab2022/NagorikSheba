import type { Dict } from "@/lib/i18n";

/**
 * Strings shared by many pages/components (empty states, demo notes,
 * generic buttons…). Keep both languages in sync — TypeScript enforces it.
 */
export const COMMON = {
  bn: {
    // States
    noServices: "কোনো সেবা পাওয়া যায়নি।",
    noOffices: "কোনো অফিস পাওয়া যায়নি।",
    noNotices: "কোনো নোটিশ পাওয়া যায়নি।",
    noResults: "কোনো ফলাফল পাওয়া যায়নি।",
    tryFilters: "অনুসন্ধান বা ফিল্টার পরিবর্তন করে দেখুন।",
    somethingWrong: "কিছু একটা সমস্যা হয়েছে।",
    pleaseTryAgain: "অনুগ্রহ করে আবার চেষ্টা করুন।",
    tryAgain: "আবার চেষ্টা করুন",
    demoTitle: "ডেমো ডেটা:",
    demoBody:
      "এই প্রোটোটাইপে ডেমো তথ্য ব্যবহার করা হয়েছে। ফি, ডকুমেন্ট ও লিংক সর্বদা অফিসিয়াল উৎস থেকে যাচাই করুন।",
    // Generic actions / labels
    login: "লগইন",
    register: "রেজিস্টার",
    createAccount: "অ্যাকাউন্ট তৈরি করুন",
    search: "অনুসন্ধান",
    searchServices: "সেবা খুঁজুন",
    submit: "জমা দিন",
    cancel: "বাতিল",
    close: "বন্ধ করুন",
    viewAll: "সব দেখুন",
    viewDetails: "বিস্তারিত দেখুন",
    viewService: "সেবা দেখুন",
    explore: "দেখুন",
    readMore: "আরও পড়ুন",
    loadMore: "আরও দেখুন",
    minRead: "{n} মিনিট পড়া",
    all: "সব",
    none: "কোনোটি নয়",
    language: "ভাষা",
    bengali: "বাংলা",
    english: "English",
  },
  en: {
    // States
    noServices: "No services found.",
    noOffices: "No offices found.",
    noNotices: "No notices found.",
    noResults: "No results found.",
    tryFilters: "Try changing your search or filters.",
    somethingWrong: "Something went wrong.",
    pleaseTryAgain: "Please try again.",
    tryAgain: "Try again",
    demoTitle: "Demo data:",
    demoBody:
      "This prototype uses mock information. Always verify fees, documents and links with the official source.",
    // Generic actions / labels
    login: "Login",
    register: "Register",
    createAccount: "Create account",
    search: "Search",
    searchServices: "Search services",
    submit: "Submit",
    cancel: "Cancel",
    close: "Close",
    viewAll: "View all",
    viewDetails: "View details",
    viewService: "View Service",
    explore: "Explore",
    readMore: "Read more",
    loadMore: "Load more",
    minRead: "{n} min read",
    all: "All",
    none: "None",
    language: "Language",
    bengali: "বাংলা",
    english: "English",
  },
} satisfies Dict<Record<string, string>>;
