import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/AppError";
import httpStatus from "http-status";

const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorMessages: { path: string; message: string }[] = [];

  // Postgres unique-violation
  if (err?.code === "23505") {
    statusCode = 409;
    message = "A resource with the given value already exists.";
  }

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err?.statusCode && err?.message) {
    statusCode = err.statusCode;
    message = err.message;
    errorMessages = err.errorMessages || [];
  } else if (err instanceof Error) {
    message = err.message;
    errorMessages = [{ path: "", message: err.message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: process.env.NODE_ENV === "development" ? err?.stack : undefined,
  });
};

export default globalErrorHandler;
