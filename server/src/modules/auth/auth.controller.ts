import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../helpars/catchAsync";
import sendResponse from "../../helpars/sendResponse";
import { setAuthCookie } from "../../utils/setAuthCookie";
import { AuthServices } from "./auth.service";
import config from "../../config";
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthServices.registerUserIntoDB(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "user created successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;

    const { accessToken, refreshToken } = await AuthServices.loginUser(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "development" ? false : true,
      sameSite: config.NODE_ENV === "development" ? "lax" : "none",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "development" ? false : true,
      sameSite: config.NODE_ENV === "development" ? "lax" : "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "user logged in successfully!",

      data: { accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};
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

  getMe,
};

