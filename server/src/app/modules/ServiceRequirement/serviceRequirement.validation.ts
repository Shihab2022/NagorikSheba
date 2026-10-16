import { z } from "zod";

const createServiceRequirementSchema = z.object({
  body: z.object({
    serviceId: z.string({
      required_error: "Service ID is required!",
    }),
    name: z.string({
      required_error: "Name is required!",
    }),
    description: z.string().optional(),
    isMandatory: z.boolean().optional(),
    conditionDescription: z.string().optional(),
    sortOrder: z.number({
      required_error: "Sort order is required!",
    }),
  }),
});

const updateServiceRequirementSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    isMandatory: z.boolean().optional(),
    conditionDescription: z.string().optional(),
    sortOrder: z.number().optional(),
  }),
});

export const ServiceRequirementValidation = {
  createServiceRequirementSchema,
  updateServiceRequirementSchema,
};
