import express from "express";
import auth from "../../middlewares/auth";
import { AIcontroller } from "./ai.controller";

const router = express.Router();

router.post("/chat", AIcontroller.aiChatBot);

export const AIRoutes = router;
