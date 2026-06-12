import Joi from 'joi';

const createComplianceLogSchema = Joi.object({
  prescriptionId: Joi.string().hex().length(24).required(),
  medicationId:   Joi.string().hex().length(24).required(),
  appointmentId:  Joi.string().hex().length(24).optional(),
  scheduledTime:  Joi.date().required(),
  takenTime:      Joi.date().optional(),
  status:  Joi.string().valid('taken', 'missed', 'skipped', 'late').required(),
  source:  Joi.string().valid('manual', 'device').required(),
  deviceId:    Joi.string().hex().length(24).optional(),
  smsReceived: Joi.boolean().optional(),
  notes:       Joi.string().trim().max(300).optional(),
});


export const validateCreateComplianceLog = (req, res, next) => {
    const { error, value } = createComplianceLogSchema.validate(req.body);
    if(error) { return res.status(400).json({ message: error.details[0].message }); }
    console.log(error);
    next();
}


const updateComplianceLogSchema = Joi.object({
  takenTime:   Joi.date().optional(),
  status:      Joi.string().valid('taken', 'missed', 'skipped', 'late').optional(),
  smsReceived: Joi.boolean().optional(),
  notes:       Joi.string().trim().max(300).optional(),
});


export const validateUpdateComplianceLog = (req, res, next) => {
    const { error, value } = updateComplianceLogSchema.validate(req.body);
    if(error) { return res.status(400).json({ message: error.details[0].message }); }
    console.log(error);
    next();
}

