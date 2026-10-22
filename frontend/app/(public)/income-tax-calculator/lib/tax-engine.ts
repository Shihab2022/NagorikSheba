import type { TaxFormState, TaxCalculationResult, SlabResult } from "./types";
import {
  TAX_CONFIG,
  INVESTMENT_CAPS,
  HOUSE_REPAIR_DEDUCTION_PCT,
  SALARY_EXEMPTION_FRACTION,
  buildSlabDefinitions,
} from "./tax-config";

export function calculateTax(form: TaxFormState): TaxCalculationResult {
  const config = TAX_CONFIG[form.assessmentYear];

  const effectiveGrossSalary =
    form.salaryMode === "simple"
      ? Math.max(0, form.grossSalary)
      : Math.max(0, form.salBasic) +
        Math.max(0, form.salRent) +
        Math.max(0, form.salMedical) +
        Math.max(0, form.salBonus);

  const salaryExemption = Math.min(
    Math.round(effectiveGrossSalary * SALARY_EXEMPTION_FRACTION),
    config.maxSalaryExemptionCap,
  );
  const taxableSalary = Math.max(0, effectiveGrossSalary - salaryExemption);

  const grossHouseRent = Math.max(0, form.incomeHouseRent);
  const houseRepairDeduction = Math.round(grossHouseRent * HOUSE_REPAIR_DEDUCTION_PCT);
  const taxableHouseRent = Math.max(0, grossHouseRent - houseRepairDeduction);

  const businessIncome = Math.max(0, form.incomeBusiness);
  const otherIncome = Math.max(0, form.incomeOther);

  const totalGrossIncome = effectiveGrossSalary + grossHouseRent + businessIncome + otherIncome;
  const totalExempted = salaryExemption + houseRepairDeduction;
  const totalTaxableIncome = taxableSalary + taxableHouseRent + businessIncome + otherIncome;

  const baseThreshold = config.taxFreeThreshold[form.taxpayerCategory];
  const disabledChildExtra =
    Math.max(0, form.disabledChildCount) * config.disabledChildExemption;
  const taxFreeThreshold = baseThreshold + disabledChildExtra;

  const slabDefs = buildSlabDefinitions(form.assessmentYear, taxFreeThreshold);
  let remainingIncome = totalTaxableIncome;
  let grossTax = 0;
  let highestSlabRate = 0;
  const slabResults: SlabResult[] = [];

  for (const slab of slabDefs) {
    const allocated = Math.max(0, Math.min(remainingIncome, slab.limit));
    const tax = Math.round(allocated * (slab.rate / 100));
    if (allocated > 0 && slab.rate > highestSlabRate) {
      highestSlabRate = slab.rate;
    }
    slabResults.push({ ...slab, allocated, tax });
    grossTax += tax;
    remainingIncome = Math.max(0, remainingIncome - allocated);
  }

  const eligibleDps = Math.min(Math.max(0, form.invDps), INVESTMENT_CAPS.dps);
  const eligibleSanchay = Math.min(Math.max(0, form.invSanchay), INVESTMENT_CAPS.sanchaypatra);
  const lip = Math.max(0, form.invLip);
  const pf = Math.max(0, form.invPf);
  const stock = Math.max(0, form.invStock);
  const zakat = Math.max(0, form.invZakat);
  const totalEligibleInvestment = eligibleDps + eligibleSanchay + lip + pf + stock + zakat;

  const rebateCheckA = Math.round(totalTaxableIncome * 0.03);
  const rebateCheckB = Math.round(totalEligibleInvestment * 0.15);
  const rebateCheckC = config.maxRebateCap;

  let calculatedRebate = 0;
  if (
    form.filedOnTime &&
    totalEligibleInvestment > 0 &&
    totalTaxableIncome > taxFreeThreshold
  ) {
    if (form.rebateMode === "nbr_strict") {
      calculatedRebate = Math.min(rebateCheckA, rebateCheckB, rebateCheckC);
    } else {
      calculatedRebate = Math.min(rebateCheckB, rebateCheckC);
    }
  }

  const finalRebate = Math.min(grossTax, calculatedRebate);

  const minTaxAmount = form.taxpayerLocation;
  let taxAfterRebate = Math.max(0, grossTax - finalRebate);
  let minTaxApplied = false;

  if (totalTaxableIncome > taxFreeThreshold && taxAfterRebate < minTaxAmount) {
    taxAfterRebate = minTaxAmount;
    minTaxApplied = true;
  }

  let effectiveSurchargePct = form.wealthSurchargePct;
  if ((form.ownsMultiCar || form.ownsLargeProperty) && effectiveSurchargePct < 10) {
    effectiveSurchargePct = 10;
  }
  const surchargeAmount = Math.round(taxAfterRebate * (effectiveSurchargePct / 100));

  const aitPaid = Math.max(0, form.aitPaid);
  const finalNetTaxPayable = Math.max(0, taxAfterRebate + surchargeAmount - aitPaid);
  const monthlyAverageTax = Math.round(finalNetTaxPayable / 12);

  return {
    effectiveGrossSalary,
    salaryExemption,
    taxableSalary,
    grossHouseRent,
    houseRepairDeduction,
    taxableHouseRent,
    businessIncome,
    otherIncome,
    totalGrossIncome,
    totalExempted,
    totalTaxableIncome,
    taxFreeThreshold,
    slabResults,
    grossTax,
    highestSlabRate,
    totalEligibleInvestment,
    rebateCheckA,
    rebateCheckB,
    rebateCheckC,
    calculatedRebate,
    finalRebate,
    effectiveSurchargePct,
    surchargeAmount,
    minTaxApplied,
    minTaxAmount,
    taxAfterRebate,
    aitPaid,
    finalNetTaxPayable,
    monthlyAverageTax,
  };
}

export function formatBDT(amount: number): string {
  const rounded = Math.round(amount || 0);
  return "৳ " + rounded.toLocaleString("en-IN");
}

export function getDefaultFormState(): TaxFormState {
  return {
    taxpayerName: "",
    taxpayerTin: "",
    taxpayerCategory: "general",
    taxpayerLocation: 5000,
    taxpayerZone: "",
    signatureText: "",
    filedOnTime: true,
    disabledChildCount: 0,
    assessmentYear: "2025-26",
    salaryMode: "simple",
    grossSalary: 0,
    salBasic: 0,
    salRent: 0,
    salMedical: 0,
    salBonus: 0,
    incomeHouseRent: 0,
    incomeBusiness: 0,
    incomeOther: 0,
    aitPaid: 0,
    rebateMode: "nbr_strict",
    invDps: 0,
    invSanchay: 0,
    invLip: 0,
    invPf: 0,
    invStock: 0,
    invZakat: 0,
    wealthSurchargePct: 0,
    ownsMultiCar: false,
    ownsLargeProperty: false,
  };
}

export function getDemoScenario(type: "mid" | "high"): Partial<TaxFormState> {
  if (type === "mid") {
    return {
      taxpayerName: "জনাব করিম (Demo User)",
      taxpayerTin: "1234-5678-9012",
      taxpayerCategory: "general",
      taxpayerLocation: 5000,
      taxpayerZone: "Tax Zone-04, Dhaka (Circle-078)",
      signatureText: "Demo User",
      filedOnTime: true,
      disabledChildCount: 0,
      salaryMode: "simple",
      grossSalary: 1050000,
      incomeHouseRent: 0,
      incomeBusiness: 0,
      incomeOther: 50000,
      aitPaid: 5000,
      rebateMode: "nbr_strict",
      invDps: 60000,
      invSanchay: 100000,
      invLip: 20000,
      invPf: 0,
      invStock: 0,
      invZakat: 0,
      wealthSurchargePct: 0,
      ownsMultiCar: false,
      ownsLargeProperty: false,
    };
  }
  return {
    taxpayerName: "জনাবা আমিনা (Demo Taxpayer)",
    taxpayerTin: "9876-5432-1098",
    taxpayerCategory: "female_senior",
    taxpayerLocation: 5000,
    taxpayerZone: "Tax Zone-01, Dhaka (Circle-012)",
    signatureText: "Demo Taxpayer",
    filedOnTime: true,
    disabledChildCount: 0,
    salaryMode: "simple",
    grossSalary: 1800000,
    incomeHouseRent: 480000,
    incomeBusiness: 0,
    incomeOther: 120000,
    aitPaid: 25000,
    rebateMode: "nbr_strict",
    invDps: 120000,
    invSanchay: 300000,
    invLip: 50000,
    invPf: 0,
    invStock: 0,
    invZakat: 0,
    wealthSurchargePct: 10,
    ownsMultiCar: true,
    ownsLargeProperty: false,
  };
}
