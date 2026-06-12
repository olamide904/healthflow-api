
import Joi from 'joi';

// Register validation
 const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().email({ tlds: { allow: false } }).lowercase().required(),
  password: Joi.string().min(8).max(64).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
  role: Joi.string().valid('doctor', 'guardian', 'nurse').required(),
  specialisation: Joi.string()
    .valid('general_practitioner', 'cardiologist', 'psychiatrist', 'pediatrician', 'nurse_practitioner','pharmacist', 'other')
    .optional(),

});

export const validateRegister = (req, res, next) => {
    const { error, value } = registerSchema.validate(req.body);
    if(error) { return res.status(400).json({ message: error.details[0].message }); }
    console.log(error);
    next();
}  


// Login validation
const loginSchema = Joi.object({
  email: Joi.string().trim().email({ tlds: { allow: false } }).lowercase().required(),
  password: Joi.string().required()
});

export const validateLogin = (req, res, next) => {
    const { error, value } = loginSchema.validate(req.body);
    if(error) { return res.status(400).json({ message: error.details[0].message }); }
    console.log(error);
    next();
}  