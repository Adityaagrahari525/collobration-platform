import { Request, Response, NextFunction } from "express";
import { ProjectService } from "./project.service";
import { createProjectSchema, updateProjectSchema } from "../../validators/project.validator";

export class ProjectController {
  static async getProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, domain, status } = req.query;
      const data = await ProjectService.getProjects(
        search as string,
        domain as string,
        status as string
      );
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getProjectById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await ProjectService.getProjectById(id);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required." });
      }
      const validated = createProjectSchema.parse(req.body);
      const data = await ProjectService.createProject(req.user.userId, validated);
      return res.status(201).json({
        success: true,
        message: "Project workspace created successfully.",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProject(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required." });
      }
      const { id } = req.params;
      const validated = updateProjectSchema.parse(req.body);
      const data = await ProjectService.updateProject(id, req.user.userId, req.user.role, validated);
      return res.status(200).json({
        success: true,
        message: "Project workspace updated successfully.",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required." });
      }
      const { id } = req.params;
      const result = await ProjectService.deleteProject(id, req.user.userId, req.user.role);
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }
}
