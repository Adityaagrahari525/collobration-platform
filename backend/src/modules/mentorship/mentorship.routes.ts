import { Router } from "express";
import {
  getMentorshipSlots,
  createMentorshipSlot,
  bookMentorshipSlot,
  getMyBookings,
  updateBookingStatus,
} from "./mentorship.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { requirePermission, Permission } from "../../middleware/authorization.middleware";

const router = Router();

// Public / Read
router.get("/slots", getMentorshipSlots);

// Bookings
router.get("/bookings", requireAuth, getMyBookings);
router.patch("/bookings/:id", requireAuth, updateBookingStatus);

// Faculty Slot Creation
router.post(
  "/slots",
  requireAuth,
  requirePermission(Permission.MENTORSHIP_CREATE_SLOT),
  createMentorshipSlot
);

// Student Slot Booking
router.post(
  "/slots/:slotId/book",
  requireAuth,
  requirePermission(Permission.MENTORSHIP_BOOK),
  bookMentorshipSlot
);

export default router;
