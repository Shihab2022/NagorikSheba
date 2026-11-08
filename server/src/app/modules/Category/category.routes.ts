import express from "express";
import { CategoryControllers } from "./category.controllers";
import { NoticeControllers } from "../Notice/notice.controllers";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", CategoryControllers.getAllCategories);
// Notice sub-resource for category: GET /api/category/:slug/notices
router.get("/:slug/notices", NoticeControllers.getCategoryNotices);
router.get("/:category_id", CategoryControllers.getSingleCategory);
router.post("/", auth("ADMIN"), CategoryControllers.createCategory);
router.patch("/:category_id", auth("ADMIN"), CategoryControllers.updateCategory);
router.delete("/:category_id", auth("ADMIN"), CategoryControllers.deleteCategory);

export const CategoryRoutes = router;
