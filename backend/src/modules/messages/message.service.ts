import prisma from "../../config/database";
import { NotificationType } from "@prisma/client";

export class MessageService {
  static async getConversations(userId: string) {
    const memberships = await prisma.conversationMember.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    profile: { select: { avatarUrl: true, department: true } },
                    institution: { select: { name: true } },
                  },
                },
              },
            },
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
      orderBy: { conversation: { updatedAt: "desc" } },
    });

    return memberships.map((m) => {
      const otherMembers = m.conversation.members.filter((cm) => cm.userId !== userId);
      const otherUser = otherMembers[0]?.user;
      const lastMessage = m.conversation.messages[0];

      return {
        id: m.conversation.id,
        conversationId: m.conversation.id,
        title: m.conversation.title || (otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Direct Message"),
        avatar: otherUser?.profile?.avatarUrl,
        otherUser: otherUser
          ? {
              id: otherUser.id,
              name: `${otherUser.firstName} ${otherUser.lastName}`,
              email: otherUser.email,
              avatar: otherUser.profile?.avatarUrl,
              department: otherUser.profile?.department,
              institution: otherUser.institution?.name,
            }
          : null,
        lastMessage: lastMessage ? lastMessage.text : "No messages yet",
        lastMessageAt: lastMessage ? lastMessage.createdAt : m.conversation.createdAt,
        unread: lastMessage ? (!lastMessage.isRead && lastMessage.senderId !== userId) : false,
      };
    });
  }

  static async getMessages(conversationId: string, userId: string) {
    // Verify membership
    const membership = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: { conversationId, userId },
      },
    });

    if (!membership) {
      throw { statusCode: 403, message: "Not a member of this conversation." };
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profile: { select: { avatarUrl: true } },
          },
        },
      },
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return messages.map((msg) => ({
      id: msg.id,
      conversationId: msg.conversationId,
      senderId: msg.senderId,
      senderName: `${msg.sender.firstName} ${msg.sender.lastName}`,
      senderAvatar: msg.sender.profile?.avatarUrl,
      text: msg.text,
      isSelf: msg.senderId === userId,
      createdAt: msg.createdAt,
    }));
  }

  static async sendMessage(params: {
    senderId: string;
    receiverId?: string;
    conversationId?: string;
    text: string;
  }) {
    let convId = params.conversationId;

    if (!convId) {
      if (!params.receiverId) {
        throw { statusCode: 400, message: "Receiver ID or Conversation ID required." };
      }

      // Check if 1:1 conversation already exists
      const existingMemberships = await prisma.conversationMember.findMany({
        where: { userId: params.senderId },
        include: {
          conversation: {
            include: { members: true },
          },
        },
      });

      const existingConv = existingMemberships.find(
        (m) =>
          !m.conversation.isGroup &&
          m.conversation.members.some((cm) => cm.userId === params.receiverId)
      );

      if (existingConv) {
        convId = existingConv.conversationId;
      } else {
        // Create new conversation
        const newConv = await prisma.conversation.create({
          data: {
            isGroup: false,
            members: {
              create: [
                { userId: params.senderId },
                { userId: params.receiverId },
              ],
            },
          },
        });
        convId = newConv.id;
      }
    }

    const message = await prisma.message.create({
      data: {
        conversationId: convId,
        senderId: params.senderId,
        receiverId: params.receiverId || null,
        text: params.text,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profile: { select: { avatarUrl: true } },
          },
        },
      },
    });

    // Touch conversation updated_at
    await prisma.conversation.update({
      where: { id: convId },
      data: { updatedAt: new Date() },
    });

    // Notify receiver
    if (params.receiverId) {
      await prisma.notification.create({
        data: {
          userId: params.receiverId,
          type: NotificationType.NEW_MESSAGE,
          title: "New Collaboration Message",
          message: `${message.sender.firstName}: "${params.text.slice(0, 50)}..."`,
          link: "/messages",
          entityType: "Message",
          entityId: message.id,
        },
      });
    }

    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderName: `${message.sender.firstName} ${message.sender.lastName}`,
      senderAvatar: message.sender.profile?.avatarUrl,
      text: message.text,
      isSelf: true,
      createdAt: message.createdAt,
    };
  }
}
