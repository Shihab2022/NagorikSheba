import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { ServiceSourceServices } from "./serviceSource.services";

const createServiceSource = catchAsync(async (req: any, res: any) => {
  const result = await ServiceSourceServices.createServiceSourceIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service source created successfully!",
    data: result,
  });
});

const getServiceSources = catchAsync(async (req: any, res: any) => {
  const { serviceId } = req.params;
  const result = await ServiceSourceServices.getServiceSourcesFromDB(serviceId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service sources retrieved successfully!",
    data: result,
  });
});

const updateServiceSource = catchAsync(async (req: any, res: any) => {
  const result = await ServiceSourceServices.updateServiceSourceIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service source updated successfully!",
    data: result,
  });
});

const deleteServiceSource = catchAsync(async (req: any, res: any) => {
  const { source_id } = req.params;
  const result = await ServiceSourceServices.deleteServiceSourceFromDB(source_id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service source deleted successfully!",
    data: result,
  });
});

export const ServiceSourceControllers = {
  createServiceSource,
  getServiceSources,
  updateServiceSource,
  deleteServiceSource,
};
