import { Router } from "express";
import { QuestionController } from "./question.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { requirePermission, Permission } from "../../middleware/authorization.middleware";

const router = Router();

// Public / Read
router.get("/", QuestionController.getQuestions);
router.get("/:id", QuestionController.getQuestionById);

// Protected Questions
router.post(
  "/",
  requireAuth,
  requirePermission(Permission.QUESTION_CREATE),
  QuestionController.createQuestion
);
router.patch("/:id", requireAuth, QuestionController.updateQuestion);
router.delete("/:id", requireAuth, QuestionController.deleteQuestion);

// Protected Voting & Bookmarking
router.post(
  "/:id/vote",
  requireAuth,
  requirePermission(Permission.QUESTION_VOTE),
  QuestionController.toggleVoteQuestion
);
router.post("/:id/bookmark", requireAuth, QuestionController.toggleBookmark);

// Protected Answers
router.post(
  "/:id/answers",
  requireAuth,
  requirePermission(Permission.QUESTION_ANSWER),
  QuestionController.createAnswer
);
router.post(
  "/answers/:answerId/vote",
  requireAuth,
  requirePermission(Permission.QUESTION_VOTE),
  QuestionController.toggleVoteAnswer
);
router.patch("/answers/:answerId/accept", requireAuth, QuestionController.acceptAnswer);
router.post(
  "/answers/:answerId/endorse",
  requireAuth,
  requirePermission(Permission.QUESTION_ENDORSE),
  QuestionController.endorseAnswer
);

export default router;
