import { Router } from "express";
import {
  getCommunities,
  getCommunityById,
  createCommunity,
  joinCommunity,
  leaveCommunity,
} from "./community.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { requirePermission, Permission } from "../../middleware/authorization.middleware";

const router = Router();

router.get("/", getCommunities);
router.get("/:id", getCommunityById);

router.post(
  "/",
  requireAuth,
  requirePermission(Permission.COMMUNITY_CREATE),
  createCommunity
);

router.post(
  "/:id/join",
  requireAuth,
  requirePermission(Permission.COMMUNITY_JOIN),
  joinCommunity
);

router.delete("/:id/leave", requireAuth, leaveCommunity);

export default router;
