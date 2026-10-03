import prisma from "../../config/database";
import { ApplicationStatus, MembershipStatus, NotificationType, Role } from "@prisma/client";
import { AuditService } from "../audit/audit.service";

export class ApplicationService {
  static async apply(params: {
    projectId: string;
    roleId: string;
    applicantId: string;
    pitch: string;
    requestId: string;
  }) {
    // 1. Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: params.projectId },
      include: { owner: true },
    });

    if (!project) {
      throw { statusCode: 404, message: "Project not found." };
    }

    // 2. Cannot apply to own project
    if (project.ownerId === params.applicantId) {
      throw { statusCode: 400, message: "You cannot apply to your own project." };
    }

    // 3. Check if role belongs to project
    const role = await prisma.projectRole.findFirst({
      where: { id: params.roleId, projectId: params.projectId },
    });

    if (!role) {
      throw { statusCode: 404, message: "Specified project role does not exist on this project." };
    }

    // 4. Check for duplicate application
    const existing = await prisma.projectApplication.findUnique({
      where: {
        projectId_applicantId: {
          projectId: params.projectId,
          applicantId: params.applicantId,
        },
      },
    });

    if (existing) {
      throw { statusCode: 409, message: "You have already applied to this project." };
    }

    // 5. Create application
    const application = await prisma.projectApplication.create({
      data: {
        projectId: params.projectId,
        roleId: params.roleId,
        applicantId: params.applicantId,
        pitch: params.pitch,
        status: ApplicationStatus.PENDING,
      },
      include: {
        role: true,
        project: true,
      },
    });

    // 6. Notify Project Owner
    await prisma.notification.create({
      data: {
        userId: project.ownerId,
        type: NotificationType.PROJECT_APPLICATION,
        title: "New Project Application",
        message: `A scholar applied for the "${role.title}" role on your project "${project.title}".`,
        link: `/projects/${project.id}`,
        entityType: "ProjectApplication",
        entityId: application.id,
      },
    });

    // 7. Audit log
    await AuditService.log({
      requestId: params.requestId,
      actorId: params.applicantId,
      action: "APPLICATION_SUBMITTED",
      entityType: "ProjectApplication",
      entityId: application.id,
      metadata: { projectId: params.projectId, roleTitle: role.title },
    });

    return application;
  }

  static async getProjectApplications(projectId: string, user: { userId: string; role: Role }) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true },
    });

    if (!project) {
      throw { statusCode: 404, message: "Project not found." };
    }

    if (project.ownerId !== user.userId && user.role !== Role.ADMIN) {
      throw { statusCode: 403, message: "Only the project owner or administrators can review applications." };
    }

    return prisma.projectApplication.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      include: {
        role: true,
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            institution: { select: { id: true, name: true, code: true } },
            profile: true,
            userSkills: {
              include: { skill: true },
            },
          },
        },
      },
    });
  }

  static async updateStatus(params: {
    applicationId: string;
    status: ApplicationStatus;
    actor: { userId: string; role: Role };
    requestId: string;
  }) {
    const app = await prisma.projectApplication.findUnique({
      where: { id: params.applicationId },
      include: {
        project: true,
        role: true,
      },
    });

    if (!app) {
      throw { statusCode: 404, message: "Application not found." };
    }

    // Verify actor is owner or admin
    if (app.project.ownerId !== params.actor.userId && params.actor.role !== Role.ADMIN) {
      throw { statusCode: 403, message: "Only the project owner can update application status." };
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedApp = await tx.projectApplication.update({
        where: { id: params.applicationId },
        data: { status: params.status },
        include: { role: true, project: true },
      });

      if (params.status === ApplicationStatus.ACCEPTED) {
        // Create project member
        await tx.projectMember.upsert({
          where: {
            projectId_userId: {
              projectId: app.projectId,
              userId: app.applicantId,
            },
          },
          update: {
            status: MembershipStatus.ACTIVE,
            roleId: app.roleId,
          },
          create: {
            projectId: app.projectId,
            userId: app.applicantId,
            roleId: app.roleId,
            status: MembershipStatus.ACTIVE,
          },
        });

        // Send Acceptance Notification
        await tx.notification.create({
          data: {
            userId: app.applicantId,
            type: NotificationType.APPLICATION_ACCEPTED,
            title: "Application Accepted! 🎉",
            message: `Congratulations! Your application for "${app.role.title}" on "${app.project.title}" has been accepted.`,
            link: `/projects/${app.projectId}`,
            entityType: "Project",
            entityId: app.projectId,
          },
        });
      } else if (params.status === ApplicationStatus.REJECTED) {
        await tx.notification.create({
          data: {
            userId: app.applicantId,
            type: NotificationType.APPLICATION_REJECTED,
            title: "Application Status Update",
            message: `Your application for "${app.role.title}" on "${app.project.title}" was not selected at this time.`,
            link: `/projects/${app.projectId}`,
            entityType: "Project",
            entityId: app.projectId,
          },
        });
      }

      return updatedApp;
    });

    await AuditService.log({
      requestId: params.requestId,
      actorId: params.actor.userId,
      action: `APPLICATION_${params.status}`,
      entityType: "ProjectApplication",
      entityId: params.applicationId,
      metadata: { projectId: app.projectId, applicantId: app.applicantId },
    });

    return updated;
  }

  static async getMyApplications(userId: string) {
    return prisma.projectApplication.findMany({
      where: { applicantId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        role: true,
        project: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            institution: true,
          },
        },
      },
    });
  }
}
