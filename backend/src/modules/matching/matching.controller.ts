import { Request, Response, NextFunction } from "express";
import { MatchingService } from "./matching.service";

export const getRecommendedProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await MatchingService.getRecommendedProjects(req.user!.userId);
    res.status(200).json({ success: true, data, requestId: req.id });
  } catch (error) {
    next(error);
  }
};

export const getRecommendedPeers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await MatchingService.getRecommendedPeers(req.user!.userId);
    res.status(200).json({ success: true, data, requestId: req.id });
  } catch (error) {
    next(error);
  }
};

export const getProjectCandidates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await MatchingService.getProjectCandidates(req.params.id);
    res.status(200).json({ success: true, data, requestId: req.id });
  } catch (error) {
    next(error);
  }
};
