import { Request, Response, NextFunction } from "express";
import { InstitutionService } from "./institution.service";

export class InstitutionController {
  static async listInstitutions(req: Request, res: Response, next: NextFunction) {
    try {
      const search = typeof req.query.search === "string" ? req.query.search : undefined;
      const data = await InstitutionService.getAllInstitutions(search);
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getInstitutionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await InstitutionService.getInstitutionById(id);
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
