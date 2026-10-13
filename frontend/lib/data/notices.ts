import type { FaqItem, GovernmentNotice } from "@/lib/types";
import type { Dict, Lang } from "@/lib/i18n";

/**
 * MOCK DATA — government notices (demo content for the prototype).
 * These are illustrative entries, not real published notices.
 */
export const NOTICES: GovernmentNotice[] = [
  {
    id: "ntc-passport-delivery",
    title: "Passport Service Update: Delivery schedule for remote districts",
    category: "passport",
    department: "Department of Immigration & Passports",
    publishedAt: "2026-10-08",
    summary:
      "Extended delivery days have been announced for passports dispatched to remote district offices.",
    body: [
      "The Department of Immigration & Passports has extended passport delivery arrangements for applicants in remote district regions.",
      "Applicants will receive SMS notifications when the passport reaches the designated delivery branch. Please carry the acknowledgement slip and NID card during collection.",
      "Applicants who opted for home delivery should confirm their current address in the online application before dispatch.",
    ],
    officialUrl: "https://www.epassport.gov.bd/",
    readMinutes: 2,
  },
  {
    id: "ntc-nid-correction-window",
    title: "NID information correction window open at union level centres",
    category: "nid",
    department: "Election Commission",
    publishedAt: "2026-10-05",
    summary:
      "Union-level NID registration centres are accepting correction applications during office hours.",
    body: [
      "Union Parishad and City Corporation NID registration centres are accepting applications for spelling, date-of-birth and address corrections.",
      "Carry your original NID card and a supporting document such as a birth registration certificate or passport.",
      "Online requests submitted through the NID service portal continue to be processed in parallel.",
    ],
    officialUrl: "https://services.nidw.gov.bd/",
    readMinutes: 2,
  },
  {
    id: "ntc-tax-deadline",
    title: "Income tax return filing deadline reminder for individual taxpayers",
    category: "tax",
    department: "National Board of Revenue",
    publishedAt: "2026-10-01",
    summary:
      "NBR has reminded individual taxpayers to file annual returns through the e-Return portal before the due date.",
    body: [
      "The National Board of Revenue urges all individual taxpayers with taxable income to file their annual return through the official e-Return portal.",
      "Taxpayers who filed on time are eligible for rebates on investment and insurance contributions as per existing rules.",
      "For assistance, taxpayers can contact the nearest Tax Circle office.",
    ],
    officialUrl: "https://etax.nbr.gov.bd/",
    readMinutes: 3,
  },
  {
    id: "ntc-ssc-results",
    title: "SSC and equivalent result sheets available on the official portal",
    category: "education",
    department: "Ministry of Education",
    publishedAt: "2026-09-28",
    summary:
      "Institution-wise and individual result sheets can be downloaded from the official results portal.",
    body: [
      "Result sheets for SSC and equivalent examinations are available on the official results portal.",
      "Candidates need their roll and registration numbers to view individual results.",
      "Institutions may collect official result documents from their respective education boards.",
    ],
    officialUrl: "https://www.educationboardresults.gov.bd/",
    readMinutes: 2,
  },
  {
    id: "ntc-land-khatian",
    title: "Khatian copies now downloadable from the land service portal",
    category: "land",
    department: "Ministry of Land",
    publishedAt: "2026-09-24",
    summary:
      "Citizens can search mouja information and download certified khatian copies online.",
    body: [
      "The land service portal now allows citizens to search for mouja, dag and khatian information digitally.",
      "Certified copies can be downloaded for personal reference; mutation applications still require the land office hearing process.",
      "For legal purposes, obtain a certified copy from the SAC (Land) office.",
    ],
    officialUrl: "https://land.gov.bd/",
    readMinutes: 3,
  },
  {
    id: "ntc-brta-test",
    title: "BRTA driving licence test schedule updated for zonal offices",
    category: "transport",
    department: "Bangladesh Road Transport Authority",
    publishedAt: "2026-09-20",
    summary: "Updated written and traffic test slots are available through the BRTA service portal.",
    body: [
      "BRTA has updated test scheduling for driving licence applicants across zonal offices.",
      "Applicants must upload the bank payment receipt generated from the BSP portal before booking a slot.",
      "Arrive at the assigned office with the acknowledgement slip and NID card at least 30 minutes before the slot time.",
    ],
    officialUrl: "https://bsp.brta.gov.bd/",
    readMinutes: 2,
  },
  {
    id: "ntc-hospital-opd",
    title: "Government hospital OPD token system moved to digital counters",
    category: "health",
    department: "Directorate General of Health Services",
    publishedAt: "2026-09-15",
    summary:
      "Selected medical college hospitals are issuing OPD tokens through digital display counters.",
    body: [
      "Several government medical college hospitals have shifted OPD token issuance to digital counters.",
      "Patients should carry their NID card for registration at the counter.",
      "Emergency services remain available 24 hours at all designated hospitals.",
    ],
    readMinutes: 2,
  },
  {
    id: "ntc-birth-online",
    title: "Birth certificate verification available online through BDRIS",
    category: "nid",
    department: "Office of the Registrar General",
    publishedAt: "2026-09-10",
    summary:
      "Citizens can verify birth registration details online using registration number and date of birth.",
    body: [
      "The BDRIS portal allows online verification of birth registration records.",
      "Enter the registration number, date of birth and parent names to view the record.",
      "For a legally valid copy, apply through the designated registrar office.",
    ],
    officialUrl: "https://www.bdris.gov.bd/",
    readMinutes: 2,
  },
];

export const NOTICE_CATEGORIES: {
  value: "all" | GovernmentNotice["category"];
  label: Dict<string>;
}[] = [
  { value: "all", label: { bn: "সব", en: "All" } },
  { value: "nid", label: { bn: "এনআইডি", en: "NID" } },
  { value: "passport", label: { bn: "পাসপোর্ট", en: "Passport" } },
  { value: "tax", label: { bn: "কর", en: "Tax" } },
  { value: "education", label: { bn: "শিক্ষা", en: "Education" } },
  { value: "land", label: { bn: "ভূমি", en: "Land" } },
  { value: "transport", label: { bn: "যোগাযোগ", en: "Transport" } },
  { value: "health", label: { bn: "স্বাস্থ্য", en: "Health" } },
];

export function getNoticeById(id: string): GovernmentNotice | undefined {
  return NOTICES.find((n) => n.id === id);
}

/** Relative-time-free formatted date, e.g. "8 Oct 2026" — localized for bn/en. */
export function formatNoticeDate(iso: string, lang: Lang = "en"): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** "Published X ago" helper based on a fixed reference date for demo data. */
export function publishedLabel(iso: string, lang: Lang = "en"): string {
  const now = new Date("2026-10-08T00:00:00");
  const then = new Date(`${iso}T00:00:00`);
  const hours = Math.round((now.getTime() - then.getTime()) / 3_600_000);
  if (lang === "bn") {
    if (hours < 24) return `${Math.max(hours, 1)} ঘণ্টা আগে প্রকাশিত`;
    const daysBn = Math.round(hours / 24);
    if (daysBn < 7) return `${daysBn} দিন আগে প্রকাশিত`;
    return `${formatNoticeDate(iso, lang)} প্রকাশিত`;
  }
  if (hours < 24) return `Published ${Math.max(hours, 1)} hours ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `Published ${days} day${days === 1 ? "" : "s"} ago`;
  return `Published ${formatNoticeDate(iso, lang)}`;
}

/**
 * MOCK DATA — frequently asked questions.
 */
export const FAQS: FaqItem[] = [
  {
    id: "faq-1",
    category: "general",
    question: {
      bn: "একসেবা (NagorikSheba) কী?",
      en: "What is একসেবা (NagorikSheba)?",
    },
    answer: {
      bn: "নাগরিকসেবা একটি স্বাধীন সিভিক-টেক প্ল্যাটফর্ম যা নাগরিকদের সরকারি সেবা আবিষ্কার করতে, যোগ্যতা, প্রয়োজনীয় ডকুমেন্ট, ফি ও ধাপে ধাপে প্রক্রিয়া বুঝতে সাহায্য করে — এবং তারপর অফিসিয়াল সরকারি পোর্টালে পৌঁছে যেতে সহায়তা করে।",
      en: "NagorikSheba is an independent civic-tech platform that helps citizens discover government services, understand eligibility, required documents, fees and step-by-step procedures — and then reach the official government portal.",
    },
  },
  {
    id: "faq-2",
    category: "general",
    question: {
      bn: "কি একসেবা একটি সরকারি ওয়েবসাইট?",
      en: "Is একসেবা a government website?",
    },
    answer: {
      bn: "না। নাগরিকসেবা একটি স্বাধীন তথ্য ও সেবা-আবিষ্কার প্ল্যাটফর্ম। আমরা সরকারি ওয়েবসাইটের বিকল্প নই — সরকারি সেবা প্রদান করা হয় অফিসিয়াল পোর্টাল ও কর্তৃপক্ষের মাধ্যমে। গুরুত্বপূর্ণ তথ্য সর্বদা অফিসিয়াল উৎসে যাচাই করুন।",
      en: "No. NagorikSheba is an independent information and service-discovery platform. We do not replace official government websites — government services are provided through official portals and authorities. Always verify critical information on the official source.",
    },
  },
  {
    id: "faq-3",
    category: "services",
    question: {
      bn: "আপনারা কি আমার পক্ষে আবেদন জমা দেন?",
      en: "Do you submit applications on my behalf?",
    },
    answer: {
      bn: "না। আমরা প্রক্রিয়াটি বুঝতে সাহায্য করি এবং আসলে আবেদন জমা হয় এমন অফিসিয়াল পোর্টাল বা অফিসের লিংক দিই। আমরা কখনো আবেদনের ডকুমেন্ট বা ফি সংগ্রহ করি না।",
      en: "No. We guide you through the process and link you to the official portal or office where the application is actually submitted. We never collect application documents or fees.",
    },
  },
  {
    id: "faq-4",
    category: "services",
    question: {
      bn: "প্রদর্শিত ফি কতটা নির্ভুল?",
      en: "How accurate are the fees shown?",
    },
    answer: {
      bn: "এই প্রোটোটাইপে প্রদর্শিত ফি আনুমানিক ডেমো মান। ফি ও প্রয়োজনীয়তা প্রায়ই বদলায় — পরিশোধের আগে সর্বদা সরকারি উৎস থেকে সর্বশেষ ফি নিশ্চিত করুন।",
      en: "Fees shown in this prototype are indicative demo values. Fees and requirements change frequently — always confirm the latest fee from the official government source before paying.",
    },
  },
  {
    id: "faq-5",
    category: "services",
    question: {
      bn: "প্রয়োজনীয় ডকুমেন্টের তালিকা কোথায় পাব?",
      en: "Where can I find the list of required documents?",
    },
    answer: {
      bn: "যেকোনো সেবার পাতা খুলে প্রয়োজনীয় ডকুমেন্ট বিভাগ দেখুন, অথবা কী কী প্রস্তুত করবেন তা দেখার জন্য ডকুমেন্ট চেকলিস্ট পাতাটি ব্যবহার করুন।",
      en: "Open any service page and check the Required Documents section, or use the Document Checklist page for a printable-style overview of what to prepare.",
    },
  },
  {
    id: "faq-6",
    category: "data",
    question: {
      bn: "আপনারা তথ্য কীভাবে যাচাই করেন?",
      en: "How do you verify information?",
    },
    answer: {
      bn: "প্রতিটি সেবায় অফিসিয়াল উৎসের লিংক ও সর্বশেষ যাচাইয়ের তারিখ থাকে। আমাদের সম্পাদকরা নিয়মিত এন্ট্রি পর্যালোচনা করেন এবং অফিসিয়াল পোর্টালে প্রয়োজনীয়তা বদলালে হালনাগাদ করেন।",
      en: "Every service entry carries an Official Source link and a Last Verified date. Our editors review entries regularly and update them when official portals change requirements.",
    },
  },
  {
    id: "faq-7",
    category: "data",
    question: {
      bn: "ভুল তথ্য পেয়েছি। কীভাবে জানাব?",
      en: "I found wrong information. How do I report it?",
    },
    answer: {
      bn: "যোগাযোগ পাতায় যান এবং ‘ভুল তথ্য জানান’ বেছে নিন। নাগরিকদের দেওয়া সংশোধনী সবার কাজে লাগে — তথ্য সঠিক রাখতে সাহায্যের জন্য ধন্যবাদ।",
      en: "Use the Contact page and choose 'Report incorrect information'. Corrections from citizens help everyone — thank you for helping keep the information accurate.",
    },
  },
  {
    id: "faq-8",
    category: "account",
    question: {
      bn: "নাগরিকসেবা ব্যবহারের জন্য কি অ্যাকাউন্ট লাগবে?",
      en: "Do I need an account to use NagorikSheba?",
    },
    answer: {
      bn: "না। সেবা, অফিস ও নোটিশ দেখা সম্পূর্ণ বিনামূল্যে এবং অ্যাকাউন্ট লাগে না। অ্যাকাউন্ট (এই প্রোটোটাইপে শুধু ডেমো) দিয়ে আপনি সেবা সংরক্ষণ ও আবেদন ট্র্যাক করতে পারতেন।",
      en: "No. Browsing services, offices and notices is completely free and does not require an account. An account (demo only in this prototype) would let you save services and track applications.",
    },
  },
  {
    id: "faq-9",
    category: "account",
    question: {
      bn: "আমি কি এখানে আমার আবেদন ট্র্যাক করতে পারি?",
      en: "Can I track my application here?",
    },
    answer: {
      bn: "আবেদন ট্র্যাকার পাতাটি একটি ইউআই ডেমো। লাইভ ট্র্যাকিংয়ের জন্য প্রতিটি কর্তৃপক্ষের সিস্টেমের সাথে সংযোগ প্রয়োজন, যা এই প্রোটোটাইপে সংযুক্ত নেই।",
      en: "The Application Tracker page is a UI demonstration. Live tracking requires integration with each authority's system, which is not connected in this prototype.",
    },
  },
  {
    id: "faq-10",
    category: "general",
    question: {
      bn: "এই প্ল্যাটফর্ম ব্যবহারে কি কোনো চার্জ আছে?",
      en: "Is there any charge to use this platform?",
    },
    answer: {
      bn: "না। নাগরিকসেবা নাগরিকদের জন্য বিনামূল্যে। আমরা নির্দেশনার জন্য কখনো টাকা নিই না, এবং সরকারি ফি শুধু প্রতিটি সেবার পাতায় বর্ণিত অফিসিয়াল চ্যানেলের মাধ্যমে পরিশোধ করা উচিত।",
      en: "No. NagorikSheba is free for citizens. We never charge for guidance, and government fees must only be paid through the official channels described on each service page.",
    },
  },
];


