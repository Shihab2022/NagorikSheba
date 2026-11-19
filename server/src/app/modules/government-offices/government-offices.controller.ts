import { Request, Response } from "express";
import httpStatus from "http-status";
import { GovernmentOfficesServices } from "./government-offices.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const getNearby = catchAsync(async (req: Request, res: Response) => {
  const service = req.query.service ?? req.query.slug;

  const result = await GovernmentOfficesServices.findNearbyOffices({
    service: service ?? "ALL",
    lat: req.query.lat,
    lng: req.query.lng ?? req.query.lon ?? req.query.long,
    location: req.query.location ?? req.query.place ?? req.query.address,
    radiusKm: req.query.radiusKm ?? req.query.radius,
    page: req.query.page,
    limit: req.query.limit,
  });

  const isPassport =
    service === "PASSPORT" ||
    service === "epassport-new" ||
    service === "passport-renewal";

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      result.offices.length > 0
        ? isPassport
          ? "Nearby passport offices in Bangladesh retrieved successfully!"
          : "Nearby government offices in Bangladesh retrieved successfully!"
        : "No government offices found within the selected radius in Bangladesh.",
    meta: result.meta,
    data: {
      service: result.service,
      country: "Bangladesh",
      origin: result.origin,
      locationName: result.locationName,
      radiusKm: result.radiusKm,
      offices: result.offices,
    },
  });
});

const getByArea = catchAsync(async (req: Request, res: Response) => {
  const result = await GovernmentOfficesServices.findOfficesByArea({
    service: req.query.service ?? req.query.slug,
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
        ? "Government offices for the selected area in Bangladesh retrieved successfully!"
        : "No government offices found in the selected area.",
    meta: result.meta,
    data: {
      service: result.service,
      country: "Bangladesh",
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
    message: "Service areas in Bangladesh retrieved successfully!",
    data: areas,
  });
});

/**
 * AI-powered nearest location endpoint.
 * Supports natural-language location queries (e.g. "Mirpur, Dhaka", "Sylhet Sadar", "Agrabad, Chattogram")
 * and coordinates. Strictly checks Bangladesh boundaries and returns nearest offices with directions.
 */
const getAiNearest = catchAsync(async (req: Request, res: Response) => {
  const body = req.method === "POST" ? req.body : req.query;

  const service = body.service ?? body.slug ?? "ALL";
  const location = body.location ?? body.place ?? body.address ?? body.query;
  const lat = body.lat;
  const lng = body.lng ?? body.lon ?? body.long;
  const radiusKm = body.radiusKm ?? body.radius ?? 50;
  const limit = body.limit ?? 5;

  const result = await GovernmentOfficesServices.findNearbyOffices({
    service,
    location,
    lat,
    lng,
    radiusKm,
    limit,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      result.offices.length > 0
        ? `Found ${result.offices.length} nearest government offices in Bangladesh.`
        : "No matching government offices found within Bangladesh.",
    meta: result.meta,
    data: {
      country: "Bangladesh",
      service: result.service,
      origin: result.origin,
      locationName: result.locationName,
      radiusKm: result.radiusKm,
      offices: result.offices,
    },
  });
});

export const GovernmentOfficesController = {
  getNearby,
  getByArea,
  getAreas,
  getAiNearest,
};
