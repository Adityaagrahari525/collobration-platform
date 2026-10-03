import prisma from "../../config/database";

export class MatchingService {
  static async getRecommendedProjects(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userSkills: { include: { skill: true } },
        profile: true,
      },
    });

    if (!user) {
      throw { statusCode: 404, message: "User not found." };
    }

    const userSkillNames = new Set(user.userSkills.map((us: any) => us.skill.name.toLowerCase()));

    const projects = await prisma.project.findMany({
      where: {
        ownerId: { not: userId },
      },
      include: {
        owner: {
          include: { profile: true, institution: true },
        },
        institution: true,
        roles: true,
        members: true,
      },
      take: 20,
    });

    const recommendations = projects.map((p: any) => {
      const allRequired: string[] = Array.from(new Set(p.roles.flatMap((r: any) => r.requiredSkills as string[])));
      const matched: string[] = [];
      const missing: string[] = [];

      allRequired.forEach((req: string) => {
        if (userSkillNames.has(req.toLowerCase())) {
          matched.push(req);
        } else {
          missing.push(req);
        }
      });

      const skillMatchRatio = allRequired.length > 0 ? matched.length / allRequired.length : 0.5;
      const skillScore = Math.round(skillMatchRatio * 100);

      // Same institution bonus
      const institutionScore = p.institutionId === user.institutionId ? 95 : 75;

      // Overall composite score
      const finalScore = Math.min(99, Math.round(skillScore * 0.7 + institutionScore * 0.3));

      return {
        id: p.id,
        title: p.title,
        description: p.description,
        leadName: p.owner ? `${p.owner.firstName} ${p.owner.lastName}` : "Lead Researcher",
        leadAvatar: p.owner?.profile?.avatarUrl,
        institution: p.institution?.name || "Academic Network",
        domain: p.domain,
        status: p.status,
        openRoles: p.roles.map((r: any) => r.title),
        requiredSkills: allRequired,
        matchScore: finalScore,
        matchedSkills: matched,
        missingSkills: missing,
        breakdown: {
          skills: skillScore,
          institution: institutionScore,
        },
      };
    });

    return recommendations.sort((a: any, b: any) => b.matchScore - a.matchScore);
  }

  static async getRecommendedPeers(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userSkills: { include: { skill: true } },
        profile: true,
      },
    });

    if (!user) {
      throw { statusCode: 404, message: "User not found." };
    }

    const userSkillNames = new Set(user.userSkills.map((us: any) => us.skill.name.toLowerCase()));

    const candidates = await prisma.user.findMany({
      where: {
        id: { not: userId },
        isActive: true,
      },
      include: {
        profile: true,
        institution: true,
        userSkills: { include: { skill: true } },
      },
      take: 30,
    });

    const scored = candidates.map((c: any) => {
      const candidateSkills: string[] = c.userSkills.map((s: any) => s.skill.name as string);
      const sharedSkills: string[] = [];

      candidateSkills.forEach((s: string) => {
        if (userSkillNames.has(s.toLowerCase())) {
          sharedSkills.push(s);
        }
      });

      const skillScore = Math.min(98, 50 + sharedSkills.length * 15);
      const isSameInst = c.institutionId === user.institutionId;
      const finalScore = Math.min(99, Math.round(skillScore * 0.8 + (isSameInst ? 95 : 70) * 0.2));

      return {
        id: c.id,
        name: `${c.firstName} ${c.lastName}`,
        firstName: c.firstName,
        lastName: c.lastName,
        role: c.role,
        institution: c.institution.name,
        department: c.profile?.department || "Academic Department",
        avatar: c.profile?.avatarUrl,
        bio: c.profile?.bio,
        skills: candidateSkills,
        matchScore: finalScore,
        sharedSkills,
      };
    });

    return scored.sort((a: any, b: any) => b.matchScore - a.matchScore);
  }

  static async getProjectCandidates(projectId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        roles: true,
        members: true,
      },
    });

    if (!project) {
      throw { statusCode: 404, message: "Project not found." };
    }

    const existingMemberIds = new Set(project.members.map((m: any) => m.userId));
    const allRequiredSkills: string[] = Array.from(new Set(project.roles.flatMap((r: any) => r.requiredSkills as string[])));

    const users = await prisma.user.findMany({
      where: {
        id: { notIn: Array.from(existingMemberIds) },
        isActive: true,
      },
      include: {
        profile: true,
        institution: true,
        userSkills: { include: { skill: true } },
      },
      take: 25,
    });

    const candidates = users.map((u: any) => {
      const userSkillNames = new Set(u.userSkills.map((s: any) => s.skill.name.toLowerCase()));
      const matchedSkills: string[] = [];
      const missingSkills: string[] = [];

      allRequiredSkills.forEach((req: string) => {
        if (userSkillNames.has(req.toLowerCase())) {
          matchedSkills.push(req);
        } else {
          missingSkills.push(req);
        }
      });

      const matchRatio = allRequiredSkills.length > 0 ? matchedSkills.length / allRequiredSkills.length : 0.5;
      const score = Math.min(99, Math.round(matchRatio * 75 + (u.institutionId === project.institutionId ? 25 : 15)));

      return {
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        institution: u.institution.name,
        department: u.profile?.department,
        avatar: u.profile?.avatarUrl,
        score,
        matchedSkills,
        missingSkills,
        reasons: [
          `${matchedSkills.length} of ${allRequiredSkills.length} required skills matched`,
          u.profile?.availability ? `Availability: ${u.profile.availability}` : "High availability",
          u.institutionId === project.institutionId ? "Same institutional campus" : "Inter-campus collaborator",
        ],
      };
    });

    return candidates.sort((a: any, b: any) => b.score - a.score);
  }
}
