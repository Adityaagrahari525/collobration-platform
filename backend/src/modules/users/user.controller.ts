import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { updateProfileSchema, addUserSkillSchema, queryUsersSchema } from "../../validators/user.validator";

export class UserController {
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required." });
      }
      const data = await UserService.getCurrentUser(req.user.userId);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required." });
      }
      const validated = updateProfileSchema.parse(req.body);
      const data = await UserService.updateProfile(req.user.userId, validated);
      return res.status(200).json({
        success: true,
        message: "Academic profile updated successfully.",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteMyAccount(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required." });
      }
      const result = await UserService.deleteUser(req.user.userId);
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUserById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required." });
      }
      const { id } = req.params;
      // Allow self-deletion or admin deletion
      if (req.user.userId !== id && req.user.role !== "ADMIN") {
        return res.status(403).json({ success: false, message: "Permission denied." });
      }
      const result = await UserService.deleteUser(id);
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async getMySkills(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required." });
      }
      const data = await UserService.getUserSkills(req.user.userId);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async addMySkill(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required." });
      }
      const validated = addUserSkillSchema.parse(req.body);
      const data = await UserService.addUserSkill(req.user.userId, validated);
      return res.status(201).json({
        success: true,
        message: "Skill added to academic profile.",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeMySkill(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required." });
      }
      const { skillId } = req.params;
      const data = await UserService.removeUserSkill(req.user.userId, skillId);
      return res.status(200).json({ success: true, ...data });
    } catch (error) {
      next(error);
    }
  }

  static async getPeople(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = queryUsersSchema.parse(req.query);
      const result = await UserService.getPeopleDirectory(validatedQuery);
      return res.status(200).json({
        success: true,
        data: result.items,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPersonById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await UserService.getPublicUserById(id);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
