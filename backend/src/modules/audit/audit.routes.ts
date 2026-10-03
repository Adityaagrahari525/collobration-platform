import { Router } from "express";
import { getAuditLogs } from "./audit.controller";
import { requireAuth, requireRole } from "../../middleware/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.use(requireAuth);
router.use(requireRole(Role.ADMIN));

router.get("/", getAuditLogs);

export default router;
