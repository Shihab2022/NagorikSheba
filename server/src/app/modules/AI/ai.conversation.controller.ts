import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { AIConversationService } from "./ai.conversation.service";
import z from "zod";

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
  };
};

const getUserId = (req: Request): string => {
  const userId = (req as AuthenticatedRequest).user?.id;

  if (!userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized!",
    );
  }

  return userId;
};

const getConversationId = (req: Request): string => {
  const parsed = z.string().uuid().safeParse(
    req.params.conversationId,
  );

  if (!parsed.success) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid conversation ID.",
    );
  }

  return parsed.data;
};

const createConversation = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AIConversationService.createConversation(
      getUserId(req),
    );

    return sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Conversation created successfully.",
      data: result,
    });
  },
);

const listConversations = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AIConversationService.listConversations(
      getUserId(req),
    );

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Conversations retrieved successfully.",
      data: result,
    });
  },
);

const getConversationMessages = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await AIConversationService.getConversationMessages(
        getConversationId(req),
        getUserId(req),
      );

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Messages retrieved successfully.",
      data: result,
    });
  },
);

const renameConversation = catchAsync(
  async (req: Request, res: Response) => {
    const parsed = z.object({
      title: z.string().trim().min(1).max(120),
    }).safeParse(req.body);

    if (!parsed.success) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Title must contain 1–120 characters.",
      });
    }

    const result = await AIConversationService.renameConversation(
      getConversationId(req),
      getUserId(req),
      parsed.data.title,
    );

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Conversation renamed successfully.",
      data: result,
    });
  },
);

const deleteConversation = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AIConversationService.deleteConversation(
      getConversationId(req),
      getUserId(req),
    );

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Conversation deleted successfully.",
      data: result,
    });
  },
);

export const AIConversationController = {
  createConversation,
  listConversations,
  getConversationMessages,
  renameConversation,
  deleteConversation,
};