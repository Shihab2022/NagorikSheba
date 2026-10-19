import { z } from "zod";

const trackedServiceStatusEnum = z.enum([
  "PREPARING",
  "READY_TO_APPLY",
  "SUBMITTED_BY_USER",
  "FOLLOW_UP_REQUIRED",
  "COMPLETED_BY_USER",
  "CANCELLED",
]);

export const createTrackedServiceSchema = z.object({
  body: z.object({
    serviceId: z.string({
      required_error: "Service ID is required!",
    }),
    title: z.string().optional(),
    referenceNumber: z.string().optional().nullable(),
    status: trackedServiceStatusEnum.optional(),
  }),
});

export const updateTrackedServiceSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    status: trackedServiceStatusEnum.optional(),
    referenceNumber: z.string().optional().nullable(),
    completedAt: z.string().optional().nullable(),
  }),
});

export const trackedServiceIdSchema = z.object({
  params: z.object({
    tracked_service_id: z.string({
      required_error: "Tracked service ID is required!",
    }),
  }),
});

export const TrackedServiceValidation = {
  createTrackedServiceSchema,
  updateTrackedServiceSchema,
  trackedServiceIdSchema,
};
