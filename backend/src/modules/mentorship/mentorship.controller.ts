import { Request, Response, NextFunction } from "express";
import { MentorshipService } from "./mentorship.service";
import { z } from "zod";
import { BookingStatus } from "@prisma/client";

const createSlotSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters"),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  durationMinutes: z.number().int().positive().optional().default(30),
  capacity: z.number().int().positive().optional().default(1),
  meetingLink: z.string().url().optional(),
});

const bookSlotSchema = z.object({
  purpose: z.string().min(5, "Purpose must be at least 5 characters"),
});

export const getMentorshipSlots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mentorId, status } = req.query;
    const slots = await MentorshipService.getSlots({
      mentorId: mentorId as string,
      status: status as string,
    });
    res.status(200).json({ success: true, data: slots, requestId: req.id });
  } catch (error) {
    next(error);
  }
};

export const createMentorshipSlot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createSlotSchema.parse(req.body);
    const slot = await MentorshipService.createSlot({
      mentorId: req.user!.userId,
      topic: validated.topic,
      startAt: new Date(validated.startAt),
      endAt: new Date(validated.endAt),
      durationMinutes: validated.durationMinutes,
      capacity: validated.capacity,
      meetingLink: validated.meetingLink,
      requestId: req.id!,
    });
    res.status(201).json({
      success: true,
      message: "Office hour slot created successfully.",
      data: slot,
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
};

export const bookMentorshipSlot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = bookSlotSchema.parse(req.body);
    const booking = await MentorshipService.bookSlot({
      slotId: req.params.slotId,
      studentId: req.user!.userId,
      purpose: validated.purpose,
      requestId: req.id!,
    });
    res.status(201).json({
      success: true,
      message: "Mentorship slot booked successfully!",
      data: booking,
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await MentorshipService.getMyBookings(req.user!.userId, req.user!.role);
    res.status(200).json({ success: true, data: bookings, requestId: req.id });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const updated = await MentorshipService.updateBookingStatus(
      req.params.id,
      status as BookingStatus,
      req.user!
    );
    res.status(200).json({ success: true, data: updated, requestId: req.id });
  } catch (error) {
    next(error);
  }
};
