
import type { Request, Response } from "express";
import httpStatus from "http-status";

import sendResponse from "../../helpars/sendResponse";
import { ServiceService } from "./service.service";

const createService = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const payload = req.body;

  const service = await ServiceService.createService(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Service created successfully",
    data: service,
  });
};

const getAllServices = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const services = await ServiceService.getAllServices();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Services retrieved successfully",
    data: services,
  });
};

const getServiceBySlug = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { slug } = req.params;

  const service = await ServiceService.getServiceBySlug(slug as string);

  if (!service) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Service not found",
      data: null,
    });
    return;
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service retrieved successfully",
    data: service,
  });
};

const getServicesByCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { categorySlug } = req.params;

  const services =
    await ServiceService.getServicesByCategory(categorySlug as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Services retrieved successfully",
    data: services,
  });
};

export const ServiceController = {
  createService,
  getAllServices,
  getServiceBySlug,
  getServicesByCategory,
};
