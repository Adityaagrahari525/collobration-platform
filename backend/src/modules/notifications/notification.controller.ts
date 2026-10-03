import { Request, Response, NextFunction } from "express";
import { NotificationService } from "./notification.service";

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await NotificationService.getNotifications(req.user!.userId);
    res.status(200).json({ success: true, data, requestId: req.id });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await NotificationService.markRead(req.params.id, req.user!.userId);
    res.status(200).json({ success: true, data, requestId: req.id });
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await NotificationService.markAllRead(req.user!.userId);
    res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
};
