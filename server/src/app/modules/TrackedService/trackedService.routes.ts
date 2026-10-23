import express from "express";
import { TrackedServiceControllers } from "./trackedService.controllers";
import { TrackedStepControllers } from "../TrackedStep/trackedStep.controllers";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { TrackedServiceValidation } from "./trackedService.validation";
import { TrackedStepValidation } from "../TrackedStep/trackedStep.validation";

const router = express.Router();

router.get(
  "/",
  auth("USER", "ADMIN"),
  TrackedServiceControllers.getMyTrackedServices,
);
router.post(
  "/",
  auth("USER", "ADMIN"),
  validateRequest(TrackedServiceValidation.createTrackedServiceSchema),
  TrackedServiceControllers.createTrackedService,
);
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
router.get(
  "/:tracked_service_id",
  auth("USER", "ADMIN"),
  validateRequest(TrackedServiceValidation.trackedServiceIdSchema),
  TrackedServiceControllers.getSingleTrackedService,
);
router.patch(
  "/:tracked_service_id",
  auth("USER", "ADMIN"),
  validateRequest(TrackedServiceValidation.updateTrackedServiceSchema),
  TrackedServiceControllers.updateTrackedService,
);
router.delete(
  "/:tracked_service_id",
  auth("USER", "ADMIN"),
  validateRequest(TrackedServiceValidation.trackedServiceIdSchema),
  TrackedServiceControllers.deleteTrackedService,
);

export const TrackedServiceRoutes = router;
