import prisma from "../../config/database";
import { CreateProjectInput, UpdateProjectInput } from "../../validators/project.validator";
import { ProjectStatus, MembershipStatus } from "@prisma/client";

export class ProjectService {
  static async getProjects(search?: string, domain?: string, status?: string) {
    const where: any = {};

    if (domain) {
      where.domain = { contains: domain, mode: "insensitive" };
    }

    if (status) {
      where.status = status as ProjectStatus;
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
        owner: {
          include: {
            institution: true,
            profile: true,
          },
        },
        institution: true,
        roles: true,
        members: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
            role: true,
          },
        },
      },
    });

    return projects.map((p) => {
      const allRequiredSkills = Array.from(
        new Set(p.roles.flatMap((r) => r.requiredSkills))
      );

      return {
        id: p.id,
        title: p.title,
        description: p.description,
        leadId: p.ownerId,
        ownerId: p.ownerId,
        leadName: p.owner ? `${p.owner.firstName} ${p.owner.lastName}` : "Lead Researcher",
        leadRole: p.owner ? `${p.owner.profile?.academicYear || p.owner.role}, ${p.owner.institution?.name || "IIT Delhi"}` : "IIT Delhi Researcher",
        leadAvatar: p.owner?.profile?.avatarUrl || null,
        institution: p.institution?.name || p.owner?.institution?.name || "IIT Delhi",
        collaboratingInstitutions: p.collaboratingInstitutions || [p.institution?.name || "IIT Delhi"],
        status: p.status,
        sprintPhase: p.sprintPhase || "Phase 1: Architecture",
        domain: p.domain || "Research & Engineering",
        roles: p.roles,
        openRoles: p.roles.map((r) => r.title),
        recruitingRoles: p.roles.map((r) => r.title),
        requiredSkills: allRequiredSkills,
        teamMemberCount: p.members.length || 1,
        members: p.members,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });
  }

  static async getProjectById(id: string) {
    const p = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          include: {
            institution: true,
            profile: true,
          },
        },
        institution: true,
        roles: {
          include: {
            applications: {
              include: {
                applicant: {
                  include: {
                    profile: true,
                    userSkills: { include: { skill: true } },
                  },
                },
              },
            },
          },
        },
        members: {
          include: {
            user: {
              include: {
                profile: true,
                institution: true,
              },
            },
            role: true,
          },
        },
        applications: {
          include: {
            role: true,
            applicant: {
              include: {
                profile: true,
                userSkills: { include: { skill: true } },
              },
            },
          },
        },
      },
    });

    if (!p) {
      const error: any = new Error("Project workspace not found.");
      error.statusCode = 404;
      throw error;
    }

    const allRequiredSkills = Array.from(
      new Set(p.roles.flatMap((r) => r.requiredSkills))
    );

    return {
      id: p.id,
      title: p.title,
      description: p.description,
      leadId: p.ownerId,
      ownerId: p.ownerId,
      leadName: p.owner ? `${p.owner.firstName} ${p.owner.lastName}` : "Lead Researcher",
      leadRole: p.owner ? `${p.owner.profile?.academicYear || p.owner.role}, ${p.owner.institution?.name || "IIT Delhi"}` : "IIT Delhi Researcher",
      leadAvatar: p.owner?.profile?.avatarUrl || null,
      institution: p.institution?.name || p.owner?.institution?.name || "IIT Delhi",
      collaboratingInstitutions: p.collaboratingInstitutions || [p.institution?.name || "IIT Delhi"],
      status: p.status,
      sprintPhase: p.sprintPhase || "Phase 1: Architecture",
      domain: p.domain || "Research & Engineering",
      roles: p.roles,
      openRoles: p.roles.map((r) => r.title),
      recruitingRoles: p.roles.map((r) => r.title),
      requiredSkills: allRequiredSkills,
      teamMemberCount: p.members.length || 1,
      members: p.members,
      applications: p.applications,
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

    const statusValue = (input.status as ProjectStatus) || ProjectStatus.RECRUITING;

    // Create roles array from recruitingRoles and requiredSkills
    const initialRoles = (input.recruitingRoles && input.recruitingRoles.length > 0)
      ? input.recruitingRoles.map((roleTitle) => ({
          title: roleTitle,
          description: `Collaborator role for ${roleTitle}`,
          requiredSkills: input.requiredSkills || [],
          slots: 1,
        }))
      : [
          {
            title: "Core Contributor",
            description: "Lead developer and researcher",
            requiredSkills: input.requiredSkills || [],
            slots: 1,
          },
        ];

    const newProject = await prisma.project.create({
      data: {
        title: input.title,
        description: input.description,
        ownerId: userId,
        institutionId: user.institutionId,
        domain: input.domain || "Research & Engineering",
        sprintPhase: input.sprintPhase || "Phase 1: Architecture",
        status: statusValue,
        collaboratingInstitutions:
          input.collaboratingInstitutions && input.collaboratingInstitutions.length > 0
            ? input.collaboratingInstitutions
            : [user.institution.name],
        roles: {
          create: initialRoles,
        },
        members: {
          create: [
            {
              userId,
              status: MembershipStatus.ACTIVE,
            },
          ],
        },
      },
    });

    // Record user contribution
    await prisma.contribution.create({
      data: {
        userId,
        type: "PROJECT_CREATED",
        description: `Initiated research project: '${input.title.slice(0, 40)}'`,
        points: 25,
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

    if (existing.ownerId !== userId && userRole !== "ADMIN") {
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
        ...(input.status && { status: input.status as ProjectStatus }),
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

    if (existing.ownerId !== userId && userRole !== "ADMIN") {
      const error: any = new Error("Permission denied to delete this project.");
      error.statusCode = 403;
      throw error;
    }

    await prisma.project.delete({ where: { id } });
    return { message: "Project workspace successfully deleted from database." };
  }
}
