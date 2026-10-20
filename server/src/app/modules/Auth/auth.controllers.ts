import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { setAuthCookie } from "../../../utils/setAuthCookie";
import { AuthServices } from "./auth.services";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.createUser(req);
  setAuthCookie(res, result.accessToken);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Account created successfully!",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);
  setAuthCookie(res, result.accessToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully!",
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);
  setAuthCookie(res, result.accessToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token generated successfully!",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await AuthServices.changePassword(user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully!",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.forgotPassword(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Check your email for the reset link!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";
  await AuthServices.resetPassword(token, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully!",
    data: null,
  });
});

const googleAuth = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.authWithGoogle(req.body);
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
  const result = await AuthServices.getMe(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User details retrieved successfully!",
    data: result,
  });
});

export const AuthController = {
  createUser,
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  googleAuth,
  getMe,
};
