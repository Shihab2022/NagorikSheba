export type AssessmentYear = "2025-26" | "2026-27";

export type TaxpayerCategory =
  | "general"
  | "female_senior"
  | "disabled_third"
  | "freedom_fighter";

export type LocationMinTax = 5000 | 4000 | 3000 | 1000;

export type SalaryMode = "simple" | "detailed";

export type RebateMode = "nbr_strict" | "flat_15";

export type TaxFormState = {
  taxpayerName: string;
  taxpayerTin: string;
  taxpayerCategory: TaxpayerCategory;
  taxpayerLocation: LocationMinTax;
  taxpayerZone: string;
  signatureText: string;
  filedOnTime: boolean;
  disabledChildCount: number;
  assessmentYear: AssessmentYear;

  salaryMode: SalaryMode;
  grossSalary: number;
  salBasic: number;
  salRent: number;
  salMedical: number;
  salBonus: number;
  incomeHouseRent: number;
  incomeBusiness: number;
  incomeOther: number;
  aitPaid: number;

  rebateMode: RebateMode;
  invDps: number;
  invSanchay: number;
  invLip: number;
  invPf: number;
  invStock: number;
  invZakat: number;

  wealthSurchargePct: number;
  ownsMultiCar: boolean;
  ownsLargeProperty: boolean;
};

export type SlabDefinition = {
  label: string;
  limit: number;
  rate: number;
};

export type SlabResult = SlabDefinition & {
  allocated: number;
  tax: number;
};

export type TaxCalculationResult = {
  effectiveGrossSalary: number;
  salaryExemption: number;
  taxableSalary: number;
  grossHouseRent: number;
  houseRepairDeduction: number;
  taxableHouseRent: number;
  businessIncome: number;
  otherIncome: number;
  totalGrossIncome: number;
  totalExempted: number;
  totalTaxableIncome: number;

  taxFreeThreshold: number;

  slabResults: SlabResult[];
  grossTax: number;
  highestSlabRate: number;

  totalEligibleInvestment: number;
  rebateCheckA: number;
  rebateCheckB: number;
  rebateCheckC: number;
  calculatedRebate: number;
  finalRebate: number;

  effectiveSurchargePct: number;
  surchargeAmount: number;

  minTaxApplied: boolean;
  minTaxAmount: number;

  taxAfterRebate: number;
  aitPaid: number;
  finalNetTaxPayable: number;
  monthlyAverageTax: number;
};
