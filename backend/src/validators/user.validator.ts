import { z } from "zod";
import { Proficiency, CollaborationMode, Role } from "@prisma/client";

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name cannot be empty").optional(),
  lastName: z.string().min(1, "Last name cannot be empty").optional(),
  headline: z.string().max(160, "Headline cannot exceed 160 characters").optional(),
  department: z.string().max(120, "Department name too long").optional(),
  academicYear: z.string().max(60, "Academic year representation too long").optional(),
  bio: z.string().max(1000, "Bio cannot exceed 1000 characters").optional(),
  avatarUrl: z.string().url("Invalid avatar URL").or(z.string().length(0)).optional(),
  availability: z.string().max(100, "Availability description too long").optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  preferredCollaborationMode: z.nativeEnum(CollaborationMode).optional(),
});

export const addUserSkillSchema = z.object({
  skillId: z.string().uuid("Invalid skill ID"),
  proficiency: z.nativeEnum(Proficiency).default(Proficiency.INTERMEDIATE),
});

export const queryUsersSchema = z.object({
  search: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  institutionId: z.string().uuid("Invalid institution ID").optional(),
  department: z.string().optional(),
  academicYear: z.string().optional(),
  skillId: z.string().uuid("Invalid skill ID").optional(),
  availability: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddUserSkillInput = z.infer<typeof addUserSkillSchema>;
export type QueryUsersInput = z.infer<typeof queryUsersSchema>;
