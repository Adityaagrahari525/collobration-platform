import { Router } from "express";
import {
  applyToProject,
  getProjectApplications,
  updateApplicationStatus,
  getMyApplications,
} from "./application.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { requirePermission, Permission } from "../../middleware/authorization.middleware";

const router = Router({ mergeParams: true });

// Route mounted at /api/applications and /api/projects/:projectId/applications
router.get("/me", requireAuth, getMyApplications);
router.patch("/:id/status", requireAuth, updateApplicationStatus);

// Project scoped
router.post(
  "/:projectId/applications",
  requireAuth,
  requirePermission(Permission.PROJECT_APPLY),
  applyToProject
);
router.get(
  "/:projectId/applications",
  requireAuth,
  requirePermission(Permission.PROJECT_MANAGE_APPLICATIONS),
  getProjectApplications
);

export default router;
