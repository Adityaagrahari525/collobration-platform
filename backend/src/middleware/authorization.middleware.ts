import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

export enum Permission {
  PROFILE_READ = "PROFILE_READ",
  PROFILE_UPDATE = "PROFILE_UPDATE",

  PROJECT_CREATE = "PROJECT_CREATE",
  PROJECT_UPDATE = "PROJECT_UPDATE",
  PROJECT_DELETE = "PROJECT_DELETE",
  PROJECT_APPLY = "PROJECT_APPLY",
  PROJECT_MANAGE_APPLICATIONS = "PROJECT_MANAGE_APPLICATIONS",

  QUESTION_CREATE = "QUESTION_CREATE",
  QUESTION_ANSWER = "QUESTION_ANSWER",
  QUESTION_VOTE = "QUESTION_VOTE",
  QUESTION_ENDORSE = "QUESTION_ENDORSE",

  MENTORSHIP_CREATE_SLOT = "MENTORSHIP_CREATE_SLOT",
  MENTORSHIP_BOOK = "MENTORSHIP_BOOK",
  MENTORSHIP_MANAGE_BOOKING = "MENTORSHIP_MANAGE_BOOKING",

  COMMUNITY_CREATE = "COMMUNITY_CREATE",
  COMMUNITY_JOIN = "COMMUNITY_JOIN",

  ADMIN_ACCESS = "ADMIN_ACCESS",
  AUDIT_LOG_VIEW = "AUDIT_LOG_VIEW",
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  STUDENT: [
    Permission.PROFILE_READ,
    Permission.PROFILE_UPDATE,
    Permission.PROJECT_CREATE,
    Permission.PROJECT_UPDATE,
    Permission.PROJECT_DELETE,
    Permission.PROJECT_APPLY,
    Permission.PROJECT_MANAGE_APPLICATIONS,
    Permission.QUESTION_CREATE,
    Permission.QUESTION_ANSWER,
    Permission.QUESTION_VOTE,
    Permission.MENTORSHIP_BOOK,
    Permission.COMMUNITY_JOIN,
  ],
  FACULTY: [
    Permission.PROFILE_READ,
    Permission.PROFILE_UPDATE,
    Permission.PROJECT_CREATE,
    Permission.PROJECT_UPDATE,
    Permission.PROJECT_DELETE,
    Permission.PROJECT_MANAGE_APPLICATIONS,
    Permission.QUESTION_CREATE,
    Permission.QUESTION_ANSWER,
    Permission.QUESTION_VOTE,
    Permission.QUESTION_ENDORSE,
    Permission.MENTORSHIP_CREATE_SLOT,
    Permission.MENTORSHIP_MANAGE_BOOKING,
    Permission.COMMUNITY_CREATE,
    Permission.COMMUNITY_JOIN,
  ],
  ADMIN: Object.values(Permission),
};

export const requirePermission = (permission: Permission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required." },
        requestId: req.id,
      });
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN_PERMISSION",
          message: `Action denied. Missing required permission: ${permission}`,
        },
        requestId: req.id,
      });
    }

    next();
  };
};
