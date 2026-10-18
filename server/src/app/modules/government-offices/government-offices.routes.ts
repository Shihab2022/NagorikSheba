import express from "express";
import { GovernmentOfficesController } from "./government-offices.controller";

const router = express.Router();

// Public, read-only endpoints — no auth required to find a government office.
router.get("/nearby", GovernmentOfficesController.getNearby);
router.get("/by-area", GovernmentOfficesController.getByArea);
router.get("/areas", GovernmentOfficesController.getAreas);

export const GovernmentOfficesRouter = router;
