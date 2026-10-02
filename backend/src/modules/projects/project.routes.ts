import { Router } from "express";
import { ProjectController } from "./project.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

// Public / Read Project Routes
router.get("/", ProjectController.getProjects);
router.get("/:id", ProjectController.getProjectById);

// Protected Project CRUD Routes
router.post("/", requireAuth, ProjectController.createProject);
router.patch("/:id", requireAuth, ProjectController.updateProject);
router.delete("/:id", requireAuth, ProjectController.deleteProject);

export default router;
