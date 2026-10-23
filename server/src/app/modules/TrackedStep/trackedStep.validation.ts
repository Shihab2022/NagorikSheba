import { z } from "zod";

const trackedStepStatusEnum = z.enum([
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
  "NOT_APPLICABLE",
]);

const trackedServiceIdParams = z.object({
  tracked_service_id: z.string({
    required_error: "Tracked service ID is required!",
  }),
});

export const trackedServiceIdParamSchema = z.object({
  params: trackedServiceIdParams,
});

export const updateTrackedStepSchema = z.object({
  params: trackedServiceIdParams.extend({
    service_step_id: z.string({
      required_error: "Service step ID is required!",
    }),
  }),
  body: z.object({
    status: trackedStepStatusEnum,
    note: z.string().optional().nullable(),
  }),
});

export const TrackedStepValidation = {
  trackedServiceIdParamSchema,
  updateTrackedStepSchema,
};
