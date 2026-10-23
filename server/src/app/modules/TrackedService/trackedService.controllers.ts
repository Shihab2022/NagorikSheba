import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { TrackedServiceServices } from "./trackedService.services";

const createTrackedService = catchAsync(async (req: any, res: any) => {
  const result = await TrackedServiceServices.createTrackedServiceIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tracked service created successfully!",
    data: result,
  });
});

const getMyTrackedServices = catchAsync(async (req: any, res: any) => {
  const result = await TrackedServiceServices.getMyTrackedServicesFromDB(
    req.user.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tracked services retrieved successfully!",
    data: result,
  });
});

const getSingleTrackedService = catchAsync(async (req: any, res: any) => {
  const { tracked_service_id } = req.params;
  const result = await TrackedServiceServices.getSingleTrackedServiceFromDB(
    tracked_service_id,
    req.user.id,
    req.user.role,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tracked service retrieved successfully!",
    data: result,
  });
});

const updateTrackedService = catchAsync(async (req: any, res: any) => {
  const result = await TrackedServiceServices.updateTrackedServiceIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tracked service updated successfully!",
    data: result,
  });
});

const deleteTrackedService = catchAsync(async (req: any, res: any) => {
  const { tracked_service_id } = req.params;
  const result = await TrackedServiceServices.deleteTrackedServiceFromDB(
    tracked_service_id,
    req.user.id,
    req.user.role,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tracked service deleted successfully!",
    data: result,
  });
});

export const TrackedServiceControllers = {
  createTrackedService,
  getMyTrackedServices,
  getSingleTrackedService,
  updateTrackedService,
  deleteTrackedService,
};
