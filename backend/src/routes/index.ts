import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import institutionRoutes from "../modules/institutions/institution.routes";
import userRoutes from "../modules/users/user.routes";
import skillRoutes from "../modules/skills/skill.routes";
import questionRoutes from "../modules/questions/question.routes";
import projectRoutes from "../modules/projects/project.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/institutions", institutionRoutes);
router.use("/users", userRoutes);
router.use("/skills", skillRoutes);
router.use("/questions", questionRoutes);
router.use("/projects", projectRoutes);

export default router;
