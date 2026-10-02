import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(5, "Project title must be at least 5 characters long."),
  description: z.string().min(10, "Project description must be at least 10 characters long."),
  domain: z.string().optional().default("Research & Engineering"),
  sprintPhase: z.string().optional().default("Phase 1: Architecture"),
  status: z.string().optional().default("Recruiting"),
  recruitingRoles: z.array(z.string()).optional().default([]),
  requiredSkills: z.array(z.string()).optional().default([]),
  collaboratingInstitutions: z.array(z.string()).optional().default([]),
});

export const updateProjectSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(10).optional(),
  domain: z.string().optional(),
  sprintPhase: z.string().optional(),
  status: z.string().optional(),
  recruitingRoles: z.array(z.string()).optional(),
  requiredSkills: z.array(z.string()).optional(),
  collaboratingInstitutions: z.array(z.string()).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
