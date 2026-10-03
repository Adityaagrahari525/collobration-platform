import { Request, Response, NextFunction } from "express";
import { MessageService } from "./message.service";
import { z } from "zod";

const sendMessageSchema = z.object({
  receiverId: z.string().uuid().optional(),
  conversationId: z.string().uuid().optional(),
  text: z.string().min(1, "Message cannot be empty").max(4000),
});

export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await MessageService.getConversations(req.user!.userId);
    res.status(200).json({ success: true, data, requestId: req.id });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await MessageService.getMessages(req.params.conversationId, req.user!.userId);
    res.status(200).json({ success: true, data, requestId: req.id });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = sendMessageSchema.parse(req.body);
    const data = await MessageService.sendMessage({
      senderId: req.user!.userId,
      receiverId: validated.receiverId,
      conversationId: validated.conversationId,
      text: validated.text,
    });
    res.status(201).json({ success: true, data, requestId: req.id });
  } catch (error) {
    next(error);
  }
};
