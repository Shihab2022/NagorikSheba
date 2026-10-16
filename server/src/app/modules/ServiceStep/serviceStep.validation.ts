import { z } from "zod";

const createServiceStepSchema = z.object({
  body: z.object({
    serviceId: z.string({
      required_error: "Service ID is required!",
    }),
    stepNumber: z.number({
      required_error: "Step number is required!",
    }),
    title: z.string({
      required_error: "Title is required!",
    }),
    description: z.string({
      required_error: "Description is required!",
    }),
    actionType: z.enum(["READ_GUIDE", "VISIT_OFFICIAL_PORTAL", "VISIT_OFFICE", "PREPARE_DOCUMENTS", "OTHER"]).optional(),
    officialUrl: z.string().optional(),
  }),
});

const updateServiceStepSchema = z.object({
  body: z.object({
    stepNumber: z.number().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    actionType: z.enum(["READ_GUIDE", "VISIT_OFFICIAL_PORTAL", "VISIT_OFFICE", "PREPARE_DOCUMENTS", "OTHER"]).optional(),
    officialUrl: z.string().optional(),
  }),
});

export const ServiceStepValidation = {
  createServiceStepSchema,
  updateServiceStepSchema,
};
