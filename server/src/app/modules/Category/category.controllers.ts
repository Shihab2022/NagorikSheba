import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { CategoryServices } from "./category.services";

const createCategory = catchAsync(async (req: any, res: any) => {
  const result = await CategoryServices.createCategoryIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category added successfully!",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: any, res: any) => {
  const result = await CategoryServices.updateCategoryIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully!",
    data: result,
  });
});

const getAllCategories = catchAsync(async (_req: any, res: any) => {
  const result = await CategoryServices.getAllCategoriesFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories retrieved successfully!",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: any, res: any) => {
  const { category_id } = req.params;
  const result = await CategoryServices.deleteCategoryFromDB(category_id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully!",
    data: result,
  });
});

export const CategoryControllers = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
};
