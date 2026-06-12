import Joi from 'joi';


const createPatientSchema = Joi.object({
  patientId:  Joi.string().trim().required(),
  firstName:  Joi.string().trim().min(2).max(15).required(),
  lastName:   Joi.string().trim().min(2).max(15).required(),
  gender:     Joi.string().valid('M', 'F').required(),
  age:        Joi.number().integer().min(0).max(130).required(),
  neighbourhood: Joi.string().trim().required(),
  scholarship:   Joi.boolean().optional(),
  conditions: Joi.object({
    hypertension: Joi.boolean().default(false),
    diabetes:     Joi.boolean().default(false),
    alcoholism:   Joi.boolean().default(false),
    handicap:     Joi.boolean().default(false),
  }).required(),
  guardianId: Joi.string().hex().length(24).optional(),
});


export const validateCreatePatient = (req, res, next) => {
    const { error, value } = createPatientSchema.validate(req.body);
    if(error) { return res.status(400).json({ message: error.details[0].message }); }
    console.log(error);
    next();
}  

const updatePatientSchema = Joi.object({
  firstName:  Joi.string().trim().min(2).max(15).optional(),
  lastName:  Joi.string().trim().min(2).max(15).optional(),
  gender:     Joi.string().valid('M', 'F').optional(),
  age:        Joi.number().integer().min(0).max(130).optional(),
  neighbourhood: Joi.string().trim().optional(),
  scholarship:   Joi.boolean().optional(),
  conditions: Joi.object({
    hypertension: Joi.boolean().default(false),
    diabetes:     Joi.boolean().default(false),
    alcoholism:   Joi.boolean().default(false),
    handicap:     Joi.boolean().default(false),
  }).optional(),
  guardianId: Joi.string().hex().length(24).optional(),
  isActive:   Joi.boolean().optional(),
}).min(1); // Require at least one field for update



export const validateUpdatePatient = (req, res, next) => {
    const { error, value } = updatePatientSchema.validate(req.body);
    if(error) { return res.status(400).json({ message: error.details[0].message }); }
    console.log(error);
    next();
}
