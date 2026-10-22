import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { AIservice } from "./ai.service";
import z from "zod";

const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  sessionId: z.string().uuid(),
});

const aiChatBot = catchAsync(async (req: Request, res: Response) => {
  const parsed = chatRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Message must contain 1–2000 characters.",
    });
  }

  const result = await AIservice.aiChatBot(
    parsed.data.message,
    parsed.data.sessionId,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Chatbot response generated successfully.",
    data: result,
  });
});

export const AIcontroller = { aiChatBot };
