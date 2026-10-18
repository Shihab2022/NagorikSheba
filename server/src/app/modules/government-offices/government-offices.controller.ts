import { Request, Response } from "express";
import httpStatus from "http-status";
import { GovernmentOfficesServices } from "./government-offices.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const getNearby = catchAsync(async (req: Request, res: Response) => {
  const result = await GovernmentOfficesServices.findNearbyOffices({
    service: req.query.service,
    lat: req.query.lat,
    lng: req.query.lng,
    radiusKm: req.query.radiusKm,
    page: req.query.page,
    limit: req.query.limit,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      result.offices.length > 0
        ? "Nearby government offices retrieved successfully!"
        : "No government offices found within the selected radius.",
    meta: result.meta,
    data: {
      service: result.service,
      origin: result.origin,
      radiusKm: result.radiusKm,
      offices: result.offices,
    },
  });
});

const getByArea = catchAsync(async (req: Request, res: Response) => {
  const result = await GovernmentOfficesServices.findOfficesByArea({
    service: req.query.service,
    district: req.query.district,
    upazila: req.query.upazila,
    page: req.query.page,
    limit: req.query.limit,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      result.offices.length > 0
        ? "Government offices for the selected area retrieved successfully!"
        : "No government offices found in the selected area.",
    meta: result.meta,
    data: {
      service: result.service,
      area: result.area,
      offices: result.offices,
    },
  });
});

const getAreas = catchAsync(async (req: Request, res: Response) => {
  const areas = await GovernmentOfficesServices.listServiceAreas({
    service: req.query.service,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service areas retrieved successfully!",
    data: areas,
  });
});

export const GovernmentOfficesController = {
  getNearby,
  getByArea,
  getAreas,
};
