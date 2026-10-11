import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import catchAsync from "../../helpars/catchAsync";
import sendResponse from "../../helpars/sendResponse";
import { AuthServices } from "./auth.service";
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
    const result = await AuthServices.loginUser(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "user logged in successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getMe = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User details retrieved successfully!",
    data: [],
  });
});

export const AuthController = {
  createUser,
  loginUser,
  getMe,
};
