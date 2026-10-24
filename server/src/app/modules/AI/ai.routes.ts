import express from "express";
import auth from "../../middlewares/auth";
import { AIcontroller } from "./ai.controller";
import { AIConversationController } from "./ai.conversation.controller";

const router = express.Router();

// Every conversation-management endpoint requires authentication.
router.post(
  "/conversations",
  auth(),
  AIConversationController.createConversation,
);

router.get(
  "/conversations",
  auth(),
  AIConversationController.listConversations,
);

router.get(
  "/conversations/:conversationId/messages",
  auth(),
  AIConversationController.getConversationMessages,
);

router.patch(
  "/conversations/:conversationId",
  auth(),
  AIConversationController.renameConversation,
);

router.delete(
  "/conversations/:conversationId",
  auth(),
  AIConversationController.deleteConversation,
);

router.post("/chat", auth(), AIcontroller.aiChatBot);

export const AIRoutes = router;
