import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { pool } from "../../../utils/pg";
import { deleteAIThread } from "./ai.graph";

const assertConversationOwnership = async (
  conversationId: string,
  userId: string,
) => {
  const result = await pool.query(
    `SELECT id
     FROM ai_conversations
     WHERE id = $1 AND user_id = $2
     LIMIT 1`,
    [conversationId, userId],
  );

  if (result.rows.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Conversation not found.",
    );
  }
};

const createConversation = async (userId: string) => {
  const result = await pool.query(
    `INSERT INTO ai_conversations (user_id)
     VALUES ($1)
     RETURNING
       id,
       title,
       created_at AS "createdAt",
       updated_at AS "updatedAt"`,
    [userId],
  );

  return result.rows[0];
};

const listConversations = async (userId: string) => {
  const result = await pool.query(
    `SELECT
       id,
       title,
       created_at AS "createdAt",
       updated_at AS "updatedAt"
     FROM ai_conversations
     WHERE user_id = $1
     ORDER BY updated_at DESC, created_at DESC`,
    [userId],
  );

  return result.rows;
};

const getConversationMessages = async (
  conversationId: string,
  userId: string,
) => {
  await assertConversationOwnership(conversationId, userId);

  const result = await pool.query(
    `SELECT
       id,
       role,
       content,
       created_at AS "createdAt"
     FROM ai_messages
     WHERE conversation_id = $1
     ORDER BY created_at ASC, id ASC`,
    [conversationId],
  );

  return {
    conversationId,
    messages: result.rows,
  };
};

const renameConversation = async (
  conversationId: string,
  userId: string,
  title: string,
) => {
  const result = await pool.query(
    `UPDATE ai_conversations
     SET title = $3,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND user_id = $2
     RETURNING
       id,
       title,
       created_at AS "createdAt",
       updated_at AS "updatedAt"`,
    [conversationId, userId, title],
  );

  if (result.rows.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Conversation not found.",
    );
  }

  return result.rows[0];
};

const deleteConversation = async (
  conversationId: string,
  userId: string,
) => {
  const result = await pool.query(
    `DELETE FROM ai_conversations
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [conversationId, userId],
  );

  if (result.rows.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Conversation not found.",
    );
  }

  try {
    await deleteAIThread(conversationId);
  } catch (error) {
    console.error(
      "Conversation deleted, but checkpoint cleanup failed:",
      error,
    );
  }

  return { id: conversationId };
};

export const AIConversationService = {
  createConversation,
  listConversations,
  getConversationMessages,
  renameConversation,
  deleteConversation,
};