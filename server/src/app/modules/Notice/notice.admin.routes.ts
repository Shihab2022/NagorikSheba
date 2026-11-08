import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { NoticeControllers } from "./notice.controllers";
import { NoticeSourceValidation, NoticeValidation } from "./notice.validation";

const router = express.Router();

// Apply ADMIN authentication to all admin notice endpoints
router.use(auth("ADMIN"));

// Notice Sources management
router.get("/notice-sources", NoticeControllers.getAllNoticeSources);
router.post(
  "/notice-sources",
  validateRequest(NoticeSourceValidation.createNoticeSource),
  NoticeControllers.createNoticeSource
);
router.get("/notice-sources/:id", NoticeControllers.getNoticeSourceById);
router.patch(
  "/notice-sources/:id",
  validateRequest(NoticeSourceValidation.updateNoticeSource),
  NoticeControllers.updateNoticeSource
);
router.delete("/notice-sources/:id", NoticeControllers.deleteNoticeSource);

// Scraper testing (dry run) and immediate manual run
router.post("/notice-sources/:id/test", NoticeControllers.testNoticeSource);
router.post("/notice-sources/:id/run", NoticeControllers.runNoticeSource);

// Notices management
router.get("/notices", NoticeControllers.getAllNoticesAdmin);
router.post(
  "/notices",
  validateRequest(NoticeValidation.createManualNotice),
  NoticeControllers.createManualNotice
);
router.patch(
  "/notices/:id",
  validateRequest(NoticeValidation.updateNotice),
  NoticeControllers.updateNotice
);
router.delete("/notices/:id", NoticeControllers.deleteNotice);

export const NoticeAdminRoutes = router;
