import express from "express";
import { TrackedServiceControllers } from "./trackedService.controllers";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { TrackedServiceValidation } from "./trackedService.validation";

const router = express.Router();

router.get(
  "/",
  auth("USER"),
  TrackedServiceControllers.getMyTrackedServices,
);
router.post(
  "/",
  auth("USER"),
  validateRequest(TrackedServiceValidation.createTrackedServiceSchema),
  TrackedServiceControllers.createTrackedService,
);
router.get(
  "/:tracked_service_id",
  auth("USER"),
  validateRequest(TrackedServiceValidation.trackedServiceIdSchema),
  TrackedServiceControllers.getSingleTrackedService,
);
router.patch(
  "/:tracked_service_id",
  auth("USER"),
  validateRequest(TrackedServiceValidation.updateTrackedServiceSchema),
  TrackedServiceControllers.updateTrackedService,
);
router.delete(
  "/:tracked_service_id",
  auth("USER"),
  validateRequest(TrackedServiceValidation.trackedServiceIdSchema),
  TrackedServiceControllers.deleteTrackedService,
);

export const TrackedServiceRoutes = router;
