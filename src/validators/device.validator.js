import Joi from 'joi';

// Register device validation
const registerDeviceSchema = Joi.object({
  patientId: Joi.string().hex().length(24).required(),
  deviceId: Joi.string().trim().required(),
  deviceType: Joi.string()
    .valid('smartwatch', 'fitness_band', 'phone', 'tablet', 'other')
    .default('smartwatch')
    .required(),
  deviceName: Joi.string().trim().optional(),
  platform: Joi.string()
    .valid('watchOS', 'wearOS', 'tizen', 'fitbitOS', 'other')
    .optional(),
  firmwareVersion: Joi.string().trim().required(),
});


export const validateRegisterDevice = (req, res, next) => {
  const { error } = registerDeviceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  next();
};



// Dose confirmation from smartwatch
const syncDoseSchema = Joi.object({
  prescriptionId: Joi.string().hex().length(24).required(),
  medicationId: Joi.string().hex().length(24).required(),
  scheduledTime: Joi.date().required(),
  takenTime: Joi.date().required(),
});


export const validateSyncDose = (req, res, next) => {
  const { error } = syncDoseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  next();
};




// Heartbeat from smartwatch/periodic status update
const heartbeatSchema = Joi.object({
  batteryLevel: Joi.number().integer().min(0).max(100).required(),
});

export const validateHeartbeat = (req, res, next) => {
  const { error } = heartbeatSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  next();
};

