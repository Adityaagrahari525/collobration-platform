import { Router } from "express";
import { handleAssistantChat, handleSkillGapAnalysis } from "./ai.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { rateLimiter } from "../../middleware/rateLimit.middleware";

const router = Router();

router.use(requireAuth);

// Rate limit AI chat to 20 calls per 5 minutes per user/IP
router.post(
  "/chat",
  rateLimiter({ windowMs: 5 * 60 * 1000, max: 20, message: "AI Assistant rate limit reached. Please wait a few moments." }),
  handleAssistantChat
);

router.post("/skill-gap", handleSkillGapAnalysis);

export default router;
