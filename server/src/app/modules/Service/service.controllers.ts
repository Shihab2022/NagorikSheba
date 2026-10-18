import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { ServiceServices } from "./service.services";

const createService = catchAsync(async (req: any, res: any) => {
  const result = await ServiceServices.createServiceIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service created successfully!",
    data: result,
  });
});

const getAllServices = catchAsync(async (req: any, res: any) => {
  const result = await ServiceServices.getAllServicesFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Services retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleService = catchAsync(async (req: any, res: any) => {
  const { service_id } = req.params;
  const result = await ServiceServices.getSingleServiceFromDB(service_id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service retrieved successfully!",
    data: result,
  });
});

const updateService = catchAsync(async (req: any, res: any) => {
  const result = await ServiceServices.updateServiceIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service updated successfully!",
    data: result,
  });
});

const deleteService = catchAsync(async (req: any, res: any) => {
  const { service_id } = req.params;
  const result = await ServiceServices.deleteServiceFromDB(service_id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service deleted successfully!",
    data: result,
  });
});

export const ServiceControllers = {
  createService,
  getAllServices,
  getSingleService,
  updateService,
  deleteService,
};
