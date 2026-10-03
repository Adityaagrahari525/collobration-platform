import prisma from "../../config/database";

export class CommunityService {
  static async getCommunities(search?: string, category?: string, currentUserId?: string) {
    const where: any = {};
    if (category) {
      where.category = { contains: category, mode: "insensitive" };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const communities = await prisma.community.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        institution: true,
        members: {
          select: { userId: true, role: true },
        },
      },
    });

    return communities.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      category: c.category || "Academic Research",
      institution: c.institution?.name || "Inter-Campus",
      institutionId: c.institutionId,
      memberCount: c.members.length,
      avatarUrl: c.avatarUrl,
      isMember: currentUserId ? c.members.some((m) => m.userId === currentUserId) : false,
      createdAt: c.createdAt,
    }));
  }

  static async getCommunityById(id: string, currentUserId?: string) {
    const c = await prisma.community.findUnique({
      where: { id },
      include: {
        institution: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                institution: { select: { name: true } },
                profile: { select: { avatarUrl: true, department: true } },
              },
            },
          },
        },
      },
    });

    if (!c) {
      throw { statusCode: 404, message: "Community not found." };
    }

    return {
      id: c.id,
      name: c.name,
      description: c.description,
      category: c.category,
      institution: c.institution?.name || "Inter-Campus",
      institutionId: c.institutionId,
      memberCount: c.members.length,
      avatarUrl: c.avatarUrl,
      isMember: currentUserId ? c.members.some((m) => m.userId === currentUserId) : false,
      members: c.members.map((m) => ({
        id: m.id,
        userId: m.userId,
        name: `${m.user.firstName} ${m.user.lastName}`,
        role: m.role,
        department: m.user.profile?.department,
        institution: m.user.institution?.name,
        avatar: m.user.profile?.avatarUrl,
        joinedAt: m.joinedAt,
      })),
      createdAt: c.createdAt,
    };
  }

  static async createCommunity(params: {
    name: string;
    description: string;
    category?: string;
    userId: string;
    institutionId?: string;
  }) {
    return prisma.community.create({
      data: {
        name: params.name,
        description: params.description,
        category: params.category || "General",
        institutionId: params.institutionId || null,
        members: {
          create: [
            {
              userId: params.userId,
              role: "OWNER",
            },
          ],
        },
      },
    });
  }

  static async joinCommunity(communityId: string, userId: string) {
    const community = await prisma.community.findUnique({ where: { id: communityId } });
    if (!community) {
      throw { statusCode: 404, message: "Community not found." };
    }

    return prisma.communityMember.upsert({
      where: {
        communityId_userId: { communityId, userId },
      },
      update: {},
      create: {
        communityId,
        userId,
        role: "MEMBER",
      },
    });
  }

  static async leaveCommunity(communityId: string, userId: string) {
    const existing = await prisma.communityMember.findUnique({
      where: {
        communityId_userId: { communityId, userId },
      },
    });

    if (!existing) {
      throw { statusCode: 404, message: "Membership not found." };
    }

    await prisma.communityMember.delete({
      where: { id: existing.id },
    });

    return { message: "Successfully left community." };
  }
}
