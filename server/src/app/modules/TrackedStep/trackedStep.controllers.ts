import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { TrackedStepServices } from "./trackedStep.services";

const getTrackedSteps = catchAsync(async (req: any, res: any) => {
  const { tracked_service_id } = req.params;
  const result = await TrackedStepServices.getTrackedStepsFromDB(
    tracked_service_id,
    req.user.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tracked steps retrieved successfully!",
    data: result,
  });
});

const updateTrackedStep = catchAsync(async (req: any, res: any) => {
  const { tracked_service_id, service_step_id } = req.params;
  const result = await TrackedStepServices.updateTrackedStepIntoDB({
    trackedServiceId: tracked_service_id,
    serviceStepId: service_step_id,
    userId: req.user.id,
    status: req.body.status,
    note: req.body.note,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tracked step updated successfully!",
    data: result,
  });
});

export const TrackedStepControllers = {
  getTrackedSteps,
  updateTrackedStep,
};
