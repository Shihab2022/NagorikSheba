import express from "express";
import { GovernmentOfficesController } from "./government-offices.controller";

const router = express.Router();

// Public, read-only endpoints — no auth required to find a government office.
router.get("/nearby", GovernmentOfficesController.getNearby);
router.get("/by-area", GovernmentOfficesController.getByArea);
router.get("/areas", GovernmentOfficesController.getAreas);

// AI nearest location lookup (supports natural-language location queries in Bangladesh)
router.get("/ai-nearest", GovernmentOfficesController.getAiNearest);
router.post("/ai-nearest", GovernmentOfficesController.getAiNearest);

export const GovernmentOfficesRouter = router;
