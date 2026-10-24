export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".pdf",
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB per file
export const MAX_FILE_COUNT = 10;
export const UPLOAD_FIELD_NAME = "files";
export const CLOUDINARY_UPLOAD_FOLDER = "nagorik-sheba";

export const UPLOAD_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per IP per window
  message: {
    success: false,
    message: "Too many upload requests from this IP, please try again after 15 minutes.",
  },
};
