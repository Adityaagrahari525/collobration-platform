import { Request, Response, NextFunction } from "express";
import { AuditService } from "./audit.service";

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, actorId, action } = req.query;
    const data = await AuditService.getLogs({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      actorId: actorId as string,
      action: action as string,
    });
    res.status(200).json({ success: true, ...data, requestId: req.id });
  } catch (error) {
    next(error);
  }
};
