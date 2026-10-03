import { Router } from "express";
import { AuthController } from "./auth.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { rateLimiter } from "../../middleware/rateLimit.middleware";

const router = Router();

const googleRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many Google authentication attempts. Please try again later.",
});

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
router.get("/me", requireAuth, AuthController.me);
router.get("/verify-email", AuthController.verifyEmail);
router.get("/google", googleRateLimiter, AuthController.googleAuth);
router.get("/google/callback", googleRateLimiter, AuthController.googleCallback);

export default router;
