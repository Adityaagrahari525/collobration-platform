import { Request, Response, NextFunction } from "express";
import { QuestionService } from "./question.service";
import {
  createQuestionSchema,
  updateQuestionSchema,
  createAnswerSchema,
  updateAnswerSchema,
} from "../../validators/question.validator";

export class QuestionController {
  static async getQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, department, tag } = req.query;
      const data = await QuestionService.getQuestions(
        search as string,
        department as string,
        tag as string
      );
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getQuestionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await QuestionService.getQuestionById(id);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async createQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required." });
      }
      const validated = createQuestionSchema.parse(req.body);
      const data = await QuestionService.createQuestion(req.user.userId, validated);
      return res.status(201).json({
        success: true,
        message: "Question published successfully.",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required." });
      }
      const { id } = req.params;
      const validated = updateQuestionSchema.parse(req.body);
      const data = await QuestionService.updateQuestion(id, req.user.userId, req.user.role, validated);
      return res.status(200).json({
        success: true,
        message: "Question updated successfully.",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required." });
      }
      const { id } = req.params;
      const result = await QuestionService.deleteQuestion(id, req.user.userId, req.user.role);
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async voteQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await QuestionService.voteQuestion(id);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async createAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required." });
      }
      const { id } = req.params;
      const validated = createAnswerSchema.parse(req.body);
      const data = await QuestionService.createAnswer(id, req.user.userId, validated);
      return res.status(201).json({
        success: true,
        message: "Answer submitted successfully.",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required." });
      }
      const { answerId } = req.params;
      const validated = updateAnswerSchema.parse(req.body);
      const data = await QuestionService.updateAnswer(answerId, req.user.userId, req.user.role, validated);
      return res.status(200).json({
        success: true,
        message: "Answer updated successfully.",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required." });
      }
      const { answerId } = req.params;
      const result = await QuestionService.deleteAnswer(answerId, req.user.userId, req.user.role);
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async acceptAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required." });
      }
      const { answerId } = req.params;
      const data = await QuestionService.acceptAnswer(answerId, req.user.userId);
      return res.status(200).json({
        success: true,
        message: "Answer marked as accepted.",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
