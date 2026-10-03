import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";
import { Role } from "@prisma/client";

export const requireProjectOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id || req.params.projectId;
    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: { code: "MISSING_PARAM", message: "Project ID is required." },
        requestId: req.id,
      });
    }

    if (req.user?.role === Role.ADMIN) {
      return next();
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Project not found." },
        requestId: req.id,
      });
    }

    if (project.ownerId !== req.user?.userId) {
      return res.status(403).json({
        success: false,
        error: { code: "FORBIDDEN_OWNERSHIP", message: "Only the project owner can perform this action." },
        requestId: req.id,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const requireQuestionAuthor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionId = req.params.id;
    if (!questionId) {
      return res.status(400).json({
        success: false,
        error: { code: "MISSING_PARAM", message: "Question ID is required." },
        requestId: req.id,
      });
    }

    if (req.user?.role === Role.ADMIN) {
      return next();
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { authorId: true },
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Question not found." },
        requestId: req.id,
      });
    }

    if (question.authorId !== req.user?.userId) {
      return res.status(403).json({
        success: false,
        error: { code: "FORBIDDEN_OWNERSHIP", message: "Only the author can modify this question." },
        requestId: req.id,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
