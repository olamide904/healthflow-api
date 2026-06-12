import { Router } from "express";
import { validateCreateMedication, validateUpdateMedication } from "../validators/medication.validator.js";
import {
     getAllMedications, 
     getMedication, 
     createMedication, 
     updateMedication, 
     deleteMedication } from "../controllers/medication.controller.js";
import { requireAuth, requireRoleAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.use(requireAuth);
router.use(requireRoleAuth('doctor')); // Only doctors can manage medications

router.get("/", getAllMedications);
router.get("/:id", getMedication);
router.post("/", validateCreateMedication, createMedication);
router.patch("/:id", validateUpdateMedication, updateMedication);
router.delete("/:id", deleteMedication);

export default router;