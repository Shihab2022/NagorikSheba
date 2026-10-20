import { z } from "zod";

const createServiceSourceSchema = z.object({
  body: z.object({
    serviceId: z.string({
      required_error: "Service ID is required!",
    }),
    title: z.string({
      required_error: "Title is required!",
    }),
    url: z.string({
      required_error: "URL is required!",
    }),
    sourceType: z.enum(["OFFICIAL_PORTAL", "OFFICIAL_NOTICE", "OFFICIAL_DOCUMENT", "OTHER"]),
  }),
});

const updateServiceSourceSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    url: z.string().optional(),
    sourceType: z.enum(["OFFICIAL_PORTAL", "OFFICIAL_NOTICE", "OFFICIAL_DOCUMENT", "OTHER"]).optional(),
  }),
});

export const ServiceSourceValidation = {
  createServiceSourceSchema,
  updateServiceSourceSchema,
};
