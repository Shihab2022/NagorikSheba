import { Request, Response } from "express";
import { aiGraph } from "./ai.graph";
import { HumanMessage } from "@langchain/core/messages";

const aiChatBot = async (
  message: string,
  sessionId: string,
): Promise<{ answer: string }> => {
  const result = await aiGraph.invoke(
    {
      messages: [new HumanMessage(message)],
    },
    {
      configurable: {
        thread_id: sessionId,
      },
      recursionLimit: 8,
    },
  );

  const lastMessage = result.messages.at(-1);

  if (!lastMessage || typeof lastMessage.content !== "string") {
    throw new Error("AI returned an invalid response.");
  }

  return {
    answer: lastMessage.content,
  };
};

export const AIservice = { aiChatBot };
