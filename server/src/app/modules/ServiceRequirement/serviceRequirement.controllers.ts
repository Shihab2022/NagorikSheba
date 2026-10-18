import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { ServiceRequirementServices } from "./serviceRequirement.services";

const createServiceRequirement = catchAsync(async (req: any, res: any) => {
  const result = await ServiceRequirementServices.createServiceRequirementIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service requirement created successfully!",
    data: result,
  });
});

const getServiceRequirements = catchAsync(async (req: any, res: any) => {
  const { serviceId } = req.params;
  const result = await ServiceRequirementServices.getServiceRequirementsFromDB(serviceId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service requirements retrieved successfully!",
    data: result,
  });
});

const updateServiceRequirement = catchAsync(async (req: any, res: any) => {
  const result = await ServiceRequirementServices.updateServiceRequirementIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service requirement updated successfully!",
    data: result,
  });
});

const deleteServiceRequirement = catchAsync(async (req: any, res: any) => {
  const { requirement_id } = req.params;
  const result = await ServiceRequirementServices.deleteServiceRequirementFromDB(requirement_id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service requirement deleted successfully!",
    data: result,
  });
});

export const ServiceRequirementControllers = {
  createServiceRequirement,
  getServiceRequirements,
  updateServiceRequirement,
  deleteServiceRequirement,
};
