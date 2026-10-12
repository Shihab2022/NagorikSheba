import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../helpars/catchAsync";
import sendResponse from "../../helpars/sendResponse";
import { setAuthCookie } from "../../utils/setAuthCookie";
import { AuthServices } from "./auth.service";
<<<<<<< HEAD
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
=======

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

>>>>>>> 0b4e698bbfd63faf60bbc38a9a028642f805bbf9
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

