import express from 'express';
import { validateRegisterDevice, validateHeartbeat, validateSyncDose } from '../validators/device.validator.js';
import { requireAuth, requireRoleAuth, requireDeviceAuth } from '../middlewares/requireAuth.js';
import { 
    registerDevice, 
    getMyDevices, 
    syncDoseConfirmation, 
    heartbeat, 
    deactivateDevice } from '../controllers/device.controller.js';

const router = express.Router();



// POST /device/register — register a new device for a patient
router.post('/register', requireAuth, requireRoleAuth('doctor', 'nurse', 'guardian'), validateRegisterDevice, registerDevice);

// GET /device/my-devices — get all devices for logged in patient/guardian
router.get('/my-devices', requireAuth, getMyDevices);

// POST /device/sync — smartwatch sends dose confirmation
router.post('/sync', requireDeviceAuth, validateSyncDose, syncDoseConfirmation);

// POST /device/heartbeat — smartwatch ping to stay online
router.post('/heartbeat', requireDeviceAuth, validateHeartbeat, heartbeat);

// DELETE /device/:id — deactivate a device
router.delete('/:id', requireAuth, requireRoleAuth('doctor', 'guardian'), deactivateDevice);

export default router;