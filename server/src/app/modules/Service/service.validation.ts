import { z } from "zod";

const requirementItemSchema = z.object({
  id: z.string().optional(),
  name: z.string({ required_error: "Requirement name is required!" }),
  description: z.string().optional().nullable(),
  isMandatory: z.boolean().optional().default(true),
  conditionDescription: z.string().optional().nullable(),
  sortOrder: z.number().optional().default(1),
});

const stepItemSchema = z.object({
  id: z.string().optional(),
  stepNumber: z.number({ required_error: "Step number is required!" }),
  title: z.string({ required_error: "Step title is required!" }),
  description: z.string({ required_error: "Step description is required!" }),
  actionType: z
    .enum(["READ_GUIDE", "VISIT_OFFICIAL_PORTAL", "VISIT_OFFICE", "PREPARE_DOCUMENTS", "OTHER"])
    .optional()
    .default("READ_GUIDE"),
  officialUrl: z.string().optional().nullable(),
});

const feeItemSchema = z.object({
  id: z.string().optional(),
  name: z.string({ required_error: "Fee name is required!" }),
  amount: z.union([z.string(), z.number()]).optional().nullable(),
  currency: z.string().optional().default("BDT"),
  description: z.string().optional().nullable(),
  effectiveFrom: z.string().optional().nullable(),
  effectiveUntil: z.string().optional().nullable(),
});

const sourceItemSchema = z.object({
  id: z.string().optional(),
  title: z.string({ required_error: "Source title is required!" }),
  url: z.string({ required_error: "Source URL is required!" }),
  sourceType: z
    .enum(["OFFICIAL_PORTAL", "OFFICIAL_NOTICE", "OFFICIAL_DOCUMENT", "OTHER"])
    .optional()
    .default("OFFICIAL_PORTAL"),
});

const createServiceSchema = z.object({
  body: z.object({
    categoryId: z.string({
      required_error: "Category ID is required!",
    }),
    name: z.string({
      required_error: "Name is required!",
    }),
    slug: z.string({
      required_error: "Slug is required!",
    }),
    shortDescription: z.string({
      required_error: "Short description is required!",
    }),
    description: z.string({
      required_error: "Description is required!",
    }),
    eligibility: z.string().optional().nullable(),
    processingTime: z.string().optional().nullable(),
    officialUrl: z.string().optional().nullable(),
    isPublished: z.boolean().optional(),
    requirements: z.array(requirementItemSchema).optional(),
    steps: z.array(stepItemSchema).optional(),
    fees: z.array(feeItemSchema).optional(),
    sources: z.array(sourceItemSchema).optional(),
  }),
});

const updateServiceSchema = z.object({
  body: z.object({
    categoryId: z.string().optional(),
    name: z.string().optional(),
    slug: z.string().optional(),
    shortDescription: z.string().optional(),
    description: z.string().optional(),
    eligibility: z.string().optional().nullable(),
    processingTime: z.string().optional().nullable(),
    officialUrl: z.string().optional().nullable(),
    verificationStatus: z.enum(["UNVERIFIED", "VERIFIED", "NEEDS_REVIEW"]).optional(),
    isPublished: z.boolean().optional(),
    requirements: z.array(requirementItemSchema).optional(),
    steps: z.array(stepItemSchema).optional(),
    fees: z.array(feeItemSchema).optional(),
    sources: z.array(sourceItemSchema).optional(),
  }),
});

export const ServiceValidation = {
  createServiceSchema,
  updateServiceSchema,
};
