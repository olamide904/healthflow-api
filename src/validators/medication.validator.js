import Joi from 'joi';

const createMedicationSchema = Joi.object({
  name:        Joi.string().trim().required(),
  genericName: Joi.string().trim().optional(),
  dosageForm:  Joi.string()
    .valid('tablet', 'capsule', 'syrup', 'injection', 'cream', 'drops', 'inhaler', 'patch', 'other')
    .required(),
  strength: Joi.object({
    value: Joi.number().positive().required(),
    unit:  Joi.string().valid('mg', 'mcg', 'g', 'ml', 'IU', '%').required(),
  }).required(),
  defaultFrequency: Joi.string()
    .valid(
      'once daily', 'twice daily', 'three times daily', 'four times daily', 'every 8 hours', 'every 12 hours', 
      'as needed', 'weekly', 'monthly'
    ).optional(),
  usedFor:           Joi.array().items(Joi.string().trim()).optional(),
  sideEffects:       Joi.array().items(Joi.string().trim()).optional(),
  contraindications: Joi.array().items(Joi.string().trim()).optional(),
  requiresPrescription: Joi.boolean().default(true),
  manufacturer:         Joi.string().trim().optional(),
  isActive:             Joi.boolean().default(true),
});



export const validateCreateMedication = (req, res, next) => {
    const { error, value } = createMedicationSchema.validate(req.body);
    if(error) { return res.status(400).json({ message: error.details[0].message }); }
    console.log(error);
    next();
}




const updateMedicationSchema = createMedicationSchema.fork(
  ['name', 'dosageForm', 'strength', 'isActive'],
  (field) => field.optional()
);


export const validateUpdateMedication = (req, res, next) => {
    const { error, value } = updateMedicationSchema.validate(req.body);
    if(error) { return res.status(400).json({ message: error.details[0].message }); }
    console.log(error);
    next();
}
