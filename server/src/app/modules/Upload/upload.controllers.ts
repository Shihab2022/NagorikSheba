import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import ApiError from "../../errors/AppError";
import { UploadService } from "./upload.services";

const uploadFiles = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user?.id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const files = req.files as Express.Multer.File[];
  const result = await UploadService.uploadFiles(files, user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Files uploaded successfully!",
    data: result,
  });
});

const getAllUploadedFiles = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user?.id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const files = await UploadService.getAllUploadedFiles(user.id, user.role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Uploaded files retrieved successfully from Cloudinary!",
    data: files,
  });
});

const deleteUploadedFile = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user?.id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const publicId =
    req.params.publicId ||
    (req.query.publicId as string) ||
    req.body?.publicId;
  const resourceType =
    (req.query.resourceType as string) ||
    req.body?.resourceType ||
    "image";

  if (!publicId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "File publicId is required");
  }

  const result = await UploadService.deleteUploadedFile(
    publicId,
    resourceType,
    user.id,
    user.role
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "File deleted successfully from Cloudinary!",
    data: result,
  });
});

const downloadFile = catchAsync(async (req: Request, res: Response) => {
  const { url, filename } = req.query;

  if (!url || typeof url !== "string") {
    throw new ApiError(httpStatus.BAD_REQUEST, "File URL is required");
  }

  // Ensure url is from Cloudinary
  if (
    !url.startsWith("https://res.cloudinary.com/") &&
    !url.startsWith("http://res.cloudinary.com/")
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid file host");
  }

  UploadService.streamFileDownload(url, (filename as string) || "download", res);
});

export const UploadControllers = {
  uploadFiles,
  getAllUploadedFiles,
  deleteUploadedFile,
  downloadFile,
};
