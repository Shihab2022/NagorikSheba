import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { NoticeServices } from "./notice.services";

// -------------------------------------------------------------
// PUBLIC CONTROLLERS
// -------------------------------------------------------------

const getCategoryNotices = catchAsync(async (req: any, res: any) => {
  const { slug } = req.params;
  const { page, limit } = req.query;

  const result = await NoticeServices.getCategoryNotices(slug, { page, limit });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category notices retrieved successfully!",
    data: result,
  });
});

const getLatestNotices = catchAsync(async (req: any, res: any) => {
  const { categoryId, slug, limit } = req.query;

  const result = await NoticeServices.getLatestNotices({
    categoryId: categoryId as string,
    slug: slug as string,
    limit: limit ? Number(limit) : undefined,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Latest notices retrieved successfully!",
    data: result,
  });
});

// -------------------------------------------------------------
// ADMIN NOTICE SOURCES
// -------------------------------------------------------------

const getAllNoticeSources = catchAsync(async (_req: any, res: any) => {
  const result = await NoticeServices.getAllNoticeSources();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice sources retrieved successfully!",
    data: result,
  });
});

const getNoticeSourceById = catchAsync(async (req: any, res: any) => {
  const id = parseInt(req.params.id, 10);
  const result = await NoticeServices.getNoticeSourceById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice source retrieved successfully!",
    data: result,
  });
});

const createNoticeSource = catchAsync(async (req: any, res: any) => {
  const result = await NoticeServices.createNoticeSource(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Notice source created successfully!",
    data: result,
  });
});

const updateNoticeSource = catchAsync(async (req: any, res: any) => {
  const id = parseInt(req.params.id, 10);
  const result = await NoticeServices.updateNoticeSource(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice source updated successfully!",
    data: result,
  });
});

const deleteNoticeSource = catchAsync(async (req: any, res: any) => {
  const id = parseInt(req.params.id, 10);
  const result = await NoticeServices.deleteNoticeSource(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice source deleted successfully!",
    data: result,
  });
});

const testNoticeSource = catchAsync(async (req: any, res: any) => {
  const id = parseInt(req.params.id, 10);
  const result = await NoticeServices.testNoticeSource(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice source test completed successfully!",
    data: result,
  });
});

const runNoticeSource = catchAsync(async (req: any, res: any) => {
  const id = parseInt(req.params.id, 10);
  const result = await NoticeServices.runNoticeSource(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice source scrape executed successfully!",
    data: result,
  });
});

// -------------------------------------------------------------
// ADMIN NOTICES
// -------------------------------------------------------------

const getAllNoticesAdmin = catchAsync(async (req: any, res: any) => {
  const { page, limit, categoryId, search } = req.query;
  const result = await NoticeServices.getAllNoticesAdmin({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    categoryId: categoryId as string,
    search: search as string,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin notices retrieved successfully!",
    data: result,
  });
});

const createManualNotice = catchAsync(async (req: any, res: any) => {
  const result = await NoticeServices.createManualNotice(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Notice created successfully!",
    data: result,
  });
});

const updateNotice = catchAsync(async (req: any, res: any) => {
  const id = parseInt(req.params.id, 10);
  const result = await NoticeServices.updateNotice(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice updated successfully!",
    data: result,
  });
});

const deleteNotice = catchAsync(async (req: any, res: any) => {
  const id = parseInt(req.params.id, 10);
  const result = await NoticeServices.deleteNotice(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice deleted successfully!",
    data: result,
  });
});

export const NoticeControllers = {
  getCategoryNotices,
  getLatestNotices,
  getAllNoticeSources,
  getNoticeSourceById,
  createNoticeSource,
  updateNoticeSource,
  deleteNoticeSource,
  testNoticeSource,
  runNoticeSource,
  getAllNoticesAdmin,
  createManualNotice,
  updateNotice,
  deleteNotice,
};
