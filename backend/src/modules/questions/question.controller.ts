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
        tag as string,
        req.user?.userId
      );
      return res.status(200).json({ success: true, data, requestId: req.id });
    } catch (error) {
      next(error);
    }
  }

  static async getQuestionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await QuestionService.getQuestionById(id, req.user?.userId);
      return res.status(200).json({ success: true, data, requestId: req.id });
    } catch (error) {
      next(error);
    }
  }

  static async createQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createQuestionSchema.parse(req.body);
      const data = await QuestionService.createQuestion(req.user!.userId, validated);
      return res.status(201).json({
        success: true,
        message: "Question published successfully.",
        data,
        requestId: req.id,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = updateQuestionSchema.parse(req.body);
      const data = await QuestionService.updateQuestion(id, req.user!.userId, req.user!.role, validated);
      return res.status(200).json({
        success: true,
        message: "Question updated successfully.",
        data,
        requestId: req.id,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await QuestionService.deleteQuestion(id, req.user!.userId, req.user!.role);
      return res.status(200).json({ success: true, ...result, requestId: req.id });
    } catch (error) {
      next(error);
    }
  }

  static async toggleVoteQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await QuestionService.toggleVoteQuestion(id, req.user!.userId);
      return res.status(200).json({ success: true, data, requestId: req.id });
    } catch (error) {
      next(error);
    }
  }

  static async toggleBookmark(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await QuestionService.toggleBookmark(id, req.user!.userId);
      return res.status(200).json({ success: true, data, requestId: req.id });
    } catch (error) {
      next(error);
    }
  }

  static async createAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = createAnswerSchema.parse(req.body);
      const data = await QuestionService.createAnswer(id, req.user!.userId, validated);
      return res.status(201).json({
        success: true,
        message: "Answer submitted successfully.",
        data,
        requestId: req.id,
      });
    } catch (error) {
      next(error);
    }
  }

  static async toggleVoteAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const { answerId } = req.params;
      const data = await QuestionService.toggleVoteAnswer(answerId, req.user!.userId);
      return res.status(200).json({ success: true, data, requestId: req.id });
    } catch (error) {
      next(error);
    }
  }

  static async acceptAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const { answerId } = req.params;
      const data = await QuestionService.acceptAnswer(answerId, req.user!.userId);
      return res.status(200).json({
        success: true,
        message: "Answer accepted status updated.",
        data,
        requestId: req.id,
      });
    } catch (error) {
      next(error);
    }
  }

  static async endorseAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const { answerId } = req.params;
      const data = await QuestionService.endorseAnswer(answerId, req.user!.userId, req.id!);
      return res.status(200).json({
        success: true,
        message: "Answer endorsed by faculty.",
        data,
        requestId: req.id,
      });
    } catch (error) {
      next(error);
    }
  }
}
