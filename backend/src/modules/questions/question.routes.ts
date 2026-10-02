import { Router } from "express";
import { QuestionController } from "./question.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

// Public / Read Question Routes
router.get("/", QuestionController.getQuestions);
router.get("/:id", QuestionController.getQuestionById);
router.post("/:id/vote", QuestionController.voteQuestion);

// Protected Question CRUD Routes
router.post("/", requireAuth, QuestionController.createQuestion);
router.patch("/:id", requireAuth, QuestionController.updateQuestion);
router.delete("/:id", requireAuth, QuestionController.deleteQuestion);

// Protected Answer Routes
router.post("/:id/answers", requireAuth, QuestionController.createAnswer);
router.patch("/answers/:answerId", requireAuth, QuestionController.updateAnswer);
router.delete("/answers/:answerId", requireAuth, QuestionController.deleteAnswer);
router.patch("/answers/:answerId/accept", requireAuth, QuestionController.acceptAnswer);

export default router;
