import { Router } from "express";
import { InstitutionController } from "./institution.controller";

const router = Router();

router.get("/", InstitutionController.listInstitutions);
router.get("/:id", InstitutionController.getInstitutionById);

export default router;
