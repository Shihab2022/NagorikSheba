import path from "path";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import httpStatus from "http-status";
import ApiError from "../errors/AppError";
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  MAX_FILE_COUNT,
  MAX_FILE_SIZE,
  UPLOAD_FIELD_NAME,
  UPLOAD_RATE_LIMIT,
} from "../modules/Upload/upload.constants";

// Memory storage for direct buffer streaming to Cloudinary
const storage = multer.memoryStorage();

// File filter for extension and initial MIME type check
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();

  const isAllowedExt = (ALLOWED_EXTENSIONS as readonly string[]).includes(ext);
  const isAllowedMime = (ALLOWED_MIME_TYPES as readonly string[]).includes(
    file.mimetype
  );

  if (!isAllowedExt || !isAllowedMime) {
    return cb(
      new ApiError(
        httpStatus.BAD_REQUEST,
        `Invalid file type for '${file.originalname}'. Allowed types: JPEG, PNG, WebP, GIF, PDF`
      )
    );
  }

  cb(null, true);
};

// Multer upload middleware configured for multiple files
const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILE_COUNT,
  },
  fileFilter,
});

export const multerUpload = upload.array(UPLOAD_FIELD_NAME, MAX_FILE_COUNT);

// Magic byte verification for deep content validation
function detectMimeFromMagicBytes(buffer: Buffer): string | null {
  if (!buffer || buffer.length < 4) {
    return null;
  }

  // JPEG: FF D8 FF
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  // GIF: GIF87a or GIF89a (47 49 46 38)
  if (
    buffer.length >= 6 &&
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return "image/gif";
  }

  // PDF: %PDF (25 50 44 46)
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return "application/pdf";
  }

  // WebP: RIFF....WEBP (52 49 46 46 .... 57 45 42 50)
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }

  return null;
}

// Middleware to validate file presence and verify magic bytes
export const validateFiles = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const files = req.files as Express.Multer.File[] | undefined;

  if (!files || !Array.isArray(files) || files.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No files provided");
  }

  if (files.length > MAX_FILE_COUNT) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Cannot upload more than ${MAX_FILE_COUNT} files`
    );
  }

  for (const file of files) {
    if (!file.buffer || file.buffer.length === 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `File '${file.originalname}' is empty`
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new ApiError(
        httpStatus.REQUEST_ENTITY_TOO_LARGE,
        `File '${file.originalname}' exceeds the 5MB size limit`
      );
    }

    const detectedType = detectMimeFromMagicBytes(file.buffer);

    if (!detectedType) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `File '${file.originalname}' has invalid or corrupted content (signature mismatch).`
      );
    }

    const isJpegVariant =
      (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") &&
      detectedType === "image/jpeg";

    if (detectedType !== file.mimetype && !isJpegVariant) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `File '${file.originalname}' content does not match its declared type '${file.mimetype}'.`
      );
    }
  }

  next();
};

// Dedicated rate limiter for upload endpoints
export const uploadLimiter = rateLimit({
  windowMs: UPLOAD_RATE_LIMIT.windowMs,
  max: UPLOAD_RATE_LIMIT.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: UPLOAD_RATE_LIMIT.message,
});
