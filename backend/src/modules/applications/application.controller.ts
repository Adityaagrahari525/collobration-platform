import { Request, Response, NextFunction } from "express";
import { ApplicationService } from "./application.service";
import { ApplicationStatus } from "@prisma/client";
import { z } from "zod";

const applySchema = z.object({
  roleId: z.string().uuid("Invalid role ID format"),
  pitch: z.string().min(10, "Pitch must be at least 10 characters").max(2000),
});

const updateStatusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),
});

export const applyToProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = applySchema.parse(req.body);
    const application = await ApplicationService.apply({
      projectId: req.params.projectId,
      roleId: validated.roleId,
      applicantId: req.user!.userId,
      pitch: validated.pitch,
      requestId: req.id!,
    });

    res.status(201).json({
      success: true,
      data: application,
      message: "Application submitted successfully.",
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const applications = await ApplicationService.getProjectApplications(
      req.params.projectId,
      req.user!
    );

    res.status(200).json({
      success: true,
      data: applications,
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = updateStatusSchema.parse(req.body);
    const application = await ApplicationService.updateStatus({
      applicationId: req.params.id,
      status: validated.status,
      actor: req.user!,
      requestId: req.id!,
    });

    res.status(200).json({
      success: true,
      data: application,
      message: `Application marked as ${validated.status}.`,
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const applications = await ApplicationService.getMyApplications(req.user!.userId);
    res.status(200).json({
      success: true,
      data: applications,
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
};
