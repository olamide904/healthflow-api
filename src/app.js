import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler.js';
import logRequest from './middlewares/logger.js';
import authRoutes from './routes/auth.routes.js';
import patientRoutes from './routes/patient.route.js';
import guardianRoutes from './routes/guardian.route.js';
import medicationRoutes from './routes/medication.route.js';
import prescriptionRoutes from './routes/prescription.route.js';
import appointmentRoutes from './routes/appointment.route.js';
import reminderRoutes from './routes/reminder.route.js';
import complianceRoutes from './routes/compliance.route.js';
import deviceRoutes from './routes/device.route.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(logRequest);


app.use('/api/device', deviceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', appointmentRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/guardians', guardianRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api', prescriptionRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api', complianceRoutes);


app.use(errorHandler);


export default app;