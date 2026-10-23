import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UploadService } from "./upload.services";

const uploadFiles = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const result = await UploadService.uploadFiles(files);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Files uploaded successfully!",
    data: result,
  });
});

export const UploadControllers = {
  uploadFiles,
};
