import Joi from 'joi';

const createPrescriptionSchema = Joi.object({
  medicationId: Joi.string().hex().length(24).required(),
  dosage: Joi.object({
    amount: Joi.number().positive().required(),
    unit:   Joi.string()
      .valid('tablet(s)', 'capsule(s)', 'ml', 'mg', 'drop(s)', 'puff(s)')
      .required(),
  }).required(),
  frequency: Joi.string()
    .valid(
      'once daily', 'twice daily', 'three times daily', 'four times daily',
      'every 8 hours', 'every 12 hours', 'as needed', 'weekly', 'monthly'
    ).required(),
  scheduledTimes: Joi.array()
    .items(Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/))
    .optional(),
  instructions: Joi.string()
    .valid('before meal', 'after meal', 'with water', 'with food', 'on empty stomach', 'at bedtime', 'none')
    .optional(),
  startDate:      Joi.date().required(),
  endDate:        Joi.date().min(Joi.ref('startDate')).optional(),
  durationDays:   Joi.number().integer().min(1).optional(),
  status:         Joi.string().valid('active', 'completed', 'paused', 'cancelled').default('active'),
  refillsAllowed: Joi.number().integer().min(0).optional(),
  notes:          Joi.string().trim().max(500).optional(),
});


export const validateCreatePrescription = (req, res, next) => {
    const { error, value } = createPrescriptionSchema.validate(req.body);
    if(error) { return res.status(400).json({ message: error.details[0].message }); }
    console.log(error);
    next();
}






const updatePrescriptionSchema = Joi.object({
  dosage: Joi.object({
    amount: Joi.number().positive().optional(),
    unit:   Joi.string()
      .valid('tablet(s)', 'capsule(s)', 'ml', 'mg', 'drop(s)', 'puff(s)')
      .optional(),
  }).optional(),
  frequency: Joi.string()
    .valid(
      'once daily', 'twice daily', 'three times daily', 'four times daily',
      'every 8 hours', 'every 12 hours', 'as needed', 'weekly', 'monthly'
    ).optional(),
  scheduledTimes: Joi.array()
    .items(Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/))
    .optional(),
  instructions: Joi.string()
    .valid('before meal', 'after meal', 'with water', 'with food', 'on empty stomach', 'at bedtime', 'none')
    .optional(),
  endDate:        Joi.date().optional(),
  durationDays:   Joi.number().integer().min(1).optional(),
  status:         Joi.string().valid('active', 'completed', 'paused', 'cancelled').optional(),
  refillsAllowed: Joi.number().integer().min(0).optional(),
  notes:          Joi.string().trim().max(500).optional(),
  isActive:       Joi.boolean().optional(),
});



export const validateUpdatePrescription = (req, res, next) => {
    const { error, value } = updatePrescriptionSchema.validate(req.body);
    if(error) { return res.status(400).json({ message: error.details[0].message }); }
    console.log(error);
    next();
}

