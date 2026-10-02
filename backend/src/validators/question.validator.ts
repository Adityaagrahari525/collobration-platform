import { z } from "zod";

export const createQuestionSchema = z.object({
  title: z.string().min(5, "Question title must be at least 5 characters long."),
  description: z.string().min(10, "Question description must be at least 10 characters long."),
  department: z.string().optional(),
  subject: z.string().optional(),
  academicYear: z.string().optional(),
  isAnonymous: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
});

export const updateQuestionSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(10).optional(),
  department: z.string().optional(),
  subject: z.string().optional(),
  academicYear: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const createAnswerSchema = z.object({
  content: z.string().min(5, "Answer content must be at least 5 characters long."),
  proofDetails: z.string().optional(),
});

export const updateAnswerSchema = z.object({
  content: z.string().min(5).optional(),
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
export type CreateAnswerInput = z.infer<typeof createAnswerSchema>;
export type UpdateAnswerInput = z.infer<typeof updateAnswerSchema>;
