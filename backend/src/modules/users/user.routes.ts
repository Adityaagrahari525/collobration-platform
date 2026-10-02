import { Router } from "express";
import { UserController } from "./user.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

// Current User Profile, Skills & Account Deletion (Authenticated)
router.get("/me", requireAuth, UserController.getMe);
router.patch("/me/profile", requireAuth, UserController.updateProfile);
router.delete("/me", requireAuth, UserController.deleteMyAccount);
router.get("/me/skills", requireAuth, UserController.getMySkills);
router.post("/me/skills", requireAuth, UserController.addMySkill);
router.delete("/me/skills/:skillId", requireAuth, UserController.removeMySkill);

// Public Academic Directory (Authenticated or Public) & User Deletion
router.get("/", UserController.getPeople);
router.get("/:id", UserController.getPersonById);
router.delete("/:id", requireAuth, UserController.deleteUserById);

export default router;
