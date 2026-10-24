import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { pool } from "../../../utils/pg";
import { aiGraph } from "./ai.graph";
import { HumanMessage } from "@langchain/core/messages";

const aiChatBot = async (
  message: string,
  conversationId: string,
  userId: string,
): Promise<{ answer: string; conversationId: string }> => {
  const normalizedMessage = message.trim();

  const cleanTitle = normalizedMessage.replace(/\s+/g, " ");
  const generatedTitle =
    cleanTitle.length > 60
      ? `${cleanTitle.slice(0, 57)}...`
      : cleanTitle;

  // Verify ownership and persist the user message atomically.
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const conversation = await client.query(
      `SELECT id, title
       FROM ai_conversations
       WHERE id = $1 AND user_id = $2
       FOR UPDATE`,
      [conversationId, userId],
    );

    if (conversation.rows.length === 0) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Conversation not found.",
      );
    }

    await client.query(
      `INSERT INTO ai_messages
         (conversation_id, role, content)
       VALUES ($1, 'user', $2)`,
      [conversationId, normalizedMessage],
    );

    await client.query(
      `UPDATE ai_conversations
       SET title = CASE
             WHEN title = 'New chat' THEN $3
             ELSE title
           END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2`,
      [conversationId, userId, generatedTitle],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }

  // The conversation ID is also the LangGraph thread ID.
  const result = await aiGraph.invoke(
    {
      messages: [new HumanMessage(normalizedMessage)],
    },
    {
      configurable: {
        thread_id: conversationId,
      },
      recursionLimit: 8,
    },
  );

  const lastMessage = result.messages.at(-1);

  if (!lastMessage || typeof lastMessage.content !== "string") {
    throw new Error("AI returned an invalid response.");
  }

  const answer = lastMessage.content;

  await pool.query(
    `INSERT INTO ai_messages
       (conversation_id, role, content)
     VALUES ($1, 'assistant', $2)`,
    [conversationId, answer],
  );

  await pool.query(
    `UPDATE ai_conversations
     SET updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND user_id = $2`,
    [conversationId, userId],
  );

  return {
    answer,
    conversationId,
  };
};

export const AIservice = { aiChatBot };