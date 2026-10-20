import express from "express";
import { ServiceRequirementControllers } from "./serviceRequirement.controllers";
import auth from "../../middlewares/auth";

const router = express.Router({ mergeParams: true });

router.get("/:serviceId", ServiceRequirementControllers.getServiceRequirements);
router.post("/", auth("ADMIN"), ServiceRequirementControllers.createServiceRequirement);
router.patch("/:requirement_id", auth("ADMIN"), ServiceRequirementControllers.updateServiceRequirement);
router.delete("/:requirement_id", auth("ADMIN"), ServiceRequirementControllers.deleteServiceRequirement);

export const ServiceRequirementRoutes = router;