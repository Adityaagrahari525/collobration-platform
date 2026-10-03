import { Router } from "express";
import {
  getRecommendedProjects,
  getRecommendedPeers,
  getProjectCandidates,
} from "./matching.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/projects", getRecommendedProjects);
router.get("/people", getRecommendedPeers);
router.get("/projects/:id/candidates", getProjectCandidates);

export default router;
