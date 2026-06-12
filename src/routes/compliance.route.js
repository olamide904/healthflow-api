import express from "express";
import { validateCreateComplianceLog, validateUpdateComplianceLog } from "../validators/complianceLog.validator.js";
import { 
    getPatientComplianceLogs, 
    getComplianceLog, 
    createComplianceLog, 
    updateComplianceLog, 
    getComplianceSummary } from "../controllers/compliance.controller.js";
import { requireAuth, requireRoleAuth } from "../middlewares/requireAuth.js";


const router = express.Router({ mergeParams: true });

router.use(requireAuth);

router.get('/patient/:patientId/compliance', getPatientComplianceLogs);
router.get('/patient/:patientId/compliance/summary', getComplianceSummary);
router.get('/patient/:patientId/compliance/:id', getComplianceLog);
router.post('/patient/:patientId/compliance', validateCreateComplianceLog, createComplianceLog);
router.patch('/patient/:patientId/compliance/:id', validateUpdateComplianceLog, updateComplianceLog);

export default router;