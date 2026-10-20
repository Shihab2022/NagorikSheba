import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { ServiceFeeServices } from "./serviceFee.services";

const createServiceFee = catchAsync(async (req: any, res: any) => {
  const result = await ServiceFeeServices.createServiceFeeIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service fee created successfully!",
    data: result,
  });
});

const getServiceFees = catchAsync(async (req: any, res: any) => {
  const { serviceId } = req.params;
  const result = await ServiceFeeServices.getServiceFeesFromDB(serviceId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service fees retrieved successfully!",
    data: result,
  });
});

const updateServiceFee = catchAsync(async (req: any, res: any) => {
  const result = await ServiceFeeServices.updateServiceFeeIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service fee updated successfully!",
    data: result,
  });
});

const deleteServiceFee = catchAsync(async (req: any, res: any) => {
  const { fee_id } = req.params;
  const result = await ServiceFeeServices.deleteServiceFeeFromDB(fee_id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service fee deleted successfully!",
    data: result,
  });
});

export const ServiceFeeControllers = {
  createServiceFee,
  getServiceFees,
  updateServiceFee,
  deleteServiceFee,
};
