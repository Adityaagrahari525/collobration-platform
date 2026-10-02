import { prisma } from "../../config/database";
import { UpdateProfileInput, AddUserSkillInput, QueryUsersInput } from "../../validators/user.validator";

export class UserService {
  // Calculate profile completeness score (0 - 100)
  private static calculateProfileCompletion(user: any): number {
    let score = 0;
    if (user.firstName && user.lastName) score += 20;
    if (user.institution) score += 20;
    if (user.profile?.department) score += 20;
    if (user.profile?.academicYear) score += 20;
    if (user.skills && user.skills.length > 0) score += 20;
    return score;
  }

  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        institution: true,
        profile: true,
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!user) {
      const error: any = new Error("User profile record not found.");
      error.statusCode = 444;
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
      skills: user.skills.map((us) => ({
        id: us.skill.id,
        name: us.skill.name,
        category: us.skill.category || "General",
        proficiency: us.proficiency,
      })),
    };
  }

  static async updateProfile(userId: string, input: UpdateProfileInput) {
    const { firstName, lastName, ...profileFields } = input;

    // 1. Update User basic info if supplied
    if (firstName || lastName) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
        },
      });
    }

    // 2. Upsert UserProfile fields
    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...profileFields,
      },
      update: {
        ...profileFields,
      },
    });

    // 3. Recalculate profile completion
    const fullUser = await this.getCurrentUser(userId);
    const isComplete = fullUser.profile.profileCompletion >= 80;

    await prisma.userProfile.update({
      where: { userId },
      data: { isProfileComplete: isComplete },
    });

    return this.getCurrentUser(userId);
  }

  static async getUserSkills(userId: string) {
    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: {
        skill: true,
      },
    });

    return userSkills.map((us) => ({
      id: us.skill.id,
      name: us.skill.name,
      category: us.skill.category || "General",
      proficiency: us.proficiency,
      assignedAt: us.createdAt,
    }));
  }

  static async addUserSkill(userId: string, input: AddUserSkillInput) {
    const skill = await prisma.skill.findUnique({
      where: { id: input.skillId },
    });

    if (!skill) {
      const error: any = new Error("Skill ID does not exist in skill directory.");
      error.statusCode = 404;
      throw error;
    }

    const existing = await prisma.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId,
          skillId: input.skillId,
        },
      },
    });

    if (existing) {
      const error: any = new Error("This skill is already assigned to your profile.");
      error.statusCode = 409;
      throw error;
    }

    const created = await prisma.userSkill.create({
      data: {
        userId,
        skillId: input.skillId,
        proficiency: input.proficiency,
      },
      include: {
        skill: true,
      },
    });

    return {
      id: created.skill.id,
      name: created.skill.name,
      category: created.skill.category || "General",
      proficiency: created.proficiency,
    };
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
      const error: any = new Error("Skill assignment not found on your profile.");
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

    return { message: "Skill successfully removed from your academic profile." };
  }

  static async getPeopleDirectory(query: QueryUsersInput) {
    const { search, role, institutionId, department, academicYear, skillId, availability, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (role) where.role = role;
    if (institutionId) where.institutionId = institutionId;

    if (department || academicYear || availability) {
      where.profile = {};
      if (department) where.profile.department = { contains: department, mode: "insensitive" };
      if (academicYear) where.profile.academicYear = { contains: academicYear, mode: "insensitive" };
      if (availability) where.profile.availability = { contains: availability, mode: "insensitive" };
    }

    if (skillId) {
      where.skills = {
        some: { skillId },
      };
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { institution: { name: { contains: search, mode: "insensitive" } } },
        { profile: { department: { contains: search, mode: "insensitive" } } },
        { profile: { headline: { contains: search, mode: "insensitive" } } },
        { skills: { some: { skill: { name: { contains: search, mode: "insensitive" } } } } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
        include: {
          institution: true,
          profile: true,
          skills: {
            include: { skill: true },
          },
        },
      }),
    ]);

    const items = users.map((u) => ({
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
      skills: u.skills.map((us) => us.skill.name),
      skillsDetail: u.skills.map((us) => ({
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
        skills: {
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
      skills: u.skills.map((us) => us.skill.name),
      skillsDetail: u.skills.map((us) => ({
        id: us.skill.id,
        name: us.skill.name,
        category: us.skill.category || "General",
        proficiency: us.proficiency,
      })),
    };
  }
}
