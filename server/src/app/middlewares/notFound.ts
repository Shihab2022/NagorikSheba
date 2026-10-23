import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const notFound = (_req: Request, res: Response, _next: NextFunction): void => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API Not Found !!",
    error: "",
  });
};

export default notFound;
