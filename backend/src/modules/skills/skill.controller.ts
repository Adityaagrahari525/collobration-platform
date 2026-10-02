import { Request, Response, NextFunction } from "express";
import { SkillService } from "./skill.service";
import { querySkillsSchema } from "../../validators/skill.validator";

export class SkillController {
  static async getSkills(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = querySkillsSchema.parse(req.query);
      const data = await SkillService.getSkills(validatedQuery);
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
