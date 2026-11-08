import express from "express";
import { NoticeControllers } from "./notice.controllers";

const router = express.Router();

// Latest notices endpoint for service details & widgets
// Accessible at GET /api/notices/latest?categoryId=... or ?slug=...
router.get("/latest", NoticeControllers.getLatestNotices);

export const NoticeRoutes = router;
