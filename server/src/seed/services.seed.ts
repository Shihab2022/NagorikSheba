import { pool } from "../utils/pg";

type ServiceStepInput = {
  stepNumber: number;
  title: string;
  description: string;
  actionType:
    | "READ_GUIDE"
    | "VISIT_OFFICIAL_PORTAL"
    | "VISIT_OFFICE"
    | "PREPARE_DOCUMENTS"
    | "OTHER";
};

type ServiceRequirementInput = {
  name: string;
  description?: string | null;
  isMandatory: boolean;
  sortOrder: number;
};

type ServiceFeeInput = {
  name: string;
  amount: number | null;
  currency: string;
  description?: string | null;
};

type ServiceSourceInput = {
  title: string;
  url: string;
  sourceType: "OFFICIAL_PORTAL" | "OFFICIAL_NOTICE" | "OFFICIAL_DOCUMENT" | "OTHER";
};

type ServiceInput = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  eligibility?: string | null;
  processingTime?: string | null;
  officialUrl?: string | null;
  isPublished?: boolean;
  steps: ServiceStepInput[];
  requirements: ServiceRequirementInput[];
  fees: ServiceFeeInput[];
  sources: ServiceSourceInput[];
};

const CATEGORY_IDS: Record<string, string> = {
  "identity-documents": "10000000-0000-0000-0000-000000000001",
  "passport-immigration": "10000000-0000-0000-0000-000000000002",
  transport: "10000000-0000-0000-0000-000000000003",
  "tax-finance": "10000000-0000-0000-0000-000000000004",
  "land-property": "10000000-0000-0000-0000-000000000005",
  education: "10000000-0000-0000-0000-000000000006",
  health: "10000000-0000-0000-0000-000000000007",
  "social-welfare": "10000000-0000-0000-0000-000000000008",
  "police-legal": "10000000-0000-0000-0000-000000000009",
  business: "10000000-0000-0000-0000-000000000010",
  agriculture: "10000000-0000-0000-0000-000000000011",
  "local-government": "10000000-0000-0000-0000-000000000012",
};

const SERVICES: ServiceInput[] = [
  {
    id: "20000000-0000-0000-0000-000000000001",
    categoryId: CATEGORY_IDS["identity-documents"],
    name: "NID Correction",
    slug: "nid-correction",
    shortDescription: "Correct your National ID information.",
    description: "If your National ID card has wrong spelling, date of birth, photo or address, you can request a correction online through the Election Commission's NID service portal. Some changes (such as photo re-capture) require a visit to the NID registration centre.",
    eligibility: "Bangladeshi citizen with an existing NID record; The information to correct must be supported by a valid document (BDRIS certificate, passport, etc.); Online correction is available for limited fields — others need an in-person visit",
    processingTime: "7–15 days",
    officialUrl: "https://services.nidw.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Create or log in", description: "Create or log in to your account on the NID service portal", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Select the correction type", description: "Select the correction type and fill in the correct information", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Upload scanned copies of", description: "Upload scanned copies of supporting documents", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 4, title: "Submit and print the", description: "Submit and print the acknowledgement copy", actionType: "OTHER" },
      { stepNumber: 5, title: "Track the application until", description: "Track the application until the updated card is delivered", actionType: "READ_GUIDE" }
    ],
    requirements: [
      { name: "NID card or certified copy", isMandatory: true, sortOrder: 1 },
      { name: "Birth Registration Certificate / supporting document", isMandatory: true, sortOrder: 2 },
      { name: "Recent passport-size photograph (if photo change is requested)", isMandatory: true, sortOrder: 3 },
      { name: "Application form (printed from the portal)", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Free for online correction; card reprint fee applies", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "Bangladesh Election Commission", url: "https://services.nidw.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    categoryId: CATEGORY_IDS["identity-documents"],
    name: "Birth Registration",
    slug: "birth-registration",
    shortDescription: "Register a newborn and obtain the Birth Registration Certificate.",
    description: "Birth registration must be completed within 60 days of birth for a standard certificate. Late registration requires additional approvals from the Upazila Nirbahi Officer or City Corporation authority.",
    eligibility: "Every birth occurring in Bangladesh must be registered; Parents or a legal guardian can apply on behalf of the child; Hospital birth slip (if available) simplifies the process",
    processingTime: "Same day to 7 days",
    officialUrl: "https://www.bdris.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Collect the form from", description: "Collect the form from the local Union Parishad, Ward Office or hospital", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Fill in the birth", description: "Fill in the birth details and attach supporting documents", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Submit the form to", description: "Submit the form to the registrar (Union Parishad / City Corporation)", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 4, title: "Verify details and collect", description: "Verify details and collect the printed certificate", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 5, title: "Verify the certificate online", description: "Verify the certificate online through BDRIS", actionType: "VISIT_OFFICIAL_PORTAL" }
    ],
    requirements: [
      { name: "Hospital birth slip or vaccination card", isMandatory: true, sortOrder: 1 },
      { name: "Parents' NID cards", isMandatory: true, sortOrder: 2 },
      { name: "National ID or passport of the applicant", isMandatory: true, sortOrder: 3 },
      { name: "Address proof (utility bill / holding receipt)", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Free within 60 days; late registration fee applies afterwards", amount: 60.00, currency: "BDT" }
    ],
    sources: [
      { title: "Office of the Registrar General, Birth & Death Registration", url: "https://www.bdris.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000003",
    categoryId: CATEGORY_IDS["identity-documents"],
    name: "Death Registration",
    slug: "death-registration",
    shortDescription: "Register a death and obtain the Death Registration Certificate.",
    description: "Register a death and obtain the Death Registration Certificate.",
    eligibility: "Family members or legal heirs of the deceased can apply; Must be registered within 1 year of the death",
    processingTime: "Same day to 7 days",
    officialUrl: "https://www.bdris.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Obtain the death report", description: "Obtain the death report from the hospital or burial ground", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Complete the form at", description: "Complete the form at the local registrar office", actionType: "VISIT_OFFICE" },
      { stepNumber: 3, title: "Submit supporting documents and", description: "Submit supporting documents and the applicant's NID", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 4, title: "Collect the Death Registration", description: "Collect the Death Registration Certificate", actionType: "PREPARE_DOCUMENTS" }
    ],
    requirements: [
      { name: "Hospital or graveyard/cremation ground certificate", isMandatory: true, sortOrder: 1 },
      { name: "Applicant's NID card", isMandatory: true, sortOrder: 2 },
      { name: "Deceased person's NID card (if available)", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Free within 15 days; late fee may apply", amount: 15.00, currency: "BDT" }
    ],
    sources: [
      { title: "Office of the Registrar General, Birth & Death Registration", url: "https://www.bdris.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000004",
    categoryId: CATEGORY_IDS["passport-immigration"],
    name: "e-Passport (New Application)",
    slug: "epassport-new",
    shortDescription: "Apply for a new Bangladeshi e-Passport online.",
    description: "All Bangladeshi passports are now machine-readable e-Passports. Apply online, pay the fee at a bank and attend the designated passport office with original documents for enrolment (fingerprints and photo).",
    eligibility: "Bangladeshi citizen with a valid NID card; Existing machine-readable passport (if any) must be submitted during enrolment; Minors apply through parents or legal guardian",
    processingTime: "7–21 days depending on delivery type",
    officialUrl: "https://www.epassport.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply online and fill", description: "Apply online and fill the e-Passport form", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Pay the fee at", description: "Pay the fee at a designated bank and save the receipt", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Book an appointment at", description: "Book an appointment at a passport office / mobile passport camp", actionType: "VISIT_OFFICE" },
      { stepNumber: 4, title: "Attend in person with", description: "Attend in person with original documents for enrolment", actionType: "VISIT_OFFICE" },
      { stepNumber: 5, title: "Collect or receive the", description: "Collect or receive the passport by post", actionType: "PREPARE_DOCUMENTS" }
    ],
    requirements: [
      { name: "NID card (original and photocopy)", isMandatory: true, sortOrder: 1 },
      { name: "Birth Registration Certificate", isMandatory: true, sortOrder: 2 },
      { name: "Current/old passport (if any)", isMandatory: true, sortOrder: 3 },
      { name: "Bank payment receipt (challan)", isMandatory: true, sortOrder: 4 },
      { name: "Two passport-size photographs (as specified)", isMandatory: true, sortOrder: 5 }
    ],
    fees: [
      { name: "Starting from ৳3,000 (32 pages, 5 years, normal delivery)", amount: 3000.00, currency: "BDT" }
    ],
    sources: [
      { title: "Department of Immigration & Passports, Ministry of Home Affairs", url: "https://www.epassport.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000005",
    categoryId: CATEGORY_IDS["passport-immigration"],
    name: "Passport Renewal",
    slug: "passport-renewal",
    shortDescription: "Renew or re-issue your expiring e-Passport.",
    description: "Renew or re-issue your expiring e-Passport.",
    eligibility: "Holder of a valid or expired e-Passport; NID information must match the passport application",
    processingTime: "7–21 days",
    officialUrl: "https://www.epassport.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply online under the", description: "Apply online under the re-issue/renewal option", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Pay the fee and", description: "Pay the fee and book an appointment", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Attend the passport office", description: "Attend the passport office with original documents", actionType: "VISIT_OFFICE" },
      { stepNumber: 4, title: "Track delivery and collect", description: "Track delivery and collect the renewed passport", actionType: "PREPARE_DOCUMENTS" }
    ],
    requirements: [
      { name: "Current passport (original)", isMandatory: true, sortOrder: 1 },
      { name: "NID card", isMandatory: true, sortOrder: 2 },
      { name: "Bank payment receipt", isMandatory: true, sortOrder: 3 },
      { name: "Police verification may be required", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Same as new passport fee (starting from ৳3,000)", amount: 3000.00, currency: "BDT" }
    ],
    sources: [
      { title: "Department of Immigration & Passports, Ministry of Home Affairs", url: "https://www.epassport.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000006",
    categoryId: CATEGORY_IDS["transport"],
    name: "Driving License",
    slug: "driving-license",
    shortDescription: "Apply for a new smart-card driving licence.",
    description: "Apply through the BRTA BSP portal, pay the government fee at a designated bank using the generated challan, then attend the BRTA office for the written/traffic test and biometrics.",
    eligibility: "Minimum age 18 for motorcycle and light vehicle; Valid learner licence (where required); NID card as identity proof",
    processingTime: "7–30 days (test scheduling dependent)",
    officialUrl: "https://bsp.brta.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply on the BRTA", description: "Apply on the BRTA BSP portal and generate the fee challan", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Pay the fee at", description: "Pay the fee at a designated bank and keep the receipt", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Upload the receipt and", description: "Upload the receipt and book a test slot", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 4, title: "Attend the BRTA office", description: "Attend the BRTA office for written and traffic tests", actionType: "VISIT_OFFICE" },
      { stepNumber: 5, title: "Collect the smart-card licence", description: "Collect the smart-card licence after approval", actionType: "PREPARE_DOCUMENTS" }
    ],
    requirements: [
      { name: "NID card", isMandatory: true, sortOrder: 1 },
      { name: "Learner licence certificate", isMandatory: true, sortOrder: 2 },
      { name: "Bank payment receipt (BSP challan)", isMandatory: true, sortOrder: 3 },
      { name: "Certificate from a registered doctor (fitness)", isMandatory: true, sortOrder: 4 },
      { name: "Passport-size photographs", isMandatory: true, sortOrder: 5 }
    ],
    fees: [
      { name: "৳345 for one vehicle category; ৳518 for two categories", amount: 345.00, currency: "BDT" }
    ],
    sources: [
      { title: "Bangladesh Road Transport Authority (BRTA)", url: "https://bsp.brta.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000007",
    categoryId: CATEGORY_IDS["transport"],
    name: "Vehicle Registration",
    slug: "vehicle-registration",
    shortDescription: "Register a newly purchased vehicle and get the registration certificate.",
    description: "Register a newly purchased vehicle and get the registration certificate.",
    eligibility: "Vehicle purchased from a registered dealer; Owner holds a valid NID card and driving licence",
    processingTime: "7–15 days",
    officialUrl: "https://bsp.brta.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply on the BRTA", description: "Apply on the BRTA BSP portal with vehicle documents", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Pay the registration fee", description: "Pay the registration fee at a designated bank", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Submit original documents at", description: "Submit original documents at the BRTA office", actionType: "VISIT_OFFICE" },
      { stepNumber: 4, title: "Collect the Registration Certificate", description: "Collect the Registration Certificate (Book) and number plate", actionType: "PREPARE_DOCUMENTS" }
    ],
    requirements: [
      { name: "Sale invoice and vehicle authenticity certificate (VAT/Green book)", isMandatory: true, sortOrder: 1 },
      { name: "Owner's NID card and driving licence", isMandatory: true, sortOrder: 2 },
      { name: "Insurance certificate", isMandatory: true, sortOrder: 3 },
      { name: "Bank payment receipt (challan)", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Varies by vehicle category and engine capacity", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Bangladesh Road Transport Authority (BRTA)", url: "https://bsp.brta.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000008",
    categoryId: CATEGORY_IDS["tax-finance"],
    name: "e-TIN Registration",
    slug: "e-tin",
    shortDescription: "Register for a Taxpayer Identification Number online.",
    description: "Register for a Taxpayer Identification Number online.",
    eligibility: "Individuals aged 18 or above with taxable income; Anyone needing a TIN for property, trade or employment purposes",
    processingTime: "Instant (online issuance)",
    officialUrl: "https://etax.nbr.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Open the e-Registration portal", description: "Open the e-Registration portal and create an account", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Fill in personal and", description: "Fill in personal and income source details", actionType: "OTHER" },
      { stepNumber: 3, title: "Submit and download the", description: "Submit and download the TIN certificate", actionType: "VISIT_OFFICIAL_PORTAL" }
    ],
    requirements: [
      { name: "NID card or passport", isMandatory: true, sortOrder: 1 },
      { name: "Valid mobile number and email address", isMandatory: true, sortOrder: 2 },
      { name: "TIN registration form (generated online)", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Free", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "National Board of Revenue (NBR)", url: "https://etax.nbr.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000009",
    categoryId: CATEGORY_IDS["tax-finance"],
    name: "Income Tax Return",
    slug: "income-tax-return",
    shortDescription: "File your annual income tax return online.",
    description: "File your annual income tax return online.",
    eligibility: "TIN holder with taxable income; Individuals required to file by the deadline set by NBR",
    processingTime: "Acknowledgement instantly; assessment varies",
    officialUrl: "https://etax.nbr.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Log in to the", description: "Log in to the e-Return portal", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Fill in income, deduction", description: "Fill in income, deduction and investment schedules", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Submit the return and", description: "Submit the return and download the acknowledgement", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 4, title: "Pay any due tax", description: "Pay any due tax through the e-challan system", actionType: "PREPARE_DOCUMENTS" }
    ],
    requirements: [
      { name: "TIN certificate", isMandatory: true, sortOrder: 1 },
      { name: "NID card", isMandatory: true, sortOrder: 2 },
      { name: "Income and deduction statements / employer certificate (Challan 6)", isMandatory: true, sortOrder: 3 },
      { name: "Bank statement (if applicable)", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Free (filing); tax liability as assessed", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "National Board of Revenue (NBR)", url: "https://etax.nbr.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000010",
    categoryId: CATEGORY_IDS["land-property"],
    name: "Land Mutation (নামজারি)",
    slug: "land-mutation",
    shortDescription: "Transfer land ownership records after purchase, inheritance or gift.",
    description: "Mutation (খতিয়ানের নাম পরিবর্তন) is completed at the Sub-Assistant Commissioner (Land) office of the relevant upazila after application through the land service portal or in person, with the verified deed registered at the Sub-Registrar.",
    eligibility: "Registered deed of sale / gift / inheritance (probate where applicable); Land taxes (khajna) up to date; Applicant recorded as the transferee in the deed",
    processingTime: "15–60 days (hearing dependent)",
    officialUrl: "https://land.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Collect the current khatian", description: "Collect the current khatian from the land service portal", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Apply at the SAC", description: "Apply at the SAC (Land) office with the registered deed", actionType: "VISIT_OFFICE" },
      { stepNumber: 3, title: "Publish hearing notice and", description: "Publish hearing notice and complete the hearing", actionType: "OTHER" },
      { stepNumber: 4, title: "Get mutation citation and", description: "Get mutation citation and updated khatian", actionType: "OTHER" },
      { stepNumber: 5, title: "Pay applicable land development", description: "Pay applicable land development tax", actionType: "PREPARE_DOCUMENTS" }
    ],
    requirements: [
      { name: "Registered deed (original and photocopy)", isMandatory: true, sortOrder: 1 },
      { name: "Latest khatian (download from land service portal)", isMandatory: true, sortOrder: 2 },
      { name: "Tax clearance / khajna receipt", isMandatory: true, sortOrder: 3 },
      { name: "NID card and photographs of the applicant", isMandatory: true, sortOrder: 4 },
      { name: "Deed writer's information sheet (chalana)", isMandatory: true, sortOrder: 5 }
    ],
    fees: [
      { name: "Government fee based on land value and mouja schedule", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Office of the Deputy Commissioner / SAC (Land)", url: "https://land.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000011",
    categoryId: CATEGORY_IDS["land-property"],
    name: "Land Development Tax (খাজনা)",
    slug: "land-development-tax",
    shortDescription: "Pay annual land development tax and get a receipt.",
    description: "Pay annual land development tax and get a receipt.",
    eligibility: "Recorded land owner of the relevant mouja; Tax must be paid within the government's fiscal schedule",
    processingTime: "Same day at the land office",
    officialUrl: "https://land.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Download the khatian or", description: "Download the khatian or dag details from the land service portal", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Calculate the tax at", description: "Calculate the tax at the land office or online", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 3, title: "Pay at the designated", description: "Pay at the designated bank / online channel", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 4, title: "Collect the electronic TTR", description: "Collect the electronic TTR receipt", actionType: "PREPARE_DOCUMENTS" }
    ],
    requirements: [
      { name: "Khatian / dag information", isMandatory: true, sortOrder: 1 },
      { name: "NID card", isMandatory: true, sortOrder: 2 },
      { name: "Previous tax receipt (if any)", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Based on land type and area (mouja schedule)", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Ministry of Land / District Commissioner Office", url: "https://land.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000012",
    categoryId: CATEGORY_IDS["police-legal"],
    name: "Police Clearance Certificate",
    slug: "police-clearance",
    shortDescription: "Apply for a police clearance (good conduct) certificate.",
    description: "Apply for a police clearance (good conduct) certificate.",
    eligibility: "Bangladeshi citizen aged 18 or above; NID card as identity proof; Needed for jobs, visas and higher study abroad",
    processingTime: "7–15 days",
    officialUrl: "https://pcc.police.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply online through the", description: "Apply online through the Police Clearance portal", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Pay the fee and", description: "Pay the fee and upload photographs", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Provide fingerprints at the", description: "Provide fingerprints at the assigned police office if required", actionType: "VISIT_OFFICE" },
      { stepNumber: 4, title: "Track the application and", description: "Track the application and download the certificate", actionType: "VISIT_OFFICIAL_PORTAL" }
    ],
    requirements: [
      { name: "NID card", isMandatory: true, sortOrder: 1 },
      { name: "Passport-size photographs", isMandatory: true, sortOrder: 2 },
      { name: "Present and permanent address proof", isMandatory: true, sortOrder: 3 },
      { name: "Fee receipt", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "৳500 (standard); express delivery fee is higher", amount: 500.00, currency: "BDT" }
    ],
    sources: [
      { title: "Bangladesh Police", url: "https://pcc.police.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000013",
    categoryId: CATEGORY_IDS["police-legal"],
    name: "General Diary (GD)",
    slug: "general-diary",
    shortDescription: "Record a General Diary at your local police station.",
    description: "Record a General Diary at your local police station.",
    eligibility: "Any citizen wishing to record an incident for future reference; No fee is required for filing a GD",
    processingTime: "Same day",
    officialUrl: "https://www.police.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Visit the police station", description: "Visit the police station covering your area", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Provide the incident details", description: "Provide the incident details in writing", actionType: "OTHER" },
      { stepNumber: 3, title: "Verify the GD entry", description: "Verify the GD entry in the station register and take a copy", actionType: "VISIT_OFFICE" }
    ],
    requirements: [
      { name: "NID card of the applicant", isMandatory: true, sortOrder: 1 },
      { name: "Details of the incident (written or dictated)", isMandatory: true, sortOrder: 2 }
    ],
    fees: [
      { name: "Free", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "Bangladesh Police", url: "https://www.police.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000014",
    categoryId: CATEGORY_IDS["business"],
    name: "Trade License (New)",
    slug: "trade-license",
    shortDescription: "Obtain a new trade license for your business.",
    description: "Obtain a new trade license for your business.",
    eligibility: "Business operating within the city/municipal boundary; Proprietor aged 18 or above with NID; No objection from neighbours where applicable",
    processingTime: "7–30 days",
    officialUrl: "https://www.businessone-stop.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply through the single-window", description: "Apply through the single-window business portal or ward office", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Submit documents and pay", description: "Submit documents and pay the fee", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Inspection by the licensing", description: "Inspection by the licensing inspector (if required)", actionType: "OTHER" },
      { stepNumber: 4, title: "Collect the trade license", description: "Collect the trade license", actionType: "PREPARE_DOCUMENTS" }
    ],
    requirements: [
      { name: "NID card and photographs", isMandatory: true, sortOrder: 1 },
      { name: "Rent agreement or ownership document of business premises", isMandatory: true, sortOrder: 2 },
      { name: "Holding tax receipt", isMandatory: true, sortOrder: 3 },
      { name: "Name clearance (for Ltd. / specific trades)", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Varies by trade category and business size", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "City Corporation / Municipality", url: "https://www.businessone-stop.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000015",
    categoryId: CATEGORY_IDS["business"],
    name: "Company Registration (RJSC)",
    slug: "company-registration",
    shortDescription: "Register a private limited company with RJSC.",
    description: "Register a private limited company with RJSC.",
    eligibility: "Minimum two directors and two shareholders (private limited); Registered office address inside Bangladesh",
    processingTime: "7–21 days",
    officialUrl: "https://roc.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Reserve the company name", description: "Reserve the company name (RUN)", actionType: "OTHER" },
      { stepNumber: 2, title: "Submit MOA, AOA and", description: "Submit MOA, AOA and forms with fees", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Receive the Certificate of", description: "Receive the Certificate of Incorporation", actionType: "OTHER" },
      { stepNumber: 4, title: "Register for VAT/TIN as", description: "Register for VAT/TIN as applicable", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Name clearance (RUN form)", isMandatory: true, sortOrder: 1 },
      { name: "Memorandum and Articles of Association", isMandatory: true, sortOrder: 2 },
      { name: "NID and TIN of directors/shareholders", isMandatory: true, sortOrder: 3 },
      { name: "Rent agreement of the registered office", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Based on authorized capital", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Registrar of Joint Stock Companies and Firms (RJSC)", url: "https://roc.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000016",
    categoryId: CATEGORY_IDS["education"],
    name: "Education Board Results",
    slug: "education-board-results",
    shortDescription: "Check SSC, HSC and equivalent examination results online.",
    description: "Check SSC, HSC and equivalent examination results online.",
    eligibility: "Candidates of SSC, HSC and equivalent examinations; Requires roll, registration and examination year",
    processingTime: "Instant",
    officialUrl: "https://www.educationboardresults.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Open the official results", description: "Open the official results portal", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Select examination type, year,", description: "Select examination type, year, board and enter roll/registration", actionType: "OTHER" },
      { stepNumber: 3, title: "Submit to view and", description: "Submit to view and print the result sheet", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Examination roll number", isMandatory: true, sortOrder: 1 },
      { name: "Registration number", isMandatory: true, sortOrder: 2 },
      { name: "Examination year", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Free", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "Ministry of Education / Education Boards", url: "https://www.educationboardresults.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000017",
    categoryId: CATEGORY_IDS["social-welfare"],
    name: "Old Age Allowance",
    slug: "old-age-allowance",
    shortDescription: "Apply for the monthly old age allowance (ভরণপোষণ ভাতা).",
    description: "Apply for the monthly old age allowance (ভরণপোষণ ভাতা).",
    eligibility: "Bangladeshi citizen aged 65 or above; Family income below the government threshold; Registered voter with NID",
    processingTime: "1–3 months (selection list dependent)",
    officialUrl: null,
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Submit the application at", description: "Submit the application at the Union Parishad / Ward office", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Verification by the social", description: "Verification by the social services officer", actionType: "VISIT_OFFICE" },
      { stepNumber: 3, title: "Selection in the upazila-approved", description: "Selection in the upazila-approved list", actionType: "OTHER" },
      { stepNumber: 4, title: "Receive allowance through the", description: "Receive allowance through the designated bank/mobile channel", actionType: "OTHER" }
    ],
    requirements: [
      { name: "NID card (age proof)", isMandatory: true, sortOrder: 1 },
      { name: "Recommended by Union Parishad / Ward Councillor", isMandatory: true, sortOrder: 2 },
      { name: "Photographs and bank account information", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Free", amount: 0.00, currency: "BDT" }
    ],
    sources: [

    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000018",
    categoryId: CATEGORY_IDS["health"],
    name: "Government Hospital Services",
    slug: "government-hospital-services",
    shortDescription: "Find government hospitals, departments and OPD service hours.",
    description: "Find government hospitals, departments and OPD service hours.",
    eligibility: "Open to all citizens; Some specialized services require referral",
    processingTime: "Same day (OPD)",
    officialUrl: null,
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Find the nearest government", description: "Find the nearest government hospital", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Visit the OPD counter", description: "Visit the OPD counter with your NID", actionType: "VISIT_OFFICE" },
      { stepNumber: 3, title: "Collect a token and", description: "Collect a token and consult the duty doctor", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 4, title: "Collect medicine from the", description: "Collect medicine from the hospital pharmacy", actionType: "VISIT_OFFICE" }
    ],
    requirements: [
      { name: "NID card (for admission / discount schemes)", isMandatory: true, sortOrder: 1 }
    ],
    fees: [
      { name: "Free or nominal fee at government hospitals", amount: 0.00, currency: "BDT" }
    ],
    sources: [

    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000019",
    categoryId: CATEGORY_IDS["local-government"],
    name: "Union Parishad Certificates",
    slug: "union-parishad-certificates",
    shortDescription: "Get citizenship, residence and family certificates from Union Parishad.",
    description: "Get citizenship, residence and family certificates from Union Parishad.",
    eligibility: "Permanent residents of the Union Parishad area; Valid NID with matching address information",
    processingTime: "1–7 days",
    officialUrl: null,
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Collect the application form", description: "Collect the application form from the Union Parishad office", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Fill in the purpose", description: "Fill in the purpose and attach documents", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Submit and collect the", description: "Submit and collect the certified copy after verification", actionType: "PREPARE_DOCUMENTS" }
    ],
    requirements: [
      { name: "NID card", isMandatory: true, sortOrder: 1 },
      { name: "Photographs", isMandatory: true, sortOrder: 2 },
      { name: "Supporting documents (electricity bill / holding receipt) where needed", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Free to nominal fee", amount: 0.00, currency: "BDT" }
    ],
    sources: [

    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000020",
    categoryId: CATEGORY_IDS["local-government"],
    name: "Holding Tax (উন্নয়ন কর)",
    slug: "holding-tax",
    shortDescription: "Pay annual holding/property development tax.",
    description: "Pay annual holding/property development tax.",
    eligibility: "Owner of a recorded holding within the city/municipal area",
    processingTime: "Same day",
    officialUrl: null,
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Find your holding number", description: "Find your holding number at the zonal office", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Calculate dues for the", description: "Calculate dues for the fiscal year", actionType: "OTHER" },
      { stepNumber: 3, title: "Pay at the designated", description: "Pay at the designated bank or online channel", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 4, title: "Collect the receipt", description: "Collect the receipt", actionType: "PREPARE_DOCUMENTS" }
    ],
    requirements: [
      { name: "Holding number", isMandatory: true, sortOrder: 1 },
      { name: "Previous tax receipt", isMandatory: true, sortOrder: 2 },
      { name: "NID card", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Based on holding category and area", amount: null, currency: "BDT" }
    ],
    sources: [

    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000021",
    categoryId: CATEGORY_IDS["agriculture"],
    name: "Farmer Subsidy Services",
    slug: "farmer-subsidy",
    shortDescription: "Information on input subsidies, seeds and farmer registration.",
    description: "Information on input subsidies, seeds and farmer registration.",
    eligibility: "Registered farmers with verifiable land/lease information; Program-specific criteria published by the department",
    processingTime: "Program dependent",
    officialUrl: null,
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Visit the upazila Agriculture", description: "Visit the upazila Agriculture Office", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Register as a farmer", description: "Register as a farmer with supporting documents", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Apply for the relevant", description: "Apply for the relevant subsidy program", actionType: "OTHER" },
      { stepNumber: 4, title: "Track approval through the", description: "Track approval through the office", actionType: "VISIT_OFFICE" }
    ],
    requirements: [
      { name: "NID card", isMandatory: true, sortOrder: 1 },
      { name: "Land ownership or lease documents", isMandatory: true, sortOrder: 2 },
      { name: "Passport-size photographs", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Free", amount: 0.00, currency: "BDT" }
    ],
    sources: [

    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000022",
    categoryId: CATEGORY_IDS["identity-documents"],
    name: "Birth Certificate Copy (Online)",
    slug: "birth-certificate-copy",
    shortDescription: "Download a certified copy of an existing birth certificate.",
    description: "Download a certified copy of an existing birth certificate.",
    eligibility: "The birth must already be registered with BDRIS; Requester's details must match the registration record",
    processingTime: "Instant download",
    officialUrl: "https://www.bdris.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Open the BDRIS verification", description: "Open the BDRIS verification portal", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Enter registration number and", description: "Enter registration number and birth date", actionType: "OTHER" },
      { stepNumber: 3, title: "Download the verified copy", description: "Download the verified copy", actionType: "VISIT_OFFICIAL_PORTAL" }
    ],
    requirements: [
      { name: "Registration number", isMandatory: true, sortOrder: 1 },
      { name: "Date of birth", isMandatory: true, sortOrder: 2 },
      { name: "Father's / mother's name", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Free (online copy)", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "Office of the Registrar General, Birth & Death Registration", url: "https://www.bdris.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000023",
    categoryId: CATEGORY_IDS["identity-documents"],
    name: "NID Reissue (Lost/Damaged)",
    slug: "nid-reissue",
    shortDescription: "Reissue your National ID card if it is lost, stolen or damaged.",
    description: "Reissue your National ID card if it is lost, stolen or damaged.",
    eligibility: null,
    processingTime: "7–15 days",
    officialUrl: "https://services.nidw.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Log in to the", description: "Log in to the NID service portal", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Select reissue option and", description: "Select reissue option and reason", actionType: "OTHER" },
      { stepNumber: 3, title: "Upload documents and pay", description: "Upload documents and pay fee", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 4, title: "Track delivery of the", description: "Track delivery of the new card", actionType: "READ_GUIDE" }
    ],
    requirements: [

    ],
    fees: [
      { name: "Card reprint fee applies", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Bangladesh Election Commission", url: "https://services.nidw.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000024",
    categoryId: CATEGORY_IDS["identity-documents"],
    name: "Citizenship Certificate",
    slug: "citizenship-certificate",
    shortDescription: "Obtain a citizenship certificate from the District/Upazila office.",
    description: "Obtain a citizenship certificate from the District/Upazila office.",
    eligibility: "Bangladeshi citizen; Valid address proof",
    processingTime: "3–7 days",
    officialUrl: null,
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Collect form from the", description: "Collect form from the UNO/ADC office", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Fill and attach documents", description: "Fill and attach documents", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Submit and receive certificate", description: "Submit and receive certificate", actionType: "OTHER" }
    ],
    requirements: [
      { name: "NID card", isMandatory: true, sortOrder: 1 },
      { name: "Birth certificate", isMandatory: true, sortOrder: 2 },
      { name: "Address proof", isMandatory: true, sortOrder: 3 },
      { name: "Passport-size photographs", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Nominal fee", amount: null, currency: "BDT" }
    ],
    sources: [

    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000025",
    categoryId: CATEGORY_IDS["identity-documents"],
    name: "Death Certificate Copy (Online)",
    slug: "death-certificate-copy",
    shortDescription: "Download a certified copy of an existing death certificate.",
    description: "Download a certified copy of an existing death certificate.",
    eligibility: "Death must already be registered with BDRIS",
    processingTime: "Instant download",
    officialUrl: "https://www.bdris.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Open BDRIS verification portal", description: "Open BDRIS verification portal", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Enter registration number and", description: "Enter registration number and date", actionType: "OTHER" },
      { stepNumber: 3, title: "Download verified copy", description: "Download verified copy", actionType: "VISIT_OFFICIAL_PORTAL" }
    ],
    requirements: [
      { name: "Registration number", isMandatory: true, sortOrder: 1 },
      { name: "Date of death", isMandatory: true, sortOrder: 2 },
      { name: "Deceased's name", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Free (online copy)", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "Office of the Registrar General, Birth & Death Registration", url: "https://www.bdris.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000026",
    categoryId: CATEGORY_IDS["identity-documents"],
    name: "Nationality Certificate",
    slug: "nationality-certificate",
    shortDescription: "Get a nationality certificate for study, job or visa purposes.",
    description: "Get a nationality certificate for study, job or visa purposes.",
    eligibility: "Bangladeshi citizen with valid NID",
    processingTime: "3–7 days",
    officialUrl: null,
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply at UNO/ADC office", description: "Apply at UNO/ADC office", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Collect certificate", description: "Collect certificate", actionType: "PREPARE_DOCUMENTS" }
    ],
    requirements: [
      { name: "NID card", isMandatory: true, sortOrder: 1 },
      { name: "Birth certificate", isMandatory: true, sortOrder: 2 },
      { name: "Address proof", isMandatory: true, sortOrder: 3 },
      { name: "Passport-size photographs", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Nominal fee", amount: null, currency: "BDT" }
    ],
    sources: [

    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000027",
    categoryId: CATEGORY_IDS["passport-immigration"],
    name: "e-Passport (Lost/Damaged Reissue)",
    slug: "epassport-lost",
    shortDescription: "Reissue your e-Passport if lost or damaged.",
    description: "Reissue your e-Passport if lost or damaged.",
    eligibility: "Existing passport holder; GD/FIR for lost passport",
    processingTime: "7–21 days",
    officialUrl: "https://www.epassport.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "File GD at police", description: "File GD at police station", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Apply online on e-Passport", description: "Apply online on e-Passport portal", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 3, title: "Visit passport office for", description: "Visit passport office for biometrics", actionType: "VISIT_OFFICE" },
      { stepNumber: 4, title: "Collect new passport", description: "Collect new passport", actionType: "PREPARE_DOCUMENTS" }
    ],
    requirements: [
      { name: "GD copy (if lost)", isMandatory: true, sortOrder: 1 },
      { name: "Damaged passport (if damaged)", isMandatory: true, sortOrder: 2 },
      { name: "NID card", isMandatory: true, sortOrder: 3 },
      { name: "Photographs", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Reissue fee applies", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Department of Immigration & Passports", url: "https://www.epassport.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000028",
    categoryId: CATEGORY_IDS["passport-immigration"],
    name: "Visa Services (Bangladesh)",
    slug: "visa-services",
    shortDescription: "Information and application for Bangladesh visa for foreigners.",
    description: "Information and application for Bangladesh visa for foreigners.",
    eligibility: "Foreign nationals; Valid passport",
    processingTime: "3–10 days",
    officialUrl: "https://www.visa.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Submit application at Bangladesh", description: "Submit application at Bangladesh mission/online", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Visa issuance", description: "Visa issuance", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Passport", isMandatory: true, sortOrder: 1 },
      { name: "Application form", isMandatory: true, sortOrder: 2 },
      { name: "Photographs", isMandatory: true, sortOrder: 3 },
      { name: "Supporting documents", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Visa fee as per nationality", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Ministry of Home Affairs / Bangladesh Missions", url: "https://www.visa.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000029",
    categoryId: CATEGORY_IDS["passport-immigration"],
    name: "Immigration Clearance (Emigration)",
    slug: "immigration-clearance",
    shortDescription: "Emigration clearance for workers going abroad.",
    description: "Emigration clearance for workers going abroad.",
    eligibility: "Prospective migrant workers; Valid passport and visa",
    processingTime: "1–3 days",
    officialUrl: "https://www.bmet.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply online", description: "Apply online", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Document verification", description: "Document verification", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Receive clearance", description: "Receive clearance", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Passport", isMandatory: true, sortOrder: 1 },
      { name: "Visa", isMandatory: true, sortOrder: 2 },
      { name: "Medical certificate", isMandatory: true, sortOrder: 3 },
      { name: "Training certificate", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Clearance fee applies", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Bureau of Manpower, Employment and Training (BMET)", url: "https://www.bmet.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000030",
    categoryId: CATEGORY_IDS["passport-immigration"],
    name: "Passport Information Correction",
    slug: "passport-correction",
    shortDescription: "Correct personal information on an existing passport.",
    description: "Correct personal information on an existing passport.",
    eligibility: "Passport holder with incorrect data",
    processingTime: "7–15 days",
    officialUrl: "https://www.epassport.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply at passport office", description: "Apply at passport office", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Submit supporting docs", description: "Submit supporting docs", actionType: "OTHER" },
      { stepNumber: 3, title: "Receive corrected passport", description: "Receive corrected passport", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Passport", isMandatory: true, sortOrder: 1 },
      { name: "Supporting document", isMandatory: true, sortOrder: 2 },
      { name: "Application form", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Correction fee applies", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Department of Immigration & Passports", url: "https://www.epassport.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000031",
    categoryId: CATEGORY_IDS["transport"],
    name: "Driving License Renewal",
    slug: "driving-license-renewal",
    shortDescription: "Renew your driving license before or after expiry.",
    description: "Renew your driving license before or after expiry.",
    eligibility: "Existing driving license holder",
    processingTime: "3–7 days",
    officialUrl: "https://bsp.brta.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply online on BRTA", description: "Apply online on BRTA portal", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Pay fee", description: "Pay fee", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Visit BRTA office for", description: "Visit BRTA office for biometrics", actionType: "VISIT_OFFICE" },
      { stepNumber: 4, title: "Collect renewed license", description: "Collect renewed license", actionType: "PREPARE_DOCUMENTS" }
    ],
    requirements: [
      { name: "Driving license", isMandatory: true, sortOrder: 1 },
      { name: "NID card", isMandatory: true, sortOrder: 2 },
      { name: "Medical certificate (if required)", isMandatory: true, sortOrder: 3 },
      { name: "Photographs", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Renewal fee applies", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Bangladesh Road Transport Authority (BRTA)", url: "https://bsp.brta.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000032",
    categoryId: CATEGORY_IDS["transport"],
    name: "Vehicle Fitness Certificate",
    slug: "vehicle-fitness",
    shortDescription: "Obtain or renew the annual fitness certificate for a vehicle.",
    description: "Obtain or renew the annual fitness certificate for a vehicle.",
    eligibility: "Registered vehicle owner",
    processingTime: "1–3 days",
    officialUrl: "https://bsp.brta.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Book inspection slot online", description: "Book inspection slot online", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Vehicle inspection at BRTA", description: "Vehicle inspection at BRTA", actionType: "OTHER" },
      { stepNumber: 3, title: "Receive fitness certificate", description: "Receive fitness certificate", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Registration certificate", isMandatory: true, sortOrder: 1 },
      { name: "Tax token", isMandatory: true, sortOrder: 2 },
      { name: "Insurance", isMandatory: true, sortOrder: 3 },
      { name: "NID card", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Fitness fee by vehicle type", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Bangladesh Road Transport Authority (BRTA)", url: "https://bsp.brta.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000033",
    categoryId: CATEGORY_IDS["transport"],
    name: "Vehicle Tax Token",
    slug: "vehicle-tax-token",
    shortDescription: "Pay and download the annual vehicle tax token.",
    description: "Pay and download the annual vehicle tax token.",
    eligibility: "Registered vehicle owner",
    processingTime: "Same day",
    officialUrl: "https://bsp.brta.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply online", description: "Apply online", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Pay tax", description: "Pay tax", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Download tax token", description: "Download tax token", actionType: "VISIT_OFFICIAL_PORTAL" }
    ],
    requirements: [
      { name: "Registration number", isMandatory: true, sortOrder: 1 },
      { name: "Previous tax token", isMandatory: true, sortOrder: 2 },
      { name: "Insurance", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Based on vehicle type and engine capacity", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Bangladesh Road Transport Authority (BRTA)", url: "https://bsp.brta.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000034",
    categoryId: CATEGORY_IDS["transport"],
    name: "Vehicle Ownership Transfer",
    slug: "vehicle-transfer",
    shortDescription: "Transfer vehicle ownership after sale.",
    description: "Transfer vehicle ownership after sale.",
    eligibility: "Buyer and seller with valid documents",
    processingTime: "7–15 days",
    officialUrl: "https://bsp.brta.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply online", description: "Apply online", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Document verification", description: "Document verification", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Biometric of buyer/seller", description: "Biometric of buyer/seller", actionType: "OTHER" },
      { stepNumber: 4, title: "Receive new registration", description: "Receive new registration", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Sale agreement", isMandatory: true, sortOrder: 1 },
      { name: "Registration certificate", isMandatory: true, sortOrder: 2 },
      { name: "Tax token", isMandatory: true, sortOrder: 3 },
      { name: "NID of both parties", isMandatory: true, sortOrder: 4 },
      { name: "Insurance", isMandatory: true, sortOrder: 5 }
    ],
    fees: [
      { name: "Transfer fee applies", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Bangladesh Road Transport Authority (BRTA)", url: "https://bsp.brta.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000035",
    categoryId: CATEGORY_IDS["transport"],
    name: "Route Permit (Commercial Vehicle)",
    slug: "route-permit",
    shortDescription: "Obtain route permit for commercial/public transport vehicles.",
    description: "Obtain route permit for commercial/public transport vehicles.",
    eligibility: "Commercial vehicle owner; Valid registration and fitness",
    processingTime: "3–7 days",
    officialUrl: "https://bsp.brta.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply online", description: "Apply online", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Receive route permit", description: "Receive route permit", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Registration certificate", isMandatory: true, sortOrder: 1 },
      { name: "Fitness certificate", isMandatory: true, sortOrder: 2 },
      { name: "Tax token", isMandatory: true, sortOrder: 3 },
      { name: "Insurance", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Permit fee by route", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Bangladesh Road Transport Authority (BRTA)", url: "https://bsp.brta.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000036",
    categoryId: CATEGORY_IDS["tax-finance"],
    name: "VAT Registration",
    slug: "vat-registration",
    shortDescription: "Register for VAT (BIN) with the National Board of Revenue.",
    description: "Register for VAT (BIN) with the National Board of Revenue.",
    eligibility: "Businesses with taxable turnover; Importers/exporters",
    processingTime: "3–7 days",
    officialUrl: "https://nbr.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply on NBR VAT", description: "Apply on NBR VAT portal", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Upload documents", description: "Upload documents", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 4, title: "Receive BIN certificate", description: "Receive BIN certificate", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Trade license", isMandatory: true, sortOrder: 1 },
      { name: "TIN", isMandatory: true, sortOrder: 2 },
      { name: "Bank statement", isMandatory: true, sortOrder: 3 },
      { name: "NID", isMandatory: true, sortOrder: 4 },
      { name: "Photographs", isMandatory: true, sortOrder: 5 }
    ],
    fees: [
      { name: "Free registration", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "National Board of Revenue (NBR)", url: "https://nbr.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000037",
    categoryId: CATEGORY_IDS["tax-finance"],
    name: "VAT Return Filing",
    slug: "vat-return",
    shortDescription: "File monthly VAT return online.",
    description: "File monthly VAT return online.",
    eligibility: "Registered VAT taxpayers",
    processingTime: "Same day",
    officialUrl: "https://nbr.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Log in to NBR", description: "Log in to NBR VAT portal", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Enter return data", description: "Enter return data", actionType: "OTHER" },
      { stepNumber: 3, title: "Submit and download acknowledgement", description: "Submit and download acknowledgement", actionType: "VISIT_OFFICIAL_PORTAL" }
    ],
    requirements: [
      { name: "BIN", isMandatory: true, sortOrder: 1 },
      { name: "Sales/purchase records", isMandatory: true, sortOrder: 2 },
      { name: "Previous returns", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Free filing", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "National Board of Revenue (NBR)", url: "https://nbr.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000038",
    categoryId: CATEGORY_IDS["tax-finance"],
    name: "Income Tax Certificate",
    slug: "income-tax-certificate",
    shortDescription: "Download income tax certificate / acknowledgement.",
    description: "Download income tax certificate / acknowledgement.",
    eligibility: "Taxpayers who filed return",
    processingTime: "Instant download",
    officialUrl: "https://etaxnbr.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Log in to e-Return", description: "Log in to e-Return portal", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Download certificate", description: "Download certificate", actionType: "VISIT_OFFICIAL_PORTAL" }
    ],
    requirements: [
      { name: "TIN", isMandatory: true, sortOrder: 1 },
      { name: "Return acknowledgement", isMandatory: true, sortOrder: 2 }
    ],
    fees: [
      { name: "Free", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "National Board of Revenue (NBR)", url: "https://etaxnbr.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000039",
    categoryId: CATEGORY_IDS["tax-finance"],
    name: "Tax Deducted at Source (TDS) Certificate",
    slug: "tds-certificate",
    shortDescription: "Obtain TDS certificate for deducted tax.",
    description: "Obtain TDS certificate for deducted tax.",
    eligibility: "Taxpayers with TDS deductions",
    processingTime: "As per authority",
    officialUrl: "https://nbr.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply at tax office", description: "Apply at tax office", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Receive certificate", description: "Receive certificate", actionType: "OTHER" }
    ],
    requirements: [
      { name: "TIN", isMandatory: true, sortOrder: 1 },
      { name: "Deduction statements", isMandatory: true, sortOrder: 2 }
    ],
    fees: [
      { name: "Free", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "National Board of Revenue (NBR)", url: "https://nbr.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000040",
    categoryId: CATEGORY_IDS["land-property"],
    name: "Khatian Copy (Land Record)",
    slug: "khatian-copy",
    shortDescription: "Download certified copy of land khatian/record of rights.",
    description: "Download certified copy of land khatian/record of rights.",
    eligibility: "Land owner or interested party",
    processingTime: "1–3 days",
    officialUrl: "https://land.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply on land portal", description: "Apply on land portal", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Pay fee", description: "Pay fee", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Download khatian copy", description: "Download khatian copy", actionType: "VISIT_OFFICIAL_PORTAL" }
    ],
    requirements: [
      { name: "Khatian number", isMandatory: true, sortOrder: 1 },
      { name: "Mouza", isMandatory: true, sortOrder: 2 },
      { name: "Plot number", isMandatory: true, sortOrder: 3 },
      { name: "NID", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Copy fee applies", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Ministry of Land", url: "https://land.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000041",
    categoryId: CATEGORY_IDS["land-property"],
    name: "Land Record Correction",
    slug: "land-record-correction",
    shortDescription: "Correct errors in land records/khatian.",
    description: "Correct errors in land records/khatian.",
    eligibility: "Land owner with valid documents",
    processingTime: "15–30 days",
    officialUrl: "https://land.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply at land office", description: "Apply at land office", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Correction and reissue", description: "Correction and reissue", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Khatian", isMandatory: true, sortOrder: 1 },
      { name: "Supporting documents", isMandatory: true, sortOrder: 2 },
      { name: "NID", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Correction fee applies", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Assistant Commissioner (Land)", url: "https://land.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000042",
    categoryId: CATEGORY_IDS["land-property"],
    name: "Land/Plot Registration",
    slug: "plot-registration",
    shortDescription: "Register a land/plot sale deed at sub-registrar office.",
    description: "Register a land/plot sale deed at sub-registrar office.",
    eligibility: "Buyer and seller; Valid land documents",
    processingTime: "1–7 days",
    officialUrl: null,
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Prepare deed", description: "Prepare deed", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 2, title: "Submit at sub-registrar office", description: "Submit at sub-registrar office", actionType: "VISIT_OFFICE" },
      { stepNumber: 3, title: "Registration and mutation follow-up", description: "Registration and mutation follow-up", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Sale deed", isMandatory: true, sortOrder: 1 },
      { name: "Khatian", isMandatory: true, sortOrder: 2 },
      { name: "NID of both parties", isMandatory: true, sortOrder: 3 },
      { name: "Tax clearance", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Registration fee by value", amount: null, currency: "BDT" }
    ],
    sources: [

    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000043",
    categoryId: CATEGORY_IDS["land-property"],
    name: "Land Survey (PoroSheba)",
    slug: "land-survey",
    shortDescription: "Request land survey and updated mouza map.",
    description: "Request land survey and updated mouza map.",
    eligibility: "Land owner",
    processingTime: "15–45 days",
    officialUrl: "https://land.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply at land office", description: "Apply at land office", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Survey by surveyor", description: "Survey by surveyor", actionType: "OTHER" },
      { stepNumber: 3, title: "Receive updated record", description: "Receive updated record", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Khatian", isMandatory: true, sortOrder: 1 },
      { name: "Plot details", isMandatory: true, sortOrder: 2 },
      { name: "NID", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Survey fee applies", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Department of Land Records and Surveys", url: "https://land.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000044",
    categoryId: CATEGORY_IDS["education"],
    name: "SSC Certificate (Secondary School)",
    slug: "ssc-certificate",
    shortDescription: "Obtain SSC/equivalent certificate from education board.",
    description: "Obtain SSC/equivalent certificate from education board.",
    eligibility: "SSC candidate who passed",
    processingTime: "7–15 days",
    officialUrl: "https://www.educationboardresults.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply to the respective", description: "Apply to the respective education board", actionType: "OTHER" },
      { stepNumber: 2, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Receive certificate", description: "Receive certificate", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Roll number", isMandatory: true, sortOrder: 1 },
      { name: "Registration number", isMandatory: true, sortOrder: 2 },
      { name: "Passport-size photographs", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Certificate fee applies", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Directorate of Secondary & Higher Education / Education Boards", url: "https://www.educationboardresults.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000045",
    categoryId: CATEGORY_IDS["education"],
    name: "HSC Certificate (Higher Secondary)",
    slug: "hsc-certificate",
    shortDescription: "Obtain HSC/equivalent certificate from education board.",
    description: "Obtain HSC/equivalent certificate from education board.",
    eligibility: "HSC candidate who passed",
    processingTime: "7–15 days",
    officialUrl: "https://www.educationboardresults.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply to the respective", description: "Apply to the respective education board", actionType: "OTHER" },
      { stepNumber: 2, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Receive certificate", description: "Receive certificate", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Roll number", isMandatory: true, sortOrder: 1 },
      { name: "Registration number", isMandatory: true, sortOrder: 2 },
      { name: "Photographs", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Certificate fee applies", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Education Boards", url: "https://www.educationboardresults.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000046",
    categoryId: CATEGORY_IDS["education"],
    name: "Certificate Reissue (Lost/Damaged)",
    slug: "certificate-reissue",
    shortDescription: "Reissue SSC/HSC certificate if lost or damaged.",
    description: "Reissue SSC/HSC certificate if lost or damaged.",
    eligibility: "Candidate with lost/damaged certificate",
    processingTime: "15–30 days",
    officialUrl: "https://www.educationboardresults.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "File GD at police", description: "File GD at police station (if lost)", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Apply to board with", description: "Apply to board with documents", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 4, title: "Receive reissued certificate", description: "Receive reissued certificate", actionType: "OTHER" }
    ],
    requirements: [
      { name: "GD/FIR (if lost)", isMandatory: true, sortOrder: 1 },
      { name: "Damaged certificate (if damaged)", isMandatory: true, sortOrder: 2 },
      { name: "Roll/registration details", isMandatory: true, sortOrder: 3 },
      { name: "NID", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Reissue fee applies", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Education Boards", url: "https://www.educationboardresults.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000047",
    categoryId: CATEGORY_IDS["education"],
    name: "Name Correction in Certificate",
    slug: "name-correction-certificate",
    shortDescription: "Correct name or other details on an education certificate.",
    description: "Correct name or other details on an education certificate.",
    eligibility: "Certificate holder with incorrect details",
    processingTime: "30–60 days",
    officialUrl: null,
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply to board with", description: "Apply to board with supporting docs", actionType: "OTHER" },
      { stepNumber: 2, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Receive corrected certificate", description: "Receive corrected certificate", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Certificate", isMandatory: true, sortOrder: 1 },
      { name: "Birth certificate/NID", isMandatory: true, sortOrder: 2 },
      { name: "Affidavit", isMandatory: true, sortOrder: 3 },
      { name: "Application form", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Correction fee applies", amount: null, currency: "BDT" }
    ],
    sources: [

    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000048",
    categoryId: CATEGORY_IDS["education"],
    name: "Scholarship (Government)",
    slug: "scholarship",
    shortDescription: "Apply for government scholarships (primary/secondary/higher).",
    description: "Apply for government scholarships (primary/secondary/higher).",
    eligibility: "Students meeting merit/need criteria",
    processingTime: "Program dependent",
    officialUrl: "https://dshe.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply online during window", description: "Apply online during window", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Document verification", description: "Document verification", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Selection and disbursement", description: "Selection and disbursement", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Transcript", isMandatory: true, sortOrder: 1 },
      { name: "Income certificate", isMandatory: true, sortOrder: 2 },
      { name: "NID/Birth certificate", isMandatory: true, sortOrder: 3 },
      { name: "Bank details", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Free application", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "Ministry of Education / DSHE", url: "https://dshe.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000049",
    categoryId: CATEGORY_IDS["education"],
    name: "Equivalence Certificate",
    slug: "equivalence-certificate",
    shortDescription: "Equivalence certificate for foreign qualifications.",
    description: "Equivalence certificate for foreign qualifications.",
    eligibility: "Holders of foreign certificates",
    processingTime: "15–30 days",
    officialUrl: "https://moedu.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply to Ministry of", description: "Apply to Ministry of Education", actionType: "OTHER" },
      { stepNumber: 2, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Receive equivalence certificate", description: "Receive equivalence certificate", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Foreign certificate", isMandatory: true, sortOrder: 1 },
      { name: "Transcript", isMandatory: true, sortOrder: 2 },
      { name: "Passport", isMandatory: true, sortOrder: 3 },
      { name: "NID", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Fee applies", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Ministry of Education", url: "https://moedu.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000050",
    categoryId: CATEGORY_IDS["education"],
    name: "Migration Certificate",
    slug: "migration-certificate",
    shortDescription: "Obtain migration certificate to change education board.",
    description: "Obtain migration certificate to change education board.",
    eligibility: "Students transferring between boards",
    processingTime: "7–15 days",
    officialUrl: null,
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply to current board", description: "Apply to current board", actionType: "OTHER" },
      { stepNumber: 2, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Receive migration certificate", description: "Receive migration certificate", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Previous certificate", isMandatory: true, sortOrder: 1 },
      { name: "Application form", isMandatory: true, sortOrder: 2 },
      { name: "NID/Birth certificate", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Fee applies", amount: null, currency: "BDT" }
    ],
    sources: [

    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000051",
    categoryId: CATEGORY_IDS["education"],
    name: "Transcript / Marksheet Copy",
    slug: "transcript",
    shortDescription: "Get transcript or marksheet copy.",
    description: "Get transcript or marksheet copy.",
    eligibility: "Passed candidates",
    processingTime: "7–15 days",
    officialUrl: null,
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply to board", description: "Apply to board", actionType: "OTHER" },
      { stepNumber: 2, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Receive transcript", description: "Receive transcript", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Roll number", isMandatory: true, sortOrder: 1 },
      { name: "Registration number", isMandatory: true, sortOrder: 2 },
      { name: "Application form", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Fee applies", amount: null, currency: "BDT" }
    ],
    sources: [

    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000052",
    categoryId: CATEGORY_IDS["education"],
    name: "Board Registration (SSC/HSC)",
    slug: "board-registration",
    shortDescription: "Register for SSC/HSC examination with an education board.",
    description: "Register for SSC/HSC examination with an education board.",
    eligibility: "Students of affiliated institutions",
    processingTime: "As per board schedule",
    officialUrl: null,
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "School submits registration", description: "School submits registration", actionType: "OTHER" },
      { stepNumber: 2, title: "Board verification", description: "Board verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Receive registration card", description: "Receive registration card", actionType: "OTHER" }
    ],
    requirements: [
      { name: "School certificate", isMandatory: true, sortOrder: 1 },
      { name: "Birth certificate", isMandatory: true, sortOrder: 2 },
      { name: "Photographs", isMandatory: true, sortOrder: 3 },
      { name: "Fees", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Registration fee applies", amount: null, currency: "BDT" }
    ],
    sources: [

    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000053",
    categoryId: CATEGORY_IDS["health"],
    name: "Vaccination Services",
    slug: "vaccination",
    shortDescription: "Government vaccination programs (EPI, COVID-19, etc.).",
    description: "Government vaccination programs (EPI, COVID-19, etc.).",
    eligibility: "Eligible citizens per program",
    processingTime: "Same day",
    officialUrl: "https://dghs.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Visit nearest vaccination centre", description: "Visit nearest vaccination centre", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Register", description: "Register", actionType: "OTHER" },
      { stepNumber: 3, title: "Receive vaccine and card", description: "Receive vaccine and card", actionType: "OTHER" }
    ],
    requirements: [
      { name: "NID/Birth certificate", isMandatory: true, sortOrder: 1 },
      { name: "Vaccination card", isMandatory: true, sortOrder: 2 }
    ],
    fees: [
      { name: "Free", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "Directorate General of Health Services (DGHS)", url: "https://dghs.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000054",
    categoryId: CATEGORY_IDS["health"],
    name: "Medical Certificate",
    slug: "medical-certificate",
    shortDescription: "Obtain medical fitness certificate from government hospital.",
    description: "Obtain medical fitness certificate from government hospital.",
    eligibility: "Applicants needing medical fitness",
    processingTime: "1–3 days",
    officialUrl: "https://dghs.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Visit government hospital", description: "Visit government hospital", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Medical examination", description: "Medical examination", actionType: "OTHER" },
      { stepNumber: 3, title: "Receive certificate", description: "Receive certificate", actionType: "OTHER" }
    ],
    requirements: [
      { name: "NID", isMandatory: true, sortOrder: 1 },
      { name: "Hospital slip", isMandatory: true, sortOrder: 2 },
      { name: "Photographs", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Nominal fee", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Directorate General of Health Services (DGHS)", url: "https://dghs.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000055",
    categoryId: CATEGORY_IDS["health"],
    name: "Health Card / Family Health Card",
    slug: "health-card",
    shortDescription: "Register for community health/family health card.",
    description: "Register for community health/family health card.",
    eligibility: "Residents of catchment area",
    processingTime: "3–7 days",
    officialUrl: "https://dghs.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Visit community clinic/health centre", description: "Visit community clinic/health centre", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Register", description: "Register", actionType: "OTHER" },
      { stepNumber: 3, title: "Receive health card", description: "Receive health card", actionType: "OTHER" }
    ],
    requirements: [
      { name: "NID", isMandatory: true, sortOrder: 1 },
      { name: "Address proof", isMandatory: true, sortOrder: 2 },
      { name: "Photographs", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Free/nominal", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "Directorate General of Health Services (DGHS)", url: "https://dghs.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000056",
    categoryId: CATEGORY_IDS["health"],
    name: "Blood Bank Services",
    slug: "blood-bank",
    shortDescription: "Government blood bank and donation services.",
    description: "Government blood bank and donation services.",
    eligibility: "Donors and patients",
    processingTime: "Same day",
    officialUrl: "https://dghs.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Visit blood bank", description: "Visit blood bank", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Screening", description: "Screening", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Donation/issue", description: "Donation/issue", actionType: "OTHER" }
    ],
    requirements: [
      { name: "NID", isMandatory: true, sortOrder: 1 },
      { name: "Blood group report", isMandatory: true, sortOrder: 2 }
    ],
    fees: [
      { name: "Free donation; nominal processing fee", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "Directorate General of Health Services (DGHS)", url: "https://dghs.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000057",
    categoryId: CATEGORY_IDS["health"],
    name: "Family Planning Services",
    slug: "family-planning",
    shortDescription: "Government family planning and reproductive health services.",
    description: "Government family planning and reproductive health services.",
    eligibility: "Eligible couples",
    processingTime: "Same day",
    officialUrl: "https://dgfp.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Visit family planning clinic", description: "Visit family planning clinic", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Consultation", description: "Consultation", actionType: "OTHER" },
      { stepNumber: 3, title: "Receive service", description: "Receive service", actionType: "OTHER" }
    ],
    requirements: [
      { name: "NID", isMandatory: true, sortOrder: 1 },
      { name: "Health card", isMandatory: true, sortOrder: 2 }
    ],
    fees: [
      { name: "Free", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "Directorate General of Family Planning (DGFP)", url: "https://dgfp.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000058",
    categoryId: CATEGORY_IDS["social-welfare"],
    name: "Widow Allowance",
    slug: "widow-allowance",
    shortDescription: "Monthly allowance for widowed women.",
    description: "Monthly allowance for widowed women.",
    eligibility: "Widowed women meeting criteria",
    processingTime: "Program dependent",
    officialUrl: "https://msw.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply via local social", description: "Apply via local social services office", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Approval and disbursement", description: "Approval and disbursement", actionType: "OTHER" }
    ],
    requirements: [
      { name: "NID", isMandatory: true, sortOrder: 1 },
      { name: "Death certificate of husband", isMandatory: true, sortOrder: 2 },
      { name: "Income certificate", isMandatory: true, sortOrder: 3 },
      { name: "Bank details", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Free application", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "Directorate of Social Services", url: "https://msw.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000059",
    categoryId: CATEGORY_IDS["social-welfare"],
    name: "Disability Allowance",
    slug: "disability-allowance",
    shortDescription: "Monthly allowance for persons with disabilities.",
    description: "Monthly allowance for persons with disabilities.",
    eligibility: "Certified persons with disabilities",
    processingTime: "Program dependent",
    officialUrl: "https://msw.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply via social services", description: "Apply via social services office", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Medical verification", description: "Medical verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Approval", description: "Approval", actionType: "OTHER" }
    ],
    requirements: [
      { name: "NID", isMandatory: true, sortOrder: 1 },
      { name: "Disability certificate", isMandatory: true, sortOrder: 2 },
      { name: "Bank details", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Free application", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "Directorate of Social Services", url: "https://msw.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000060",
    categoryId: CATEGORY_IDS["social-welfare"],
    name: "Maternity Allowance",
    slug: "maternity-allowance",
    shortDescription: "Maternity allowance for eligible mothers.",
    description: "Maternity allowance for eligible mothers.",
    eligibility: "Pregnant mothers meeting criteria",
    processingTime: "Program dependent",
    officialUrl: "https://msw.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply via social services", description: "Apply via social services office", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Disbursement", description: "Disbursement", actionType: "OTHER" }
    ],
    requirements: [
      { name: "NID", isMandatory: true, sortOrder: 1 },
      { name: "Pregnancy certificate", isMandatory: true, sortOrder: 2 },
      { name: "Bank details", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Free application", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "Directorate of Social Services", url: "https://msw.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000061",
    categoryId: CATEGORY_IDS["social-welfare"],
    name: "Orphan Allowance",
    slug: "orphan-allowance",
    shortDescription: "Allowance for orphaned children.",
    description: "Allowance for orphaned children.",
    eligibility: "Orphaned children meeting criteria",
    processingTime: "Program dependent",
    officialUrl: "https://msw.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply via social services", description: "Apply via social services office", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Approval", description: "Approval", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Birth certificate", isMandatory: true, sortOrder: 1 },
      { name: "Guardian NID", isMandatory: true, sortOrder: 2 },
      { name: "Bank details", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Free application", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "Directorate of Social Services", url: "https://msw.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000062",
    categoryId: CATEGORY_IDS["police-legal"],
    name: "Police Character Certificate",
    slug: "character-certificate",
    shortDescription: "Obtain police character/verification certificate.",
    description: "Obtain police character/verification certificate.",
    eligibility: "Bangladeshi citizens; Foreigners residing in Bangladesh",
    processingTime: "7–15 days",
    officialUrl: "https://police.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply online/offline", description: "Apply online/offline", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Police verification", description: "Police verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Receive certificate", description: "Receive certificate", actionType: "OTHER" }
    ],
    requirements: [
      { name: "NID/Passport", isMandatory: true, sortOrder: 1 },
      { name: "Photographs", isMandatory: true, sortOrder: 2 },
      { name: "Application form", isMandatory: true, sortOrder: 3 },
      { name: "Address proof", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Fee applies", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Bangladesh Police", url: "https://police.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000063",
    categoryId: CATEGORY_IDS["police-legal"],
    name: "FIR Copy",
    slug: "fir-copy",
    shortDescription: "Obtain a copy of a filed First Information Report (FIR).",
    description: "Obtain a copy of a filed First Information Report (FIR).",
    eligibility: "Complainant or authorized person",
    processingTime: "1–3 days",
    officialUrl: null,
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply at police station", description: "Apply at police station", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Receive FIR copy", description: "Receive FIR copy", actionType: "OTHER" }
    ],
    requirements: [
      { name: "GD/FIR number", isMandatory: true, sortOrder: 1 },
      { name: "NID", isMandatory: true, sortOrder: 2 },
      { name: "Application", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Copy fee applies", amount: null, currency: "BDT" }
    ],
    sources: [

    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000064",
    categoryId: CATEGORY_IDS["police-legal"],
    name: "Victim Support Services",
    slug: "victim-support",
    shortDescription: "Support services for victims of crime.",
    description: "Support services for victims of crime.",
    eligibility: "Victims of crime",
    processingTime: "As per case",
    officialUrl: "https://police.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Contact police station/helpline", description: "Contact police station/helpline", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Case registration", description: "Case registration", actionType: "OTHER" },
      { stepNumber: 3, title: "Support provided", description: "Support provided", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Complaint details", isMandatory: true, sortOrder: 1 },
      { name: "NID", isMandatory: true, sortOrder: 2 }
    ],
    fees: [
      { name: "Free", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "Bangladesh Police", url: "https://police.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000065",
    categoryId: CATEGORY_IDS["police-legal"],
    name: "Legal Aid Services",
    slug: "legal-aid",
    shortDescription: "Free legal aid for eligible citizens.",
    description: "Free legal aid for eligible citizens.",
    eligibility: "Low-income citizens; Women, children, disabled",
    processingTime: "As per case",
    officialUrl: "https://nlaso.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply to legal aid", description: "Apply to legal aid office", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Eligibility verification", description: "Eligibility verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Legal support provided", description: "Legal support provided", actionType: "OTHER" }
    ],
    requirements: [
      { name: "NID", isMandatory: true, sortOrder: 1 },
      { name: "Income certificate", isMandatory: true, sortOrder: 2 },
      { name: "Case details", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Free", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "National Legal Aid Services Organization", url: "https://nlaso.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000066",
    categoryId: CATEGORY_IDS["business"],
    name: "Import/Export License (IRC/ERC)",
    slug: "import-export-license",
    shortDescription: "Obtain Import Registration Certificate (IRC) / Export Registration Certificate (ERC).",
    description: "Obtain Import Registration Certificate (IRC) / Export Registration Certificate (ERC).",
    eligibility: "Registered businesses",
    processingTime: "7–15 days",
    officialUrl: "https://ccie.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply online", description: "Apply online", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Document verification", description: "Document verification", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Receive IRC/ERC", description: "Receive IRC/ERC", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Trade license", isMandatory: true, sortOrder: 1 },
      { name: "TIN", isMandatory: true, sortOrder: 2 },
      { name: "Bank solvency", isMandatory: true, sortOrder: 3 },
      { name: "NID", isMandatory: true, sortOrder: 4 },
      { name: "Photographs", isMandatory: true, sortOrder: 5 }
    ],
    fees: [
      { name: "License fee applies", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Office of the Chief Controller of Imports & Exports (CCI&E)", url: "https://ccie.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000067",
    categoryId: CATEGORY_IDS["business"],
    name: "Factory License",
    slug: "factory-license",
    shortDescription: "Obtain license for factory establishment.",
    description: "Obtain license for factory establishment.",
    eligibility: "Factory owners",
    processingTime: "15–30 days",
    officialUrl: "https://dife.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply to DIFE", description: "Apply to DIFE", actionType: "OTHER" },
      { stepNumber: 2, title: "Inspection", description: "Inspection", actionType: "OTHER" },
      { stepNumber: 3, title: "Receive license", description: "Receive license", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Trade license", isMandatory: true, sortOrder: 1 },
      { name: "Layout plan", isMandatory: true, sortOrder: 2 },
      { name: "NID", isMandatory: true, sortOrder: 3 },
      { name: "Safety documents", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "License fee by capacity", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Department of Inspection for Factories and Establishments (DIFE)", url: "https://dife.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000068",
    categoryId: CATEGORY_IDS["business"],
    name: "Company Name Clearance",
    slug: "name-clearance",
    shortDescription: "Get name clearance for company registration.",
    description: "Get name clearance for company registration.",
    eligibility: "Prospective company founders",
    processingTime: "1–3 days",
    officialUrl: "https://rjsc.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply online on RJSC", description: "Apply online on RJSC portal", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Receive name clearance", description: "Receive name clearance", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Proposed names", isMandatory: true, sortOrder: 1 },
      { name: "NID", isMandatory: true, sortOrder: 2 },
      { name: "Application", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Clearance fee applies", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Registrar of Joint Stock Companies (RJSC)", url: "https://rjsc.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000069",
    categoryId: CATEGORY_IDS["business"],
    name: "Company Annual Return",
    slug: "annual-return",
    shortDescription: "File annual return for registered company.",
    description: "File annual return for registered company.",
    eligibility: "Registered companies",
    processingTime: "Same day",
    officialUrl: "https://rjsc.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Log in to RJSC", description: "Log in to RJSC portal", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Submit annual return", description: "Submit annual return", actionType: "OTHER" },
      { stepNumber: 3, title: "Receive acknowledgement", description: "Receive acknowledgement", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Financial statements", isMandatory: true, sortOrder: 1 },
      { name: "Form", isMandatory: true, sortOrder: 2 },
      { name: "Fees", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Filing fee applies", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Registrar of Joint Stock Companies (RJSC)", url: "https://rjsc.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000070",
    categoryId: CATEGORY_IDS["agriculture"],
    name: "Farmer Card / Registration",
    slug: "farmer-card",
    shortDescription: "Register as a farmer and obtain farmer card.",
    description: "Register as a farmer and obtain farmer card.",
    eligibility: "Farmers with land/lease",
    processingTime: "7–15 days",
    officialUrl: "https://dae.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Visit upazila agriculture office", description: "Visit upazila agriculture office", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Register", description: "Register", actionType: "OTHER" },
      { stepNumber: 3, title: "Receive farmer card", description: "Receive farmer card", actionType: "OTHER" }
    ],
    requirements: [
      { name: "NID", isMandatory: true, sortOrder: 1 },
      { name: "Land documents", isMandatory: true, sortOrder: 2 },
      { name: "Photographs", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Free", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "Department of Agricultural Extension (DAE)", url: "https://dae.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000071",
    categoryId: CATEGORY_IDS["agriculture"],
    name: "Seed Certification",
    slug: "seed-certification",
    shortDescription: "Certification of seeds for quality assurance.",
    description: "Certification of seeds for quality assurance.",
    eligibility: "Seed producers/traders",
    processingTime: "15–30 days",
    officialUrl: "https://moa.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply to seed certification", description: "Apply to seed certification agency", actionType: "OTHER" },
      { stepNumber: 2, title: "Testing", description: "Testing", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Receive certificate", description: "Receive certificate", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Application", isMandatory: true, sortOrder: 1 },
      { name: "Seed samples", isMandatory: true, sortOrder: 2 },
      { name: "License", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "Certification fee applies", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Seed Certification Agency", url: "https://moa.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000072",
    categoryId: CATEGORY_IDS["agriculture"],
    name: "Fisheries License",
    slug: "fisheries-license",
    shortDescription: "Obtain license for fishing/fish farming.",
    description: "Obtain license for fishing/fish farming.",
    eligibility: "Fishermen/fish farmers",
    processingTime: "7–15 days",
    officialUrl: "https://fisheries.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply at fisheries office", description: "Apply at fisheries office", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Receive license", description: "Receive license", actionType: "OTHER" }
    ],
    requirements: [
      { name: "NID", isMandatory: true, sortOrder: 1 },
      { name: "Application", isMandatory: true, sortOrder: 2 },
      { name: "Lease documents", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "License fee applies", amount: null, currency: "BDT" }
    ],
    sources: [
      { title: "Department of Fisheries", url: "https://fisheries.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000073",
    categoryId: CATEGORY_IDS["agriculture"],
    name: "Livestock Vaccination",
    slug: "livestock-vaccination",
    shortDescription: "Government livestock vaccination services.",
    description: "Government livestock vaccination services.",
    eligibility: "Livestock owners",
    processingTime: "Same day",
    officialUrl: "https://dls.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Contact livestock office", description: "Contact livestock office", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Schedule", description: "Schedule", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Receive vaccination", description: "Receive vaccination", actionType: "OTHER" }
    ],
    requirements: [
      { name: "NID", isMandatory: true, sortOrder: 1 },
      { name: "Livestock details", isMandatory: true, sortOrder: 2 }
    ],
    fees: [
      { name: "Free/nominal", amount: 0.00, currency: "BDT" }
    ],
    sources: [
      { title: "Department of Livestock Services (DLS)", url: "https://dls.gov.bd/", sourceType: "OFFICIAL_PORTAL" }
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000074",
    categoryId: CATEGORY_IDS["local-government"],
    name: "Building Permit",
    slug: "building-permit",
    shortDescription: "Obtain building construction permit.",
    description: "Obtain building construction permit.",
    eligibility: "Land/building owner",
    processingTime: "15–30 days",
    officialUrl: null,
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Submit plan to city", description: "Submit plan to city corp/municipality", actionType: "OTHER" },
      { stepNumber: 2, title: "Inspection", description: "Inspection", actionType: "OTHER" },
      { stepNumber: 3, title: "Receive permit", description: "Receive permit", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Land documents", isMandatory: true, sortOrder: 1 },
      { name: "Building plan", isMandatory: true, sortOrder: 2 },
      { name: "NID", isMandatory: true, sortOrder: 3 },
      { name: "Tax clearance", isMandatory: true, sortOrder: 4 }
    ],
    fees: [
      { name: "Permit fee by area", amount: null, currency: "BDT" }
    ],
    sources: [

    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000075",
    categoryId: CATEGORY_IDS["local-government"],
    name: "Municipal Trade License",
    slug: "municipal-trade-license",
    shortDescription: "Obtain trade license from municipality.",
    description: "Obtain trade license from municipality.",
    eligibility: "Business owners in municipal area",
    processingTime: "3–7 days",
    officialUrl: null,
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply at municipality", description: "Apply at municipality", actionType: "OTHER" },
      { stepNumber: 2, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Receive license", description: "Receive license", actionType: "OTHER" }
    ],
    requirements: [
      { name: "NID", isMandatory: true, sortOrder: 1 },
      { name: "Rent agreement", isMandatory: true, sortOrder: 2 },
      { name: "Photographs", isMandatory: true, sortOrder: 3 }
    ],
    fees: [
      { name: "License fee applies", amount: null, currency: "BDT" }
    ],
    sources: [

    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000076",
    categoryId: CATEGORY_IDS["local-government"],
    name: "Waste Management Service",
    slug: "waste-management",
    shortDescription: "Register for municipal waste collection service.",
    description: "Register for municipal waste collection service.",
    eligibility: "Residents of city corporation area",
    processingTime: "3–7 days",
    officialUrl: null,
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply at zonal office", description: "Apply at zonal office", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Registration", description: "Registration", actionType: "OTHER" },
      { stepNumber: 3, title: "Service activation", description: "Service activation", actionType: "OTHER" }
    ],
    requirements: [
      { name: "Holding number", isMandatory: true, sortOrder: 1 },
      { name: "NID", isMandatory: true, sortOrder: 2 }
    ],
    fees: [
      { name: "Monthly fee", amount: null, currency: "BDT" }
    ],
    sources: [

    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000077",
    categoryId: CATEGORY_IDS["local-government"],
    name: "Union Parishad Certificate",
    slug: "union-parishad-certificate",
    shortDescription: "Obtain various certificates from Union Parishad.",
    description: "Obtain various certificates from Union Parishad.",
    eligibility: "Residents of union area",
    processingTime: "1–3 days",
    officialUrl: null,
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply at Union Parishad", description: "Apply at Union Parishad", actionType: "OTHER" },
      { stepNumber: 2, title: "Verification", description: "Verification", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Receive certificate", description: "Receive certificate", actionType: "OTHER" }
    ],
    requirements: [
      { name: "NID", isMandatory: true, sortOrder: 1 },
      { name: "Address proof", isMandatory: true, sortOrder: 2 }
    ],
    fees: [
      { name: "Nominal fee", amount: null, currency: "BDT" }
    ],
    sources: [

    ],
  },
];

const upsertCategory = async ({
  id,
  name,
  slug,
  description,
  icon,
}: {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string | null;
}): Promise<string> => {
  await pool.query(
    `INSERT INTO category (id, name, slug, description, icon, "isDeleted", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     ON CONFLICT (slug) DO UPDATE
     SET name = EXCLUDED.name,
         description = EXCLUDED.description,
         icon = EXCLUDED.icon,
         "updatedAt" = CURRENT_TIMESTAMP`,
    [id, name, slug, description, icon || null],
  );
  const existing = await pool.query(
    `SELECT id FROM category WHERE slug = $1 LIMIT 1`,
    [slug],
  );
  return existing.rows[0].id;
};

const upsertService = async (
  svc: ServiceInput,
  categoryId: string,
): Promise<void> => {
  // Upsert service record
  await pool.query(
    `INSERT INTO services (
       id, "categoryId", name, slug, "shortDescription", description,
       eligibility, "processingTime", "officialUrl", "verificationStatus",
       "lastVerifiedAt", "isPublished", "isDeleted", "createdAt", "updatedAt"
     )
     VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8, $9, 'VERIFIED',
       CURRENT_TIMESTAMP, $10, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
     )
     ON CONFLICT (slug) DO UPDATE
     SET "categoryId" = EXCLUDED."categoryId",
         name = EXCLUDED.name,
         "shortDescription" = EXCLUDED."shortDescription",
         description = EXCLUDED.description,
         eligibility = EXCLUDED.eligibility,
         "processingTime" = EXCLUDED."processingTime",
         "officialUrl" = EXCLUDED."officialUrl",
         "isPublished" = EXCLUDED."isPublished",
         "updatedAt" = CURRENT_TIMESTAMP`,
    [
      svc.id,
      categoryId,
      svc.name,
      svc.slug,
      svc.shortDescription,
      svc.description,
      svc.eligibility || null,
      svc.processingTime || null,
      svc.officialUrl || null,
      svc.isPublished !== undefined ? svc.isPublished : true,
    ],
  );

  const existing = await pool.query(
    `SELECT id FROM services WHERE slug = $1 LIMIT 1`,
    [svc.slug],
  );
  const serviceId = existing.rows[0].id;

  // Upsert serviceStep
  if (svc.steps && svc.steps.length > 0) {
    for (const step of svc.steps) {
      await pool.query(
        `INSERT INTO serviceStep (
           "serviceId", "stepNumber", title, description, "actionType",
           "officialUrl", "isDeleted", "createdAt", "updatedAt"
         )
         VALUES ($1, $2, $3, $4, $5, NULL, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         ON CONFLICT ("serviceId", "stepNumber") DO UPDATE
         SET title = EXCLUDED.title,
             description = EXCLUDED.description,
             "actionType" = EXCLUDED."actionType",
             "updatedAt" = CURRENT_TIMESTAMP`,
        [
          serviceId,
          step.stepNumber,
          step.title,
          step.description,
          step.actionType,
        ],
      );
    }
  }

  // Upsert serviceRequirement
  if (svc.requirements && svc.requirements.length > 0) {
    for (const req of svc.requirements) {
      await pool.query(
        `INSERT INTO serviceRequirement (
           "serviceId", name, description, "isMandatory", "conditionDescription", "sortOrder"
         )
         VALUES ($1, $2, $3, $4, NULL, $5)
         ON CONFLICT ("serviceId", "sortOrder") DO UPDATE
         SET name = EXCLUDED.name,
             "isMandatory" = EXCLUDED."isMandatory"`,
        [
          serviceId,
          req.name,
          req.description || null,
          req.isMandatory,
          req.sortOrder,
        ],
      );
    }
  }

  // Upsert serviceFee
  if (svc.fees && svc.fees.length > 0) {
    // Clean old seed fees for this service and re-insert
    await pool.query(`DELETE FROM serviceFee WHERE "serviceId" = $1`, [serviceId]);
    for (const fee of svc.fees) {
      await pool.query(
        `INSERT INTO serviceFee (
           "serviceId", name, amount, currency, description, "isDeleted", "createdAt", "updatedAt"
         )
         VALUES ($1, $2, $3, $4, $5, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
          serviceId,
          fee.name,
          fee.amount,
          fee.currency,
          fee.description || null,
        ],
      );
    }
  }

  // Upsert serviceSource
  if (svc.sources && svc.sources.length > 0) {
    await pool.query(`DELETE FROM serviceSource WHERE "serviceId" = $1`, [serviceId]);
    for (const source of svc.sources) {
      await pool.query(
        `INSERT INTO serviceSource (
           "serviceId", title, url, "sourceType", "lastCheckedAt", "isDeleted", "createdAt", "updatedAt"
         )
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
          serviceId,
          source.title,
          source.url,
          source.sourceType,
        ],
      );
    }
  }
};

export const seedServices = async () => {
  const categories = [
    { id: CATEGORY_IDS["identity-documents"], name: "Identity & Documents", slug: "identity-documents", description: "NID, birth & death registration, citizenship documents.", icon: "IdCard" },
    { id: CATEGORY_IDS["passport-immigration"], name: "Passport & Immigration", slug: "passport-immigration", description: "e-Passport, visa services and immigration guidance.", icon: "Plane" },
    { id: CATEGORY_IDS.transport, name: "Transport", slug: "transport", description: "Driving license, vehicle registration and BRTA services.", icon: "Car" },
    { id: CATEGORY_IDS["tax-finance"], name: "Tax & Finance", slug: "tax-finance", description: "e-TIN, income tax, VAT and tax return filing.", icon: "Receipt" },
    { id: CATEGORY_IDS["land-property"], name: "Land & Property", slug: "land-property", description: "Khatian, mutation, land tax and land records.", icon: "LandPlot" },
    { id: CATEGORY_IDS.education, name: "Education", slug: "education", description: "Certificates, results, scholarships and board services.", icon: "GraduationCap" },
    { id: CATEGORY_IDS.health, name: "Health", slug: "health", description: "Government hospitals, health programs and certificates.", icon: "HeartPulse" },
    { id: CATEGORY_IDS["social-welfare"], name: "Social Welfare", slug: "social-welfare", description: "Allowances, benefits and disability services.", icon: "HeartHandshake" },
    { id: CATEGORY_IDS["police-legal"], name: "Police & Legal", slug: "police-legal", description: "GD, police clearance, court services and legal aid.", icon: "ShieldCheck" },
    { id: CATEGORY_IDS.business, name: "Business", slug: "business", description: "Trade license, company registration and business permits.", icon: "Briefcase" },
    { id: CATEGORY_IDS.agriculture, name: "Agriculture", slug: "agriculture", description: "Farmer services, subsidies, fisheries and livestock.", icon: "Sprout" },
    { id: CATEGORY_IDS["local-government"], name: "Local Government", slug: "local-government", description: "City Corporation, Municipality and Union Parishad services.", icon: "Landmark" },
  ];

  const realCategoryIds: Record<string, string> = {};
  for (const cat of categories) {
    realCategoryIds[cat.id] = await upsertCategory(cat);
  }

  for (const svc of SERVICES) {
    const categoryId = realCategoryIds[svc.categoryId] ?? svc.categoryId;
    await upsertService(svc, categoryId);
  }

  console.log(
    `[seed] Services catalogue seeded: ${categories.length} categories, ${SERVICES.length} services with requirements, steps, fees & sources.`,
  );
};


const isDirectRun =
  process.argv[1]?.includes("services.seed") ||
  (typeof require !== "undefined" && require.main === module);

if (isDirectRun) {
  seedServices()
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("Services seeding failed:", err);
      await pool.end();
      process.exit(1);
    });
}
