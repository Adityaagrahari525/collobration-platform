import { Request, Response, NextFunction } from "express";
import { CommunityService } from "./community.service";
import { z } from "zod";

const createCommunitySchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  category: z.string().optional(),
});

export const getCommunities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, category } = req.query;
    const data = await CommunityService.getCommunities(
      search as string,
      category as string,
      req.user?.userId
    );
    res.status(200).json({ success: true, data, requestId: req.id });
  } catch (error) {
    next(error);
  }
};

export const getCommunityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await CommunityService.getCommunityById(req.params.id, req.user?.userId);
    res.status(200).json({ success: true, data, requestId: req.id });
  } catch (error) {
    next(error);
  }
};

export const createCommunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createCommunitySchema.parse(req.body);
    const data = await CommunityService.createCommunity({
      ...validated,
      userId: req.user!.userId,
      institutionId: req.user!.institutionId,
    });
    res.status(201).json({
      success: true,
      message: "Community created successfully.",
      data,
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
};

export const joinCommunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await CommunityService.joinCommunity(req.params.id, req.user!.userId);
    res.status(200).json({
      success: true,
      message: "Joined community successfully.",
      data,
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
};

export const leaveCommunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await CommunityService.leaveCommunity(req.params.id, req.user!.userId);
    res.status(200).json({ success: true, ...data, requestId: req.id });
  } catch (error) {
    next(error);
  }
};
