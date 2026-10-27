import express from "express";
import { CategoryControllers } from "./category.controllers";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", CategoryControllers.getAllCategories);
router.get("/:category_id", CategoryControllers.getSingleCategory);
router.post("/", auth("ADMIN"), CategoryControllers.createCategory);
router.patch("/:category_id", auth("ADMIN"), CategoryControllers.updateCategory);
router.delete("/:category_id", auth("ADMIN"), CategoryControllers.deleteCategory);

export const CategoryRoutes = router;