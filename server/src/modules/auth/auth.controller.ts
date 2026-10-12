import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../helpars/catchAsync";
import sendResponse from "../../helpars/sendResponse";
import { setAuthCookie } from "../../utils/setAuthCookie";
import { AuthServices } from "./auth.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.createUserIntoDB(req.body);
  setAuthCookie(res, result.accessToken);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Account created successfully!",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.LoginUserIntoDB(req.body);
  setAuthCookie(res, result.accessToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully!",
    data: result,
  });
});

const googleAuth = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.authWithGoogleIntoDB(req.body);
  setAuthCookie(res, result.accessToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in with Google successfully!",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User details retrieved successfully!",
    data: user,
  });
});

export const AuthController = {
  createUser,
  loginUser,
  googleAuth,
  getMe,
};

