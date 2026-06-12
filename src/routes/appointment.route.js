import express from "express";
import { validateCreateAppointment, validateUpdateAppointment } from "../validators/appointment.validator.js";
import { 
    createAppointment, 
    getAllAppointments, 
    getAppointment, 
    getPatientAppointments, 
    updateAppointment, 
    deleteAppointment } from "../controllers/appointment.controller.js";
import { requireAuth, requireRoleAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.use(requireAuth); // all routes below require authentication

router.get("/patients/appointments", requireRoleAuth('doctor', 'nurse', 'guardian'), getAllAppointments);    

router.post("/patients/:patientId/appointments", requireRoleAuth('doctor', 'nurse'), validateCreateAppointment, createAppointment);

router.get("/patients/:patientId/appointments/:id", requireRoleAuth('doctor', 'nurse', 'guardian'), getAppointment);

router.get("/patients/:patientId/appointments", requireRoleAuth('doctor', 'nurse', 'guardian'), getPatientAppointments);

router.patch("/patients/:patientId/appointments/:id", requireRoleAuth('doctor', 'nurse'), validateUpdateAppointment, updateAppointment);

router.delete("/patients/:patientId/appointments/:id", requireRoleAuth('doctor'), deleteAppointment);

export default router;
