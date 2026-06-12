import { validateCreatePrescription, validateUpdatePrescription } from "../validators/prescription.validator.js";
import { 
    getPatientPrescriptions, 
    getPrescription, 
    createPrescription, 
    updatePrescription, 
    deletePrescription } from "../controllers/prescription.controller.js";
import { Router } from "express";
import { requireAuth, requireRoleAuth } from "../middlewares/requireAuth.js";

const router = Router({ mergeParams: true }); // mergeParams to access patientId from parent route

router.use(requireAuth);

router.get("/patients/:patientId/prescriptions", requireRoleAuth('doctor', 'nurse', 'guardian'), getPatientPrescriptions);
router.get("/patients/:patientId/prescriptions/:id", requireRoleAuth('doctor', 'nurse', 'guardian'), getPrescription);
router.post("/patients/:patientId/prescriptions", requireRoleAuth('doctor'), validateCreatePrescription, createPrescription);
router.patch("/patients/:patientId/prescriptions/:id",  requireRoleAuth('doctor'), validateUpdatePrescription, updatePrescription);
router.delete("/patients/:patientId/prescriptions/:id", requireRoleAuth('doctor'), deletePrescription);


export default router;