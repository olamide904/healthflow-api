import express from "express";
import { validateCreatePatient, validateUpdatePatient } from "../validators/patient.validator.js";
import { createPatient,
         getAllPatients, 
         getPatient, 
         updatePatient, 
         deletePatient } from "../controllers/patient.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRoleAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.use(requireAuth); // all routes below require authentication

router.post("/", requireRoleAuth('doctor'), validateCreatePatient, createPatient);

router.get("/", requireRoleAuth('doctor', 'nurse', 'guardian'), getAllPatients);

router.get("/:id", requireRoleAuth('doctor', 'nurse', 'guardian'), getPatient);

router.patch("/:id", requireRoleAuth('doctor'), validateUpdatePatient, updatePatient);

router.delete("/:id", requireRoleAuth('doctor'), deletePatient);

export default router;