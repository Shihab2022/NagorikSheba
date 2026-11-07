
import { Request, Response } from "express";
import httpStatus from "http-status";
import { GovernmentOfficesServices } from "./government-offices.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const getNearby = catchAsync(async (req: Request, res: Response) => {
  const service = req.query.service ?? req.query.slug;

  // Passport-specific response handling.
  // Passport office discovery uses the existing OSM + Valhalla provider.
  if (
    service === "PASSPORT" ||
    service === "epassport-new" ||
    service === "passport-renewal"
  ) {
    const result = await GovernmentOfficesServices.findNearbyOffices({
      service,
      lat: req.query.lat,
      lng: req.query.lng ?? req.query.lon ?? req.query.long,
      radiusKm: req.query.radiusKm ?? req.query.radius,
      page: 1,
      limit: req.query.limit,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        result.offices.length > 0
          ? "Nearby passport offices retrieved successfully!"
          : "No passport offices found within the selected radius. The configured source data may not contain passport records.",
      meta: { ...result.meta, page: 1 },
      data: {
        service: "PASSPORT",
        origin: result.origin,
        radiusKm: result.radiusKm,
        offices: result.offices,
      },
    });

    return;
  }

  // Generic nearby-office handler for other government services.
  // Supports both service keys and service-page slugs.
  // Also accepts radiusKm or radius from the frontend.
  const result = await GovernmentOfficesServices.findNearbyOffices({
    service,
    lat: req.query.lat,
    lng: req.query.lng ?? req.query.lon ?? req.query.long,
    radiusKm: req.query.radiusKm ?? req.query.radius,
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
    service: req.query.service ?? req.query.slug,
    district: req.query.district,
    districtBn: req.query.districtBn,
    upazila: req.query.upazila,
    upazilaBn: req.query.upazilaBn,
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
    service: req.query.service ?? req.query.slug,
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
