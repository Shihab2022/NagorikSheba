import express from "express";
import { TrackedStepControllers } from "./trackedStep.controllers";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { TrackedStepValidation } from "./trackedStep.validation";

const router = express.Router();

router.get(
  "/:tracked_service_id/steps",
  auth("USER", "ADMIN"),
  validateRequest(TrackedStepValidation.trackedServiceIdParamSchema),
  TrackedStepControllers.getTrackedSteps,
);
router.patch(
  "/:tracked_service_id/steps/:service_step_id",
  auth("USER", "ADMIN"),
  validateRequest(TrackedStepValidation.updateTrackedStepSchema),
  TrackedStepControllers.updateTrackedStep,
);

export const TrackedStepRoutes = router;
