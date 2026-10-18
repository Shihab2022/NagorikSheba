import type { AssessmentYear, TaxpayerCategory, SlabDefinition } from "./types";

type YearConfig = {
  taxFreeThreshold: Record<TaxpayerCategory, number>;
  disabledChildExemption: number;
  maxSalaryExemptionCap: number;
  slabWidths: number[];
  slabRates: number[];
  maxRebateCap: number;
};

export const TAX_CONFIG: Record<AssessmentYear, YearConfig> = {
  "2025-26": {
    taxFreeThreshold: {
      general: 350000,
      female_senior: 400000,
      disabled_third: 475000,
      freedom_fighter: 500000,
    },
    disabledChildExemption: 50000,
    maxSalaryExemptionCap: 450000,
    slabWidths: [100000, 400000, 500000, 500000, 2000000],
    slabRates: [0, 5, 10, 15, 20, 25, 30],
    maxRebateCap: 1000000,
  },
  "2026-27": {
    taxFreeThreshold: {
      general: 375000,
      female_senior: 425000,
      disabled_third: 500000,
      freedom_fighter: 525000,
    },
    disabledChildExemption: 50000,
    maxSalaryExemptionCap: 500000,
    slabWidths: [100000, 400000, 500000, 500000, 2000000],
    slabRates: [0, 5, 10, 15, 20, 25, 30],
    maxRebateCap: 1000000,
  },
};

export const INVESTMENT_CAPS = {
  dps: 120000,
  sanchaypatra: 500000,
} as const;

export const HOUSE_REPAIR_DEDUCTION_PCT = 0.25;

export const SALARY_EXEMPTION_FRACTION = 1 / 3;

export const WEALTH_SURCHARGE_OPTIONS = [
  { value: 0, label: { bn: "৪ কোটি টাকার নিচে (0% সারচার্জ)", en: "Below 4 Crore (0% Surcharge)" } },
  { value: 10, label: { bn: "৪ কোটি টাকার উপরে (10% সারচার্জ)", en: "Above 4 Crore (10% Surcharge)" } },
  { value: 20, label: { bn: "১০ কোটি টাকার উপরে (20% সারচার্জ)", en: "Above 10 Crore (20% Surcharge)" } },
  { value: 30, label: { bn: "২০ কোটি টাকার উপরে (30% সারচার্জ)", en: "Above 20 Crore (30% Surcharge)" } },
  { value: 35, label: { bn: "৫০ কোটি টাকার উপরে (35% সারচার্জ)", en: "Above 50 Crore (35% Surcharge)" } },
] as const;

export const MIN_TAX_OPTIONS = [
  { value: 5000 as const, label: { bn: "ঢাকা ও চট্টগ্রাম সিটি কর্পোরেশন (ন্যূনতম ৳৫,০০০)", en: "Dhaka & Chittagong City Corp. (Min ৳5,000)" } },
  { value: 4000 as const, label: { bn: "অন্যান্য সিটি কর্পোরেশন এলাকা (ন্যূনতম ৳৪,০০০)", en: "Other City Corp. (Min ৳4,000)" } },
  { value: 3000 as const, label: { bn: "সিটি কর্পোরেশনের বাইরে (ন্যূনতম ৳৩,০০০)", en: "Outside City Corp. (Min ৳3,000)" } },
  { value: 1000 as const, label: { bn: "নতুন করদাতা — প্রথমবার রিটার্ন (ন্যূনতম ৳১,০০০)", en: "New Taxpayer — First Return (Min ৳1,000)" } },
] as const;

export const TAXPAYER_CATEGORY_OPTIONS = [
  { value: "general" as const, label: { bn: "সাধারণ করদাতা (পুরুষ)", en: "General Taxpayer (Male)" } },
  { value: "female_senior" as const, label: { bn: "নারী অথবা প্রবীণ নাগরিক (৬৫+ বছর)", en: "Female or Senior Citizen (65+)" } },
  { value: "disabled_third" as const, label: { bn: "বিশেষ চাহিদাসম্পন্ন / তৃতীয় লিঙ্গ", en: "Person with Disability / Third Gender" } },
  { value: "freedom_fighter" as const, label: { bn: "গেজেটভুক্ত যুদ্ধাহত মুক্তিযোদ্ধা", en: "Gazetted War-wounded Freedom Fighter" } },
] as const;

export function buildSlabDefinitions(
  year: AssessmentYear,
  threshold: number,
): SlabDefinition[] {
  const config = TAX_CONFIG[year];
  const slabs: SlabDefinition[] = [
    { label: `প্রথম ৳${threshold.toLocaleString("en-IN")} (করমুক্ত)`, limit: threshold, rate: 0 },
  ];

  const slabLabels = [
    `পরবর্তী ৳${(config.slabWidths[0]).toLocaleString("en-IN")}`,
    `পরবর্তী ৳${(config.slabWidths[1]).toLocaleString("en-IN")}`,
    `পরবর্তী ৳${(config.slabWidths[2]).toLocaleString("en-IN")}`,
    `পরবর্তী ৳${(config.slabWidths[3]).toLocaleString("en-IN")}`,
    `পরবর্তী ৳${(config.slabWidths[4]).toLocaleString("en-IN")}`,
    "অবশিষ্ট আয়ের ওপর",
  ];

  for (let i = 0; i < config.slabWidths.length; i++) {
    slabs.push({
      label: slabLabels[i],
      limit: config.slabWidths[i],
      rate: config.slabRates[i + 1],
    });
  }

  slabs.push({
    label: slabLabels[5],
    limit: Infinity,
    rate: config.slabRates[6],
  });

  return slabs;
}
