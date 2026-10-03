import prisma from "../../config/database";
import { UpdateProfileInput, AddUserSkillInput, QueryUsersInput } from "../../validators/user.validator";

export class UserService {
  // Calculate profile completeness score (0 - 100)
  private static calculateProfileCompletion(user: any): number {
    let score = 0;
    if (user.firstName && user.lastName) score += 20;
    if (user.institution) score += 20;
    if (user.profile?.department) score += 20;
    if (user.profile?.academicYear) score += 20;
    if (user.userSkills && user.userSkills.length > 0) score += 20;
    return score;
  }

  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        institution: true,
        profile: true,
        userSkills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!user) {
      const error: any = new Error("User profile record not found.");
      error.statusCode = 404;
      throw error;
    }

    const completionScore = this.calculateProfileCompletion(user);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      institution: {
        id: user.institution.id,
        name: user.institution.name,
        emailDomain: user.institution.emailDomain,
        city: user.institution.city,
        state: user.institution.state,
        country: user.institution.country,
        isVerified: user.institution.isVerified,
      },
      profile: {
        headline: user.profile?.headline || `${user.role} at ${user.institution.name}`,
        department: user.profile?.department || "",
        academicYear: user.profile?.academicYear || "",
        bio: user.profile?.bio || "",
        avatarUrl: user.profile?.avatarUrl || "",
        availability: user.profile?.availability || "Open to academic collaborations",
        city: user.profile?.city || user.institution.city,
        state: user.profile?.state || user.institution.state,
        preferredCollaborationMode: user.profile?.preferredCollaborationMode || "HYBRID",
        isProfileComplete: user.profile?.isProfileComplete || completionScore >= 80,
        profileCompletion: completionScore,
      },
      skills: user.userSkills.map((us: any) => ({
        id: us.skill.id,
        name: us.skill.name,
        category: us.skill.category || "General",
        proficiency: us.proficiency,
      })),
    };
  }

  static async updateProfile(userId: string, input: UpdateProfileInput) {
    const { firstName, lastName, ...profileFields } = input;

    if (firstName || lastName) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
        },
      });
    }

    await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...profileFields,
      },
      update: {
        ...profileFields,
      },
    });

    return this.getCurrentUser(userId);
  }

  static async getUserSkills(userId: string) {
    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
    });

    return userSkills.map((us) => ({
      id: us.skill.id,
      name: us.skill.name,
      category: us.skill.category || "General",
      proficiency: us.proficiency,
    }));
  }

  static async addUserSkill(userId: string, input: AddUserSkillInput) {
    await prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId,
          skillId: input.skillId,
        },
      },
      create: {
        userId,
        skillId: input.skillId,
        proficiency: input.proficiency || "INTERMEDIATE",
      },
      update: {
        proficiency: input.proficiency || "INTERMEDIATE",
      },
    });

    return this.getCurrentUser(userId);
  }

  static async removeUserSkill(userId: string, skillId: string) {
    const existing = await prisma.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
    });

    if (!existing) {
      const error: any = new Error("Skill not associated with user profile.");
      error.statusCode = 404;
      throw error;
    }

    await prisma.userSkill.delete({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
    });

    return { message: "Skill removed from user profile." };
  }

  static async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw { statusCode: 404, message: "User not found." };
    }

    await prisma.user.delete({ where: { id: userId } });
    return { message: "User account deleted successfully." };
  }

  static async getPeopleDirectory(query: QueryUsersInput) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (query.role) {
      where.role = query.role;
    }

    if (query.institutionId) {
      where.institutionId = query.institutionId;
    }

    if (query.department) {
      where.profile = {
        department: { contains: query.department, mode: "insensitive" },
      };
    }

    if (query.academicYear) {
      where.profile = {
        ...where.profile,
        academicYear: { contains: query.academicYear, mode: "insensitive" },
      };
    }

    if (query.skillId) {
      where.userSkills = {
        some: {
          skillId: query.skillId,
        },
      };
    }

    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: "insensitive" } },
        { lastName: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
        { profile: { headline: { contains: query.search, mode: "insensitive" } } },
        { profile: { department: { contains: query.search, mode: "insensitive" } } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          institution: true,
          profile: true,
          userSkills: {
            include: { skill: true },
          },
        },
      }),
    ]);

    const items = users.map((u: any) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      name: `${u.firstName} ${u.lastName}`,
      role: u.role,
      isEmailVerified: u.isEmailVerified,
      institution: u.institution.name,
      institutionDetail: {
        id: u.institution.id,
        name: u.institution.name,
        city: u.institution.city,
        state: u.institution.state,
      },
      department: u.profile?.department || "",
      academicYear: u.profile?.academicYear || "",
      headline: u.profile?.headline || `${u.role} at ${u.institution.name}`,
      bio: u.profile?.bio || "",
      avatarUrl: u.profile?.avatarUrl || "",
      availability: u.profile?.availability || "Available for collaboration",
      preferredCollaborationMode: u.profile?.preferredCollaborationMode || "HYBRID",
      skills: u.userSkills.map((us: any) => us.skill.name),
      skillsDetail: u.userSkills.map((us: any) => ({
        id: us.skill.id,
        name: us.skill.name,
        proficiency: us.proficiency,
      })),
    }));

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getPublicUserById(userId: string) {
    const u = await prisma.user.findUnique({
      where: { id: userId, isActive: true },
      include: {
        institution: true,
        profile: true,
        userSkills: {
          include: { skill: true },
        },
      },
    });

    if (!u) {
      const error: any = new Error("Academic directory user not found.");
      error.statusCode = 404;
      throw error;
    }

    return {
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      name: `${u.firstName} ${u.lastName}`,
      role: u.role,
      isEmailVerified: u.isEmailVerified,
      institution: u.institution.name,
      institutionDetail: {
        id: u.institution.id,
        name: u.institution.name,
        city: u.institution.city,
        state: u.institution.state,
        country: u.institution.country,
      },
      department: u.profile?.department || "",
      academicYear: u.profile?.academicYear || "",
      headline: u.profile?.headline || `${u.role} at ${u.institution.name}`,
      bio: u.profile?.bio || "",
      avatarUrl: u.profile?.avatarUrl || "",
      availability: u.profile?.availability || "Available for collaboration",
      preferredCollaborationMode: u.profile?.preferredCollaborationMode || "HYBRID",
      city: u.profile?.city || u.institution.city,
      state: u.profile?.state || u.institution.state,
      skills: u.userSkills.map((us: any) => us.skill.name),
      skillsDetail: u.userSkills.map((us: any) => ({
        id: us.skill.id,
        name: us.skill.name,
        category: us.skill.category || "General",
        proficiency: us.proficiency,
      })),
    };
  }
}
