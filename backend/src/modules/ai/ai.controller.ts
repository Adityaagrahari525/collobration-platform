import { Request, Response, NextFunction } from "express";
import { AIService } from "./ai.service";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
});

const skillGapSchema = z.object({
  targetRole: z.string().min(2),
  currentSkills: z.array(z.string()).optional().default([]),
});

export const handleAssistantChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = chatSchema.parse(req.body);
    const data = await AIService.handleChat({
      message: validated.message,
      userId: req.user!.userId,
      requestId: req.id!,
    });
    res.status(200).json({ success: true, data, requestId: req.id });
  } catch (error) {
    next(error);
  }
};

export const handleSkillGapAnalysis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = skillGapSchema.parse(req.body);
    const data = await AIService.analyzeSkillGap({
      targetRole: validated.targetRole,
      currentSkills: validated.currentSkills,
      userId: req.user!.userId,
      requestId: req.id!,
    });
    res.status(200).json({ success: true, data, requestId: req.id });
  } catch (error) {
    next(error);
  }
};
