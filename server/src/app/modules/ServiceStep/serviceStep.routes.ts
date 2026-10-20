import express from "express";
import { ServiceStepControllers } from "./serviceStep.controllers";
import auth from "../../middlewares/auth";

const router = express.Router({ mergeParams: true });

router.get("/:serviceId", ServiceStepControllers.getServiceSteps);
router.post("/", auth("ADMIN"), ServiceStepControllers.createServiceStep);
router.patch("/:step_id", auth("ADMIN"), ServiceStepControllers.updateServiceStep);
router.delete("/:step_id", auth("ADMIN"), ServiceStepControllers.deleteServiceStep);

export const ServiceStepRoutes = router;