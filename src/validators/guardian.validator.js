import Joi from "joi";

// Validation schema for updating guardian profile
const updateGuardianSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).optional(),
  lastName: Joi.string().trim().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  specialisation: Joi.string().trim().min(2).max(100).optional()
});

// Middleware to validate update guardian profile request
export const validateUpdateGuardian = (req, res, next) => {
  const { error, value } = updateGuardianSchema.validate(req.body);
  if(error) { return res.status(400).json({ message: error.details[0].message }); }
    console.log(error);
    next();
};