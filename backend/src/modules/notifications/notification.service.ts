import prisma from "../../config/database";

export class NotificationService {
  static async getNotifications(userId: string) {
    const [unreadCount, notifications] = await Promise.all([
      prisma.notification.count({
        where: { userId, isRead: false },
      }),
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    return {
      unreadCount,
      notifications: notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        link: n.link,
        entityType: n.entityType,
        entityId: n.entityId,
        read: n.isRead,
        isRead: n.isRead,
        createdAt: n.createdAt,
      })),
    };
  }

  static async markRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw { statusCode: 404, message: "Notification not found." };
    }

    if (notification.userId !== userId) {
      throw { statusCode: 403, message: "Permission denied." };
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  static async markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }
}
