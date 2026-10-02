import { z } from "zod";

export const querySkillsSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
});

export type QuerySkillsInput = z.infer<typeof querySkillsSchema>;
