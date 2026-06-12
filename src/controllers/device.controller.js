import crypto from 'crypto';
import DeviceSession from '../models/deviceSession.model.js';
import ComplianceLog from '../models/complianceLog.model.js';
import Patient from '../models/patient.model.js';


// POST /device/register — register a new smartwatch
export const registerDevice = async (req, res, next) => {
  try {
    // Check if device already registered
    const { deviceId } = req.body;
    const existingDevice = await DeviceSession.findOne({ deviceId });
    if (existingDevice) {
      return res.status(400).json({ message: 'Device already registered.' });
    }

    // Generate device token
    const deviceToken = crypto.randomBytes(32).toString('hex');

    const device = new DeviceSession({
      ...req.body,
      deviceToken,
      isConnected: true,
      lastHeartbeatAt: new Date(),
    });

    await device.save();

    // Return token only once — store it securely on the device
    res.status(201).json({
      message: 'Device registered successfully. Save your token for future use',
      deviceToken,   // returned once only
      device: {
        id:         device._id,
        deviceId:   device.deviceId,
        deviceType: device.deviceType,
        deviceName: device.deviceName,
        patientId:  device.patientId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /device/my-devices — get all devices for logged in patient/guardian
export const getMyDevices = async (req, res, next) => {
  try {
    const patients = await Patient.find({ guardianId: req.user.id}).select('_id');
    const patientIds = patients.map(p => p._id)

    const devices = await DeviceSession.find({ 
      patientId: { $in: patientIds },
      isActive: true
     }).populate('patientId', 'firstName lastName');

    res.status(200).json({ message: `${devices.length} devices found`, devices });
  } catch (error) {
    next(error);
  }
};

// POST /device/sync — smartwatch sends dose confirmation
// Protected by requireDevice middleware — uses deviceToken not JWT
export const syncDoseConfirmation = async (req, res, next) => {
  try {
    // req.device is set by requireDevice middleware
    const device = req.device;

    // Create compliance log with source: 'device'
    const log = new ComplianceLog({
      patientId:      device.patientId,
      ...req.body,
      status:         'taken',
      source:         'device',
      deviceId:       device._id,
    });

    await log.save();

    // Update last dose confirmation on device
    device.lastDoseConfirmation = {
      prescriptionId: req.body.prescriptionId,
      confirmedAt: new Date(),
    };
    device.lastSyncedAt = new Date();
    await device.save();

    res.status(201).json({ message: 'Dose confirmation synced successfully.', log });
  } catch (error) {
    next(error);
  }
};

// POST /device/heartbeat — smartwatch ping to stay online
// Protected by requireDevice middleware
export const heartbeat = async (req, res, next) => {
  try {
    // lastHeartbeatAt is already updated in requireDevice middleware
    // update battery level if provided
    const device = req.device;
    if (req.body.batteryLevel !== undefined) {
      device.batteryLevel = req.body.batteryLevel;
      await device.save();
    }
    res.status(200).json({ message: 'Heartbeat received.', timestamp: new Date() });
  } catch (error) {
    next(error);
  }
};

// DELETE /device/:id — deactivate a device
export const deactivateDevice = async (req, res, next) => {
  try {
    const device = await DeviceSession.findByIdAndUpdate(
      req.params.id,
      { isActive: false, isConnected: false },
      { new: true }
    );
    if (!device) {
      return res.status(404).json({ message: 'Device not found.' });
    }
    res.status(200).json({ message: 'Device deactivated successfully.' });
  } catch (error) {
    next(error);
  }
};

