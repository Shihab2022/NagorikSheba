import { Readable } from "stream";
import path from "path";
import https from "https";
import http from "http";
import { Response } from "express";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "../../../config/cloudinary";
import httpStatus from "http-status";
import ApiError from "../../errors/AppError";
import { CLOUDINARY_UPLOAD_FOLDER } from "./upload.constants";

export interface IUploadedFile {
  id?: string;
  originalName: string;
  secureUrl: string;
  publicId: string;
  resourceType: string;
  format: string;
  bytes: number;
  width?: number | null;
  height?: number | null;
  uploadedAt?: string;
}

export interface IUploadResult {
  uploaded: IUploadedFile[];
  totalUploaded: number;
}

const uploadSingleBuffer = (
  file: Express.Multer.File,
  userId: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const rawExt = path.extname(file.originalname).toLowerCase();
    const rawBaseName = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9_-]/g, "_");
    const safeBaseName = rawBaseName.slice(0, 50) || "file";
    const safeUserId = String(userId).trim().replace(/[^a-zA-Z0-9_-]/g, "_");
    const userFolder = `${CLOUDINARY_UPLOAD_FOLDER}/${safeUserId}`;
    const userTag = `user_${safeUserId}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: userFolder,
        resource_type: "auto",
        public_id: `${safeBaseName}_${Date.now()}`,
        use_filename: true,
        unique_filename: true,
        tags: [CLOUDINARY_UPLOAD_FOLDER, userTag],
        context: {
          originalName: file.originalname,
          userId: safeUserId,
          rawUserId: String(userId),
        },
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(
            new Error("Upload finished but received an empty response from Cloudinary")
          );
        }
        resolve(result);
      }
    );

    const readable = new Readable();
    readable.push(file.buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

const uploadFiles = async (
  files: Express.Multer.File[],
  userId: string
): Promise<IUploadResult> => {
  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User authentication required");
  }

  const uploadPromises = files.map((file) =>
    uploadSingleBuffer(file, userId)
      .then((result) => ({ success: true as const, file, result }))
      .catch((error) => ({ success: false as const, file, error }))
  );

  const results = await Promise.all(uploadPromises);

  const failures = results.filter((r) => !r.success);
  const successes = results.filter((r) => r.success);

  // If any upload fails, rollback all successfully uploaded files
  if (failures.length > 0) {
    await Promise.allSettled(
      successes.map((s) => {
        const publicId = s.result.public_id;
        const resourceType = s.result.resource_type || "image";
        return cloudinary.uploader.destroy(publicId, {
          resource_type: resourceType,
        });
      })
    );

    const firstError = failures[0]?.error as Error | undefined;
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      `Upload failed for ${failures.length} file(s): ${
        firstError?.message || "Cloud storage upload failed"
      }`
    );
  }

  const uploaded: IUploadedFile[] = successes.map((s) => {
    const ext = path.extname(s.file.originalname).replace(".", "").toLowerCase();
    const format = s.result.format || ext || (s.result.resource_type === "raw" ? "pdf" : "jpg");

    return {
      originalName: s.file.originalname,
      secureUrl: s.result.secure_url,
      publicId: s.result.public_id,
      resourceType: s.result.resource_type,
      format,
      bytes: s.result.bytes,
      width: s.result.width ?? null,
      height: s.result.height ?? null,
      uploadedAt: s.result.created_at || new Date().toISOString(),
    };
  });

  return {
    uploaded,
    totalUploaded: uploaded.length,
  };
};

/**
 * Fetch all files directly stored in Cloudinary for a specific user.
 * Guarantees privacy: each citizen user only sees their own uploaded files.
 */
const getAllUploadedFiles = async (
  userId: string,
  _role?: string
): Promise<IUploadedFile[]> => {
  if (!userId) {
    return [];
  }

  const safeUserId = String(userId).trim().replace(/[^a-zA-Z0-9_-]/g, "_");
  const userFolder = `${CLOUDINARY_UPLOAD_FOLDER}/${safeUserId}`;
  const userTag = `user_${safeUserId}`;

  const isUserAsset = (res: any): boolean => {
    if (!res || !res.public_id) return false;
    const publicId: string = res.public_id;
    if (
      publicId.startsWith(`${userFolder}/`) ||
      publicId.startsWith(`${userFolder}`)
    ) {
      return true;
    }
    if (Array.isArray(res.tags) && res.tags.includes(userTag)) {
      return true;
    }
    const ctx = res.context?.custom || res.context;
    if (
      ctx?.userId === safeUserId ||
      ctx?.userId === String(userId) ||
      ctx?.rawUserId === String(userId)
    ) {
      return true;
    }
    return false;
  };

  // Method 1: Try Cloudinary Search API (indexed search for user folder or tag)
  try {
    const searchRes = await cloudinary.search
      .expression(`folder:${userFolder}* OR tags:${userTag}`)
      .sort_by("created_at", "desc")
      .max_results(100)
      .with_field("context")
      .with_field("tags")
      .execute();

    if (searchRes && Array.isArray(searchRes.resources)) {
      const userResources = searchRes.resources.filter(isUserAsset);

      if (userResources.length > 0) {
        return userResources.map((res: any) => {
          const format = res.format || (res.resource_type === "raw" ? "pdf" : "jpg");
          const contextName =
            res.context?.originalName ||
            res.context?.custom?.originalName;

          let originalName = contextName;
          if (!originalName) {
            if (res.filename) {
              originalName = res.format ? `${res.filename}.${res.format}` : res.filename;
            } else {
              const baseId = path.basename(res.public_id);
              originalName = format ? `${baseId}.${format}` : baseId;
            }
          }

          return {
            id: res.public_id,
            originalName,
            secureUrl: res.secure_url,
            publicId: res.public_id,
            resourceType: res.resource_type || "image",
            format,
            bytes: res.bytes || 0,
            width: res.width ?? null,
            height: res.height ?? null,
            uploadedAt: res.created_at || res.uploaded_at,
          };
        });
      }
    }
  } catch (searchErr) {
    console.warn("Cloudinary Search API error or empty, checking Admin API:", searchErr);
  }

  // Method 2: Fallback to Cloudinary Admin Resources API with prefix (strongly consistent)
  const files: IUploadedFile[] = [];
  const seenIds = new Set<string>();

  const [imagesRes, rawRes] = await Promise.allSettled([
    cloudinary.api.resources({
      type: "upload",
      prefix: userFolder,
      resource_type: "image",
      max_results: 100,
      context: true,
      tags: true,
    }),
    cloudinary.api.resources({
      type: "upload",
      prefix: userFolder,
      resource_type: "raw",
      max_results: 100,
      context: true,
      tags: true,
    }),
  ]);

  const addResource = (res: any, defaultType: string, defaultExt: string) => {
    if (!res || !res.public_id || seenIds.has(res.public_id)) return;
    if (!isUserAsset(res)) return;

    seenIds.add(res.public_id);
    const format = res.format || defaultExt;
    const originalName =
      res.context?.custom?.originalName ||
      res.context?.originalName ||
      (res.filename ? `${res.filename}.${format}` : `${path.basename(res.public_id)}.${format}`);

    files.push({
      id: res.public_id,
      originalName,
      secureUrl: res.secure_url,
      publicId: res.public_id,
      resourceType: res.resource_type || defaultType,
      format,
      bytes: res.bytes || 0,
      width: res.width ?? null,
      height: res.height ?? null,
      uploadedAt: res.created_at || new Date().toISOString(),
    });
  };

  if (imagesRes.status === "fulfilled" && imagesRes.value?.resources) {
    imagesRes.value.resources.forEach((res: any) => addResource(res, "image", "jpg"));
  }

  if (rawRes.status === "fulfilled" && rawRes.value?.resources) {
    rawRes.value.resources.forEach((res: any) => addResource(res, "raw", "pdf"));
  }

  // Also query by tag if prefix was empty
  if (files.length === 0) {
    try {
      const tagRes = await cloudinary.api.resources_by_tag(userTag, {
        max_results: 100,
        context: true,
        tags: true,
      });
      if (tagRes?.resources && Array.isArray(tagRes.resources)) {
        tagRes.resources.forEach((res: any) =>
          addResource(res, res.resource_type || "image", res.format || "jpg")
        );
      }
    } catch {
      // Ignore if tag indexing not present
    }
  }

  // Sort newest first
  files.sort((a, b) => {
    const timeA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
    const timeB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
    return timeB - timeA;
  });

  return files;
};

/**
 * Delete a specific file from Cloudinary by its publicId.
 * Verifies ownership if the requester is not an ADMIN.
 */
const deleteUploadedFile = async (
  publicId: string,
  resourceType: string = "image",
  userId?: string,
  role?: string
) => {
  if (!publicId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "File publicId is required");
  }

  // Security check: verify user owns the file unless ADMIN
  if (role !== "ADMIN" && userId) {
    const safeUserId = String(userId).trim().replace(/[^a-zA-Z0-9_-]/g, "_");
    const userFolder = `${CLOUDINARY_UPLOAD_FOLDER}/${safeUserId}`;
    const userTag = `user_${safeUserId}`;

    const hasFolderPrefix =
      publicId.startsWith(`${userFolder}/`) ||
      publicId.startsWith(`${userFolder}`);

    if (!hasFolderPrefix) {
      try {
        const resource = await cloudinary.api.resource(publicId, {
          resource_type: resourceType as any,
          context: true,
          tags: true,
        });

        const isOwner =
          (Array.isArray(resource?.tags) && resource.tags.includes(userTag)) ||
          resource?.context?.userId === safeUserId ||
          resource?.context?.custom?.userId === safeUserId ||
          resource?.context?.rawUserId === String(userId);

        if (!isOwner) {
          throw new ApiError(
            httpStatus.FORBIDDEN,
            "আপনি এই ফাইলটি মুছে ফেলার অনুমতিপ্রাপ্ত নন (You do not have permission to delete this file)"
          );
        }
      } catch (err: any) {
        if (err instanceof ApiError) throw err;
        // If resource fetching failed with 404, continue to destroy
      }
    }
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType as any,
    });
    return result;
  } catch (error: any) {
    // Retry with 'raw' if 'image' failed
    if (resourceType === "image") {
      try {
        return await cloudinary.uploader.destroy(publicId, {
          resource_type: "raw",
        });
      } catch (innerErr) {
        throw innerErr;
      }
    }
    throw error;
  }
};

/**
 * Proxy stream a file from Cloudinary directly to HTTP client response.
 * Guarantees proper Content-Disposition: attachment and Content-Type: application/pdf.
 */
const streamFileDownload = (
  url: string,
  filename: string,
  res: Response
) => {
  const safeFilename = filename?.trim() || path.basename(url.split("?")[0]);
  const ext = path.extname(safeFilename).toLowerCase();

  let contentType = "application/octet-stream";
  if (ext === ".pdf") contentType = "application/pdf";
  else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
  else if (ext === ".png") contentType = "image/png";
  else if (ext === ".webp") contentType = "image/webp";
  else if (ext === ".gif") contentType = "image/gif";

  const client = url.startsWith("https") ? https : http;

  const request = client.get(url, (cloudRes) => {
    // Handle redirect from Cloudinary if any
    if (
      cloudRes.statusCode &&
      cloudRes.statusCode >= 300 &&
      cloudRes.statusCode < 400 &&
      cloudRes.headers.location
    ) {
      return streamFileDownload(cloudRes.headers.location, safeFilename, res);
    }

    if (cloudRes.statusCode !== 200) {
      return res.status(cloudRes.statusCode || 500).json({
        success: false,
        message: "Failed to fetch file from Cloudinary storage",
      });
    }

    // Set download headers
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(safeFilename)}"; filename*=UTF-8''${encodeURIComponent(safeFilename)}`
    );
    res.setHeader("Content-Type", contentType);

    if (cloudRes.headers["content-length"]) {
      res.setHeader("Content-Length", cloudRes.headers["content-length"]);
    }

    cloudRes.pipe(res);
  });

  request.on("error", (err) => {
    console.error("streamFileDownload error:", err);
    if (!res.headersSent) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to download file from cloud storage",
      });
    }
  });
};

export const UploadService = {
  uploadFiles,
  getAllUploadedFiles,
  deleteUploadedFile,
  streamFileDownload,
};
