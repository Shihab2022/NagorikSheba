"use client";

import type { TaxCalculationResult } from "../lib/types";
import { formatBDT } from "../lib/tax-engine";
import {
  Coins,
  Layers,
  PiggyBank,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = [Coins, Layers, PiggyBank, FileText] as const;

const ACCENTS = [
  "border-l-brand-500",
  "border-l-brand-400",
  "border-l-amber-400",
  "",
] as const;

type Props = {
  result: TaxCalculationResult;
};

export function TaxKpiCards({ result }: Props) {
  const cards = [
    {
      label: { bn: "মোট করযোগ্য আয়", en: "Taxable Income" },
      value: formatBDT(result.totalTaxableIncome),
      sub: `করমুক্ত বাদ: ${formatBDT(result.totalExempted)}`,
      accent: ACCENTS[0],
      Icon: ICONS[0],
      iconBg: "bg-brand-50 text-brand-600",
    },
    {
      label: { bn: "স্ল্যাব অনুযায়ী গ্রস কর", en: "Gross Tax" },
      value: formatBDT(result.grossTax),
      sub: `সর্বোচ্চ স্ল্যাব হার: ${result.highestSlabRate}%`,
      accent: ACCENTS[1],
      Icon: ICONS[1],
      iconBg: "bg-brand-50 text-brand-500",
    },
    {
      label: { bn: "বিনিয়োগ কর রেয়াত", en: "Tax Rebate" },
      value: formatBDT(result.finalRebate),
      sub: `যোগ্য বিনিয়োগ: ${formatBDT(result.totalEligibleInvestment)}`,
      accent: ACCENTS[2],
      Icon: ICONS[2],
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      label: { bn: "চূড়ান্ত প্রদেয় কর", en: "Net Payable Tax" },
      value: formatBDT(result.finalNetTaxPayable),
      sub: `মাসিক গড় কর: ${formatBDT(result.monthlyAverageTax)}/মাস`,
      accent: "",
      Icon: ICONS[3],
      iconBg: "",
      highlight: true,
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 print:hidden">
      {cards.map((card, i) => {
        const Icon = card.Icon;
        return (
          <div
            key={i}
            className={cn(
              "rounded-2xl border border-line p-4 shadow-card transition-all duration-200",
              card.highlight
                ? "bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white border-brand-500"
                : "bg-white border-l-4",
              !card.highlight && card.accent,
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-[11px] font-semibold",
                  card.highlight ? "text-brand-100" : "text-slate-500",
                )}
              >
                {card.label.bn}
              </span>
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  card.highlight ? "bg-white/15 text-white" : card.iconBg,
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <div
              className={cn(
                "mt-1.5 text-xl font-extrabold tracking-tight sm:text-2xl",
                card.highlight ? "text-white" : "text-slate-900",
              )}
            >
              {card.value}
            </div>
            <div
              className={cn(
                "mt-0.5 text-[11px]",
                card.highlight ? "text-brand-100" : "text-slate-400",
              )}
            >
              {card.sub}
            </div>
          </div>
        );
      })}
    </section>
  );
}
