import { prisma } from "../../config/database";
import { CreateProjectInput, UpdateProjectInput } from "../../validators/project.validator";

export class ProjectService {
  static async getProjects(search?: string, domain?: string, status?: string) {
    const where: any = {};

    if (domain) {
      where.domain = { contains: domain, mode: "insensitive" };
    }

    if (status) {
      where.status = { contains: status, mode: "insensitive" };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { domain: { contains: search, mode: "insensitive" } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        lead: {
          include: {
            institution: true,
            profile: true,
          },
        },
        institution: true,
      },
    });

    return projects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      leadId: p.leadId,
      leadName: p.lead ? `${p.lead.firstName} ${p.lead.lastName}` : "Lead Researcher",
      leadRole: p.lead ? `${p.lead.profile?.academicYear || p.lead.role}, ${p.lead.institution.name}` : "IIT Delhi Researcher",
      leadAvatar: p.lead?.profile?.avatarUrl || null,
      institution: p.institution?.name || p.lead?.institution?.name || "IIT Delhi",
      collaboratingInstitutions: p.collaboratingInstitutions || [p.institution?.name || "IIT Delhi"],
      status: p.status || "Recruiting",
      sprintPhase: p.sprintPhase || "Phase 1: Architecture",
      domain: p.domain || "Research & Engineering",
      openRoles: p.recruitingRoles || [],
      recruitingRoles: p.recruitingRoles || [],
      requiredSkills: p.requiredSkills || [],
      teamMemberCount: p.teamMemberCount || 1,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }

  static async getProjectById(id: string) {
    const p = await prisma.project.findUnique({
      where: { id },
      include: {
        lead: {
          include: {
            institution: true,
            profile: true,
          },
        },
        institution: true,
      },
    });

    if (!p) {
      const error: any = new Error("Project workspace not found.");
      error.statusCode = 404;
      throw error;
    }

    return {
      id: p.id,
      title: p.title,
      description: p.description,
      leadId: p.leadId,
      leadName: p.lead ? `${p.lead.firstName} ${p.lead.lastName}` : "Lead Researcher",
      leadRole: p.lead ? `${p.lead.profile?.academicYear || p.lead.role}, ${p.lead.institution.name}` : "IIT Delhi Researcher",
      leadAvatar: p.lead?.profile?.avatarUrl || null,
      institution: p.institution?.name || p.lead?.institution?.name || "IIT Delhi",
      collaboratingInstitutions: p.collaboratingInstitutions || [p.institution?.name || "IIT Delhi"],
      status: p.status || "Recruiting",
      sprintPhase: p.sprintPhase || "Phase 1: Architecture",
      domain: p.domain || "Research & Engineering",
      openRoles: p.recruitingRoles || [],
      recruitingRoles: p.recruitingRoles || [],
      requiredSkills: p.requiredSkills || [],
      teamMemberCount: p.teamMemberCount || 1,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  }

  static async createProject(userId: string, input: CreateProjectInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { institution: true },
    });

    if (!user) {
      const error: any = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    const newProject = await prisma.project.create({
      data: {
        title: input.title,
        description: input.description,
        leadId: userId,
        institutionId: user.institutionId,
        domain: input.domain || "Research & Engineering",
        sprintPhase: input.sprintPhase || "Phase 1: Architecture",
        status: input.status || "Recruiting",
        recruitingRoles: input.recruitingRoles || [],
        requiredSkills: input.requiredSkills || [],
        collaboratingInstitutions: input.collaboratingInstitutions.length > 0 ? input.collaboratingInstitutions : [user.institution.name],
        teamMemberCount: 1,
      },
    });

    // Record user contribution
    await prisma.contribution.create({
      data: {
        userId,
        type: "PROJECT_CREATED",
        description: `Initiated research project: '${input.title.slice(0, 40)}'`,
        points: 15,
      },
    }).catch(() => {});

    return this.getProjectById(newProject.id);
  }

  static async updateProject(id: string, userId: string, userRole: string, input: UpdateProjectInput) {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      const error: any = new Error("Project not found.");
      error.statusCode = 404;
      throw error;
    }

    if (existing.leadId !== userId && userRole !== "ADMIN") {
      const error: any = new Error("Permission denied to edit this project.");
      error.statusCode = 403;
      throw error;
    }

    await prisma.project.update({
      where: { id },
      data: {
        ...(input.title && { title: input.title }),
        ...(input.description && { description: input.description }),
        ...(input.domain && { domain: input.domain }),
        ...(input.sprintPhase && { sprintPhase: input.sprintPhase }),
        ...(input.status && { status: input.status }),
        ...(input.recruitingRoles && { recruitingRoles: input.recruitingRoles }),
        ...(input.requiredSkills && { requiredSkills: input.requiredSkills }),
        ...(input.collaboratingInstitutions && { collaboratingInstitutions: input.collaboratingInstitutions }),
      },
    });

    return this.getProjectById(id);
  }

  static async deleteProject(id: string, userId: string, userRole: string) {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      const error: any = new Error("Project not found.");
      error.statusCode = 404;
      throw error;
    }

    if (existing.leadId !== userId && userRole !== "ADMIN") {
      const error: any = new Error("Permission denied to delete this project.");
      error.statusCode = 403;
      throw error;
    }

    await prisma.project.delete({ where: { id } });
    return { message: "Project workspace successfully deleted from database." };
  }
}
