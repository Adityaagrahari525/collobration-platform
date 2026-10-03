import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import institutionRoutes from "../modules/institutions/institution.routes";
import userRoutes from "../modules/users/user.routes";
import skillRoutes from "../modules/skills/skill.routes";
import questionRoutes from "../modules/questions/question.routes";
import projectRoutes from "../modules/projects/project.routes";
import applicationRoutes from "../modules/applications/application.routes";
import mentorshipRoutes from "../modules/mentorship/mentorship.routes";
import notificationRoutes from "../modules/notifications/notification.routes";
import communityRoutes from "../modules/communities/community.routes";
import messageRoutes from "../modules/messages/message.routes";
import matchingRoutes from "../modules/matching/matching.routes";
import aiRoutes from "../modules/ai/ai.routes";
import auditRoutes from "../modules/audit/audit.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/institutions", institutionRoutes);
router.use("/users", userRoutes);
router.use("/skills", skillRoutes);
router.use("/questions", questionRoutes);
router.use("/projects", projectRoutes);
router.use("/applications", applicationRoutes);
router.use("/projects", applicationRoutes); // For /api/projects/:projectId/applications
router.use("/mentorship", mentorshipRoutes);
router.use("/notifications", notificationRoutes);
router.use("/communities", communityRoutes);
router.use("/messages", messageRoutes);
router.use("/matching", matchingRoutes);
router.use("/assistant", aiRoutes);
router.use("/ai", aiRoutes);
router.use("/admin/audit-logs", auditRoutes);

export default router;
