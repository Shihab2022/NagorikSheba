import express from "express";
import { SearchController } from "./search.controller";

const router = express.Router();

// Public search endpoint
router.get("/", SearchController.searchAll);

export const SearchRoutes = router;
