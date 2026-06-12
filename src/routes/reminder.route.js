import { validateCreateReminder, validateUpdateReminder } from "../validators/reminder.validator.js";
import { 
    createReminder, 
    getPatientReminders, 
    getReminder, 
    updateReminder, 
    deleteReminder, 
    acknowledgeReminder } from "../controllers/reminder.controller.js";
import { requireAuth, requireRoleAuth } from "../middlewares/requireAuth.js";
import express from "express";

const router = express.Router();

router.use(requireAuth); // all routes below require authentication

router.post("/patients/:patientId/reminders", requireRoleAuth('doctor', 'nurse'), validateCreateReminder, createReminder);

router.get("/patients/:patientId/reminders", requireRoleAuth('doctor', 'nurse', 'guardian'), getPatientReminders);
router.get("/patients/:patientId/reminders/:id", requireRoleAuth('doctor', 'nurse', 'guardian'), getReminder);

router.patch("/patients/:patientId/reminders/:id", requireRoleAuth('doctor', 'nurse'), validateUpdateReminder, updateReminder);
router.patch("/patients/:patientId/reminders/:id/acknowledge", requireRoleAuth('guardian'), acknowledgeReminder);

router.delete("/patients/:patientId/reminders/:id", requireRoleAuth('doctor', 'nurse'), deleteReminder);

export default router;