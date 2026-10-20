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
    description: "Correct NID information via the Election Commission NID portal.",
    eligibility: "Citizen with existing NID record supported by a valid document.",
    processingTime: "7–15 days",
    officialUrl: "https://services.nidw.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Log in to NID portal", description: "Create or log in to your account on the NID service portal.", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Select correction type", description: "Select the correction type and fill in correct information.", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Upload documents", description: "Upload scanned copies of supporting documents.", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 4, title: "Submit and print", description: "Submit and print the acknowledgement copy.", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 5, title: "Track delivery", description: "Track until the updated card is delivered.", actionType: "READ_GUIDE" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    categoryId: CATEGORY_IDS["identity-documents"],
    name: "Birth Registration",
    slug: "birth-registration",
    shortDescription: "Register a newborn and obtain the Birth Registration Certificate.",
    description: "Birth registration within 60 days of birth for a standard certificate.",
    eligibility: "Every birth occurring in Bangladesh must be registered.",
    processingTime: "Same day to 7 days",
    officialUrl: "https://www.bdris.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Collect the form", description: "Collect the form from the local Union Parishad, Ward Office or hospital.", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Fill and attach documents", description: "Fill birth details and attach supporting documents.", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 3, title: "Submit to registrar", description: "Submit to the registrar (Union Parishad / City Corporation).", actionType: "VISIT_OFFICE" },
      { stepNumber: 4, title: "Collect certificate", description: "Verify details and collect the printed certificate.", actionType: "VISIT_OFFICE" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000003",
    categoryId: CATEGORY_IDS["identity-documents"],
    name: "Death Registration",
    slug: "death-registration",
    shortDescription: "Register a death and obtain the Death Registration Certificate.",
    description: "Register a death within 1 year and obtain the Death Registration Certificate.",
    eligibility: "Family members or legal heirs of the deceased can apply.",
    processingTime: "Same day to 7 days",
    officialUrl: "https://www.bdris.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Obtain death report", description: "Obtain the death report from the hospital or burial ground.", actionType: "PREPARE_DOCUMENTS" },
      { stepNumber: 2, title: "Complete form at registrar", description: "Complete the form at the local registrar office.", actionType: "VISIT_OFFICE" },
      { stepNumber: 3, title: "Submit documents", description: "Submit supporting documents and the applicant's NID.", actionType: "VISIT_OFFICE" },
      { stepNumber: 4, title: "Collect certificate", description: "Collect the Death Registration Certificate.", actionType: "VISIT_OFFICE" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000004",
    categoryId: CATEGORY_IDS["identity-documents"],
    name: "Birth Certificate Copy (Online)",
    slug: "birth-certificate-copy",
    shortDescription: "Download a certified copy of an existing birth certificate.",
    description: "Download a certified copy of an existing birth certificate online.",
    eligibility: "The birth must already be registered with BDRIS.",
    processingTime: "Instant download",
    officialUrl: "https://www.bdris.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Open BDRIS portal", description: "Open the BDRIS verification portal.", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Enter registration details", description: "Enter registration number and birth date.", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Download verified copy", description: "Download the verified copy.", actionType: "VISIT_OFFICIAL_PORTAL" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000005",
    categoryId: CATEGORY_IDS["social-welfare"],
    name: "Old Age Allowance (ভরণপোষণ ভাতা)",
    slug: "old-age-allowance",
    shortDescription: "Monthly allowance for elderly citizens.",
    description: "Monthly allowance for citizens aged 65+ with family income below threshold.",
    eligibility: "Citizen aged 65 or above, family income below threshold.",
    processingTime: "1–3 months",
    officialUrl: "https://msw.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Submit application", description: "Submit at the Union Parishad / Ward office.", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Officer verification", description: "Verification by the social services officer.", actionType: "VISIT_OFFICE" },
      { stepNumber: 3, title: "Selection list", description: "Selection in the upazila-approved list.", actionType: "READ_GUIDE" },
      { stepNumber: 4, title: "Receive allowance", description: "Receive via designated bank/mobile channel.", actionType: "VISIT_OFFICE" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000006",
    categoryId: CATEGORY_IDS["health"],
    name: "Government Hospital Services",
    slug: "government-hospital-services",
    shortDescription: "Outpatient services at government hospitals.",
    description: "Outpatient (OPD) services at government hospitals — free or nominal fee.",
    eligibility: "Open to all citizens; some specialized services require referral.",
    processingTime: "Same day (OPD)",
    officialUrl: "https://dghs.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Find nearest hospital", description: "Find the nearest government hospital.", actionType: "READ_GUIDE" },
      { stepNumber: 2, title: "OPD counter", description: "Visit the OPD counter with your NID.", actionType: "VISIT_OFFICE" },
      { stepNumber: 3, title: "Collect token", description: "Collect a token and consult the duty doctor.", actionType: "VISIT_OFFICE" },
      { stepNumber: 4, title: "Collect medicine", description: "Collect medicine from the hospital pharmacy.", actionType: "VISIT_OFFICE" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000007",
    categoryId: CATEGORY_IDS["passport-immigration"],
    name: "e-Passport (New Application)",
    slug: "epassport-new",
    shortDescription: "Apply for a new e-Passport.",
    description: "Apply for a new Bangladeshi e-Passport online.",
    eligibility: "Citizen with NID.",
    processingTime: "7–15 working days",
    officialUrl: "https://www.epassport.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Fill online application", description: "Fill the e-Passport application form online.", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Submit documents", description: "Submit documents and biometrics at the passport office.", actionType: "VISIT_OFFICE" },
      { stepNumber: 3, title: "Police verification", description: "Wait for police verification.", actionType: "READ_GUIDE" },
      { stepNumber: 4, title: "Collect passport", description: "Collect the e-Passport.", actionType: "VISIT_OFFICE" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000008",
    categoryId: CATEGORY_IDS["passport-immigration"],
    name: "Passport Renewal (Re-issue)",
    slug: "passport-renewal",
    shortDescription: "Renew or re-issue an e-Passport.",
    description: "Renew or re-issue an existing Bangladeshi e-Passport.",
    eligibility: "Holder of a Bangladeshi passport.",
    processingTime: "7–15 working days",
    officialUrl: "https://www.epassport.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Fill renewal application", description: "Fill the e-Passport renewal application online.", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Submit old passport", description: "Submit the old passport and documents at the office.", actionType: "VISIT_OFFICE" },
      { stepNumber: 3, title: "Collect renewed passport", description: "Collect the renewed e-Passport.", actionType: "VISIT_OFFICE" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000009",
    categoryId: CATEGORY_IDS["transport"],
    name: "Driving License",
    slug: "driving-license",
    shortDescription: "Apply for a driving license.",
    description: "Apply for a driving license through BRTA.",
    eligibility: "Citizen meeting age and medical requirements.",
    processingTime: "Varies",
    officialUrl: "https://bsp.brta.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply online", description: "Apply for a driving license on the BRTA portal.", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Written test", description: "Appear for the written test.", actionType: "VISIT_OFFICE" },
      { stepNumber: 3, title: "Practical test", description: "Appear for the practical driving test.", actionType: "VISIT_OFFICE" },
      { stepNumber: 4, title: "Collect license", description: "Collect the driving license.", actionType: "VISIT_OFFICE" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000010",
    categoryId: CATEGORY_IDS["transport"],
    name: "Vehicle Registration",
    slug: "vehicle-registration",
    shortDescription: "Register a vehicle with BRTA.",
    description: "Register a new or transferred vehicle with BRTA.",
    eligibility: "Vehicle owner with valid documents.",
    processingTime: "Varies",
    officialUrl: "https://bsp.brta.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Submit application", description: "Submit the vehicle registration application.", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Vehicle inspection", description: "Vehicle inspection at BRTA.", actionType: "VISIT_OFFICE" },
      { stepNumber: 3, title: "Pay fees", description: "Pay the registration fees.", actionType: "VISIT_OFFICE" },
      { stepNumber: 4, title: "Collect registration", description: "Collect the vehicle registration certificate.", actionType: "VISIT_OFFICE" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000011",
    categoryId: CATEGORY_IDS["education"],
    name: "Education Board Results",
    slug: "education-board-results",
    shortDescription: "Check public examination results.",
    description: "Check SSC, HSC and equivalent examination results online.",
    eligibility: "Candidate with roll and registration number.",
    processingTime: "Instant",
    officialUrl: "https://www.educationboardresults.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Open results portal", description: "Open the Education Board Results portal.", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Enter roll details", description: "Enter roll, registration and board details.", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "View result", description: "View and download the result.", actionType: "VISIT_OFFICIAL_PORTAL" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000012",
    categoryId: CATEGORY_IDS["tax-finance"],
    name: "e-TIN Registration",
    slug: "e-tin",
    shortDescription: "Register for an e-TIN certificate.",
    description: "Register for an e-TIN (Taxpayer Identification Number).",
    eligibility: "Citizen or entity liable to tax.",
    processingTime: "Same day to 3 days",
    officialUrl: "https://etax.nbr.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Register on e-Tax portal", description: "Register on the NBR e-Tax portal.", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Fill TIN form", description: "Fill the e-TIN application form.", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Submit and collect", description: "Submit and collect the e-TIN certificate.", actionType: "VISIT_OFFICIAL_PORTAL" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000013",
    categoryId: CATEGORY_IDS["tax-finance"],
    name: "Income Tax Return",
    slug: "income-tax-return",
    shortDescription: "File an income tax return.",
    description: "File an annual income tax return through the NBR e-Tax portal.",
    eligibility: "e-TIN holder liable to file return.",
    processingTime: "Varies",
    officialUrl: "https://etax.nbr.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Log in to e-Tax", description: "Log in to the NBR e-Tax portal.", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Fill return form", description: "Fill the income tax return form.", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Submit return", description: "Submit the return and pay any due tax.", actionType: "VISIT_OFFICIAL_PORTAL" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000014",
    categoryId: CATEGORY_IDS["land-property"],
    name: "Land Mutation (নামজারি)",
    slug: "land-mutation",
    shortDescription: "Apply for land mutation.",
    description: "Apply for land mutation (নামজারি) to transfer land ownership.",
    eligibility: "Land owner or legal heir with deed documents.",
    processingTime: "Varies",
    officialUrl: "https://land.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Submit application", description: "Submit the mutation application at the land office.", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Document verification", description: "Document verification by the land officer.", actionType: "VISIT_OFFICE" },
      { stepNumber: 3, title: "Notice and hearing", description: "Public notice and hearing if any objection.", actionType: "READ_GUIDE" },
      { stepNumber: 4, title: "Mutation order", description: "Mutation order and updated record.", actionType: "VISIT_OFFICE" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000015",
    categoryId: CATEGORY_IDS["land-property"],
    name: "Land Development Tax (খাজনা)",
    slug: "land-development-tax",
    shortDescription: "Pay annual land development tax.",
    description: "Pay annual land development tax (খাজনা).",
    eligibility: "Land owner with a khatian.",
    processingTime: "Same day",
    officialUrl: "https://land.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Find khatian", description: "Find your khatian/record at the land office.", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Calculate dues", description: "Calculate dues for the fiscal year.", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Pay tax", description: "Pay the tax at the designated bank or online.", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 4, title: "Collect receipt", description: "Collect the payment receipt.", actionType: "VISIT_OFFICE" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000016",
    categoryId: CATEGORY_IDS["local-government"],
    name: "Holding Tax (উন্নয়ন কর)",
    slug: "holding-tax",
    shortDescription: "Pay annual holding/property development tax.",
    description: "Pay annual holding/property development tax to the City Corporation.",
    eligibility: "Owner of a recorded holding within the city/municipal area.",
    processingTime: "Same day",
    officialUrl: null,
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Find holding number", description: "Find your holding number at the zonal office.", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Calculate dues", description: "Calculate dues for the fiscal year.", actionType: "READ_GUIDE" },
      { stepNumber: 3, title: "Pay tax", description: "Pay at the designated bank or online channel.", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 4, title: "Collect receipt", description: "Collect the receipt.", actionType: "VISIT_OFFICE" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000017",
    categoryId: CATEGORY_IDS["local-government"],
    name: "Union Parishad Certificates",
    slug: "union-parishad-certificates",
    shortDescription: "Certificates from Union Parishad.",
    description: "Character, income, residence and other certificates from Union Parishad.",
    eligibility: "Local resident with NID.",
    processingTime: "Same day to 3 days",
    officialUrl: null,
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply at Union Parishad", description: "Apply at the Union Parishad office.", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Verification", description: "Verification by the local representative.", actionType: "VISIT_OFFICE" },
      { stepNumber: 3, title: "Collect certificate", description: "Collect the certificate.", actionType: "VISIT_OFFICE" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000018",
    categoryId: CATEGORY_IDS["police-legal"],
    name: "Police Clearance Certificate (PCC)",
    slug: "police-clearance",
    shortDescription: "Obtain a Police Clearance Certificate.",
    description: "Obtain a Police Clearance Certificate for foreign travel/visa.",
    eligibility: "Citizen with NID.",
    processingTime: "Varies",
    officialUrl: "https://pcc.police.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Apply online", description: "Apply on the PCC portal.", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "Submit documents", description: "Submit documents and fingerprints.", actionType: "VISIT_OFFICE" },
      { stepNumber: 3, title: "Collect PCC", description: "Collect the Police Clearance Certificate.", actionType: "VISIT_OFFICE" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000019",
    categoryId: CATEGORY_IDS["police-legal"],
    name: "General Diary (GD)",
    slug: "general-diary",
    shortDescription: "File a General Diary with police.",
    description: "File a General Diary (GD) at the local police station.",
    eligibility: "Any citizen reporting an incident.",
    processingTime: "Same day",
    officialUrl: "https://www.police.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Visit police station", description: "Visit the local police station.", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "File GD", description: "File the General Diary with duty officer.", actionType: "VISIT_OFFICE" },
      { stepNumber: 3, title: "Collect GD copy", description: "Collect the GD copy.", actionType: "VISIT_OFFICE" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000020",
    categoryId: CATEGORY_IDS["business"],
    name: "Trade License (New)",
    slug: "trade-license",
    shortDescription: "Apply for a new trade license.",
    description: "Apply for a new trade license from the City Corporation.",
    eligibility: "Business owner operating in the city area.",
    processingTime: "Varies",
    officialUrl: "https://www.businessone-stop.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Submit application", description: "Submit the trade license application.", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Verification", description: "Verification by the licensing officer.", actionType: "VISIT_OFFICE" },
      { stepNumber: 3, title: "Pay fee", description: "Pay the trade license fee.", actionType: "VISIT_OFFICE" },
      { stepNumber: 4, title: "Collect license", description: "Collect the trade license.", actionType: "VISIT_OFFICE" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000021",
    categoryId: CATEGORY_IDS["business"],
    name: "Company Registration (RJSC)",
    slug: "company-registration",
    shortDescription: "Register a company with RJSC.",
    description: "Register a company with the Registrar of Joint Stock Companies.",
    eligibility: "Promoters with valid documents.",
    processingTime: "Varies",
    officialUrl: "https://roc.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Name clearance", description: "Obtain name clearance from RJSC.", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 2, title: "File incorporation", description: "File incorporation documents.", actionType: "VISIT_OFFICIAL_PORTAL" },
      { stepNumber: 3, title: "Certificate of incorporation", description: "Collect the certificate of incorporation.", actionType: "VISIT_OFFICE" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000022",
    categoryId: CATEGORY_IDS["agriculture"],
    name: "Farmer Subsidy Services",
    slug: "farmer-subsidy",
    shortDescription: "Farmer registration and subsidy programs.",
    description: "Information on input subsidies, seeds and farmer registration.",
    eligibility: "Registered farmers with verifiable land/lease information.",
    processingTime: "Program dependent",
    officialUrl: "https://dae.gov.bd/",
    isPublished: true,
    steps: [
      { stepNumber: 1, title: "Register as farmer", description: "Visit the upazila Agriculture Office and register as a farmer.", actionType: "VISIT_OFFICE" },
      { stepNumber: 2, title: "Apply for subsidy", description: "Apply for the relevant subsidy program.", actionType: "VISIT_OFFICE" },
      { stepNumber: 3, title: "Track approval", description: "Track approval through the office.", actionType: "READ_GUIDE" },
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
  // Insert only when the slug is new — existing admin-created categories keep
  // their content and their id. Either way, return the id that owns the slug.
  await pool.query(
    `INSERT INTO category (id, name, slug, description, icon, "isDeleted", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     ON CONFLICT (slug) DO NOTHING`,
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
  // Create the service only if its slug is not present yet (never overwriting
  // an admin-created row), then read back whatever id actually owns the slug so
  // the steps below attach to the real row.
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
     ON CONFLICT (slug) DO NOTHING`,
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

  // Resolve each deterministic category id to the id that actually owns that
  // slug — admin-created categories keep their own ids, and services must
  // reference whichever id is real to satisfy the foreign key.
  const realCategoryIds: Record<string, string> = {};
  for (const cat of categories) {
    realCategoryIds[cat.id] = await upsertCategory(cat);
  }

  for (const svc of SERVICES) {
    const categoryId = realCategoryIds[svc.categoryId] ?? svc.categoryId;
    await upsertService(svc, categoryId);
  }

  console.log(
    `[seed] Services catalogue seeded: ${categories.length} categories, ${SERVICES.length} services`,
  );
};







