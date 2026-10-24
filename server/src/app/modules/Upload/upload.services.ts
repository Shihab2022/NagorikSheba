import { Readable } from "stream";
import path from "path";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "../../../config/cloudinary";
import httpStatus from "http-status";
import ApiError from "../../errors/AppError";
import { CLOUDINARY_UPLOAD_FOLDER } from "./upload.constants";

export interface IUploadedFile {
  originalName: string;
  secureUrl: string;
  publicId: string;
  resourceType: string;
  format: string;
  bytes: number;
  width?: number | null;
  height?: number | null;
}

export interface IUploadResult {
  uploaded: IUploadedFile[];
  totalUploaded: number;
}

const uploadSingleBuffer = (
  file: Express.Multer.File
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_UPLOAD_FOLDER,
        resource_type: "auto",
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
  files: Express.Multer.File[]
): Promise<IUploadResult> => {
  const uploadPromises = files.map((file) =>
    uploadSingleBuffer(file)
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

    const firstError = failures[0].error as Error | undefined;
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      `Upload failed for ${failures.length} file(s): ${
        firstError?.message || "Cloud storage upload failed"
      }`
    );
  }

  const uploaded: IUploadedFile[] = successes.map((s) => ({
    originalName: s.file.originalname,
    secureUrl: s.result.secure_url,
    publicId: s.result.public_id,
    resourceType: s.result.resource_type,
    format:
      s.result.format ||
      path.extname(s.file.originalname).replace(".", "").toLowerCase(),
    bytes: s.result.bytes,
    width: s.result.width ?? null,
    height: s.result.height ?? null,
  }));

  return {
    uploaded,
    totalUploaded: uploaded.length,
  };
};

export const UploadService = {
  uploadFiles,
};
