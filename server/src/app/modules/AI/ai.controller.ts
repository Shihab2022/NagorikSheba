import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { AIservice } from "./ai.service";
import z from "zod";

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
  };
};

const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  conversationId: z.string().uuid(),
});

const aiChatBot = catchAsync(
  async (req: Request, res: Response) => {
    const parsed = chatRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message:
          "Message must contain 1–2000 characters and conversationId must be a valid UUID.",
      });
    }

    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized!",
      );
    }

    const result = await AIservice.aiChatBot(
      parsed.data.message,
      parsed.data.conversationId,
      userId,
    );

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Chatbot response generated successfully.",
      data: result,
    });
  },
);

export const AIcontroller = { aiChatBot };