import express from "express";
import { ServiceControllers } from "./service.controllers";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", ServiceControllers.getAllServices);
router.get("/:service_id", ServiceControllers.getSingleService);
router.post("/", auth("ADMIN"), ServiceControllers.createService);
router.patch("/:service_id", auth("ADMIN"), ServiceControllers.updateService);
router.delete("/:service_id", auth("ADMIN"), ServiceControllers.deleteService);

export const ServiceRoutes = router;