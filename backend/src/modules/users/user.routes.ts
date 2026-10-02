import { Router } from "express";
import { UserController } from "./user.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

// Current User Profile & Skills (Authenticated)
router.get("/me", requireAuth, UserController.getMe);
router.patch("/me/profile", requireAuth, UserController.updateProfile);
router.get("/me/skills", requireAuth, UserController.getMySkills);
router.post("/me/skills", requireAuth, UserController.addMySkill);
router.delete("/me/skills/:skillId", requireAuth, UserController.removeMySkill);

// Public Academic Directory (Authenticated or Public)
router.get("/", UserController.getPeople);
router.get("/:id", UserController.getPersonById);

export default router;
