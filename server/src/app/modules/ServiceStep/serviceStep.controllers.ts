import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { ServiceStepServices } from "./serviceStep.services";

const createServiceStep = catchAsync(async (req: any, res: any) => {
  const result = await ServiceStepServices.createServiceStepIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service step created successfully!",
    data: result,
  });
});

const getServiceSteps = catchAsync(async (req: any, res: any) => {
  const { serviceId } = req.params;
  const result = await ServiceStepServices.getServiceStepsFromDB(serviceId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service steps retrieved successfully!",
    data: result,
  });
});

const updateServiceStep = catchAsync(async (req: any, res: any) => {
  const result = await ServiceStepServices.updateServiceStepIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service step updated successfully!",
    data: result,
  });
});

const deleteServiceStep = catchAsync(async (req: any, res: any) => {
  const { step_id } = req.params;
  const result = await ServiceStepServices.deleteServiceStepFromDB(step_id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service step deleted successfully!",
    data: result,
  });
});

export const ServiceStepControllers = {
  createServiceStep,
  getServiceSteps,
  updateServiceStep,
  deleteServiceStep,
};
