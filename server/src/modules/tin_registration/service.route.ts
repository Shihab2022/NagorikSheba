import { Router } from "express";
import { ServiceController } from "./service.controller";

const router = Router();



router.post("/", ServiceController.createService);


router.get("/", ServiceController.getAllServices);

router.get(
  "/category/:categorySlug",
  ServiceController.getServicesByCategory,
);

router.get("/:slug", ServiceController.getServiceBySlug);

export const TinRegistrantionServiceRoutes = router;
