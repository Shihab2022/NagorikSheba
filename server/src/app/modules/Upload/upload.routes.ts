import express from "express";
import auth from "../../middlewares/auth";
import {
  multerUpload,
  uploadLimiter,
  validateFiles,
} from "../../middlewares/fileValidation";
import { UploadControllers } from "./upload.controllers";

const router = express.Router();

router.post(
  "/",
  auth("USER", "ADMIN"),
  uploadLimiter,
  multerUpload,
  validateFiles,
  UploadControllers.uploadFiles
);

export const UploadRoutes = router;
