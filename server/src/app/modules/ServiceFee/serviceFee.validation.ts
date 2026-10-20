import { z } from "zod";

const createServiceFeeSchema = z.object({
  body: z.object({
    serviceId: z.string({
      required_error: "Service ID is required!",
    }),
    name: z.string({
      required_error: "Fee name is required!",
    }),
    amount: z.string().optional(),
    currency: z.string().optional(),
    description: z.string().optional(),
    effectiveFrom: z.string().optional(),
    effectiveUntil: z.string().optional(),
  }),
});

const updateServiceFeeSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    amount: z.string().optional(),
    currency: z.string().optional(),
    description: z.string().optional(),
    effectiveFrom: z.string().optional(),
    effectiveUntil: z.string().optional(),
  }),
});

export const ServiceFeeValidation = {
  createServiceFeeSchema,
  updateServiceFeeSchema,
};
