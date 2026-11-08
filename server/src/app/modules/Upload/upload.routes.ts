import express from "express";
import auth from "../../middlewares/auth";
import {
  multerUpload,
  uploadLimiter,
  validateFiles,
} from "../../middlewares/fileValidation";
import { UploadControllers } from "./upload.controllers";

const router = express.Router();

// Download route (must be before any parameterized route)
router.get("/download", UploadControllers.downloadFile);

// Get all uploaded files directly from Cloudinary
router.get("/", auth("USER", "ADMIN"), UploadControllers.getAllUploadedFiles);

// Upload files to Cloudinary
router.post(
  "/",
  auth("USER", "ADMIN"),
  uploadLimiter,
  multerUpload,
  validateFiles,
  UploadControllers.uploadFiles
);

// Delete uploaded file by publicId
router.delete("/", auth("USER", "ADMIN"), UploadControllers.deleteUploadedFile);
router.delete("/:publicId", auth("USER", "ADMIN"), UploadControllers.deleteUploadedFile);

export const UploadRoutes = router;
