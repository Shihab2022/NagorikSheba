import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { executeSearch } from "./search.service";

const searchAll = catchAsync(async (req: Request, res: Response) => {
  const { q, category, type, limit } = req.query;

  const result = await executeSearch({
    q: typeof q === "string" ? q : undefined,
    category: typeof category === "string" ? category : undefined,
    type: (typeof type === "string" && ["all", "service", "office", "document"].includes(type))
      ? (type as "all" | "service" | "office" | "document")
      : "all",
    limit: limit ? Number(limit) : undefined,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Search results retrieved successfully",
    data: result,
  });
});

export const SearchController = {
  searchAll,
};
