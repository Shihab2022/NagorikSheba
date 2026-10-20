import express from "express";
import { ServiceSourceControllers } from "./serviceSource.controllers";
import auth from "../../middlewares/auth";

const router = express.Router({ mergeParams: true });

router.get("/:serviceId", ServiceSourceControllers.getServiceSources);
router.post("/", auth("ADMIN"), ServiceSourceControllers.createServiceSource);
router.patch("/:source_id", auth("ADMIN"), ServiceSourceControllers.updateServiceSource);
router.delete("/:source_id", auth("ADMIN"), ServiceSourceControllers.deleteServiceSource);

export const ServiceSourceRoutes = router;