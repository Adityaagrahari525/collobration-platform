import { Router } from "express";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "./message.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/conversations", getConversations);
router.get("/conversations/:conversationId", getMessages);
router.post("/send", sendMessage);

export default router;
