import prisma from "../../config/database";
import { MentorshipSlotStatus, BookingStatus, NotificationType, Role } from "@prisma/client";
import { AuditService } from "../audit/audit.service";

export class MentorshipService {
  static async getSlots(query?: { mentorId?: string; status?: string }) {
    const where: any = {};
    if (query?.mentorId) where.mentorId = query.mentorId;
    if (query?.status) {
      where.status = query.status as MentorshipSlotStatus;
    } else {
      where.status = MentorshipSlotStatus.AVAILABLE;
    }

    const slots = await prisma.mentorshipSlot.findMany({
      where,
      orderBy: { startAt: "asc" },
      include: {
        mentor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            institution: { select: { name: true, code: true } },
            profile: {
              select: {
                headline: true,
                department: true,
                avatarUrl: true,
                bio: true,
              },
            },
          },
        },
        bookings: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return slots.map((s) => ({
      id: s.id,
      mentorId: s.mentorId,
      mentorName: `${s.mentor.firstName} ${s.mentor.lastName}`,
      mentorDepartment: s.mentor.profile?.department || "Faculty",
      mentorInstitution: s.mentor.institution?.name || "IIT Delhi",
      mentorAvatar: s.mentor.profile?.avatarUrl || null,
      topic: s.topic,
      startAt: s.startAt,
      endAt: s.endAt,
      durationMinutes: s.durationMinutes,
      capacity: s.capacity,
      bookedCount: s.bookings.filter((b) => b.status === BookingStatus.CONFIRMED).length,
      status: s.status,
      meetingLink: s.meetingLink,
      bookings: s.bookings,
    }));
  }

  static async createSlot(params: {
    mentorId: string;
    topic: string;
    startAt: Date;
    endAt: Date;
    durationMinutes?: number;
    capacity?: number;
    meetingLink?: string;
    requestId: string;
  }) {
    const slot = await prisma.mentorshipSlot.create({
      data: {
        mentorId: params.mentorId,
        topic: params.topic,
        startAt: params.startAt,
        endAt: params.endAt,
        durationMinutes: params.durationMinutes || 30,
        capacity: params.capacity || 1,
        meetingLink: params.meetingLink || "https://meet.google.com/campuslink-office-hour",
        status: MentorshipSlotStatus.AVAILABLE,
      },
      include: {
        mentor: {
          include: { profile: true, institution: true },
        },
      },
    });

    await AuditService.log({
      requestId: params.requestId,
      actorId: params.mentorId,
      action: "MENTORSHIP_SLOT_CREATED",
      entityType: "MentorshipSlot",
      entityId: slot.id,
      metadata: { topic: params.topic, startAt: params.startAt },
    });

    return slot;
  }

  static async bookSlot(params: {
    slotId: string;
    studentId: string;
    purpose: string;
    requestId: string;
  }) {
    const slot = await prisma.mentorshipSlot.findUnique({
      where: { id: params.slotId },
      include: {
        mentor: true,
        bookings: { where: { status: BookingStatus.CONFIRMED } },
      },
    });

    if (!slot) {
      throw { statusCode: 404, message: "Mentorship slot not found." };
    }

    if (slot.mentorId === params.studentId) {
      throw { statusCode: 400, message: "Faculty cannot book their own office hour slot." };
    }

    if (slot.status !== MentorshipSlotStatus.AVAILABLE) {
      throw { statusCode: 400, message: "This mentorship slot is no longer available." };
    }

    // Check duplicate
    const existing = await prisma.mentorshipBooking.findUnique({
      where: {
        slotId_studentId: {
          slotId: params.slotId,
          studentId: params.studentId,
        },
      },
    });

    if (existing && existing.status === BookingStatus.CONFIRMED) {
      throw { statusCode: 409, message: "You have already booked this slot." };
    }

    const booking = await prisma.$transaction(async (tx) => {
      const createdBooking = await tx.mentorshipBooking.upsert({
        where: {
          slotId_studentId: {
            slotId: params.slotId,
            studentId: params.studentId,
          },
        },
        update: {
          purpose: params.purpose,
          status: BookingStatus.CONFIRMED,
        },
        create: {
          slotId: params.slotId,
          studentId: params.studentId,
          purpose: params.purpose,
          status: BookingStatus.CONFIRMED,
        },
        include: {
          slot: {
            include: {
              mentor: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          student: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      // If capacity reached, mark slot BOOKED
      const currentConfirmedCount = slot.bookings.length + 1;
      if (currentConfirmedCount >= slot.capacity) {
        await tx.mentorshipSlot.update({
          where: { id: params.slotId },
          data: { status: MentorshipSlotStatus.BOOKED },
        });
      }

      // Notify mentor
      await tx.notification.create({
        data: {
          userId: slot.mentorId,
          type: NotificationType.MENTORSHIP_BOOKED,
          title: "New Mentorship Booking",
          message: `${createdBooking.student.firstName} ${createdBooking.student.lastName} booked your office hour on "${slot.topic}".`,
          link: "/mentorship",
          entityType: "MentorshipBooking",
          entityId: createdBooking.id,
        },
      });

      return createdBooking;
    });

    await AuditService.log({
      requestId: params.requestId,
      actorId: params.studentId,
      action: "MENTORSHIP_BOOKED",
      entityType: "MentorshipBooking",
      entityId: booking.id,
      metadata: { slotId: params.slotId, mentorId: slot.mentorId },
    });

    return booking;
  }

  static async getMyBookings(userId: string, role: Role) {
    if (role === Role.FACULTY) {
      return prisma.mentorshipBooking.findMany({
        where: {
          slot: { mentorId: userId },
        },
        orderBy: { createdAt: "desc" },
        include: {
          slot: true,
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profile: true,
              institution: true,
            },
          },
        },
      });
    }

    return prisma.mentorshipBooking.findMany({
      where: { studentId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        slot: {
          include: {
            mentor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profile: true,
                institution: true,
              },
            },
          },
        },
      },
    });
  }

  static async updateBookingStatus(bookingId: string, status: BookingStatus, actor: { userId: string; role: Role }) {
    const booking = await prisma.mentorshipBooking.findUnique({
      where: { id: bookingId },
      include: { slot: true },
    });

    if (!booking) {
      throw { statusCode: 404, message: "Booking not found." };
    }

    if (
      booking.studentId !== actor.userId &&
      booking.slot.mentorId !== actor.userId &&
      actor.role !== Role.ADMIN
    ) {
      throw { statusCode: 403, message: "Permission denied." };
    }

    const updated = await prisma.$transaction(async (tx) => {
      const b = await tx.mentorshipBooking.update({
        where: { id: bookingId },
        data: { status },
      });

      if (status === BookingStatus.CANCELLED) {
        await tx.mentorshipSlot.update({
          where: { id: booking.slotId },
          data: { status: MentorshipSlotStatus.AVAILABLE },
        });
      }

      return b;
    });

    return updated;
  }
}
