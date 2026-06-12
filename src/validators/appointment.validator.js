import Joi from 'joi';

const createAppointmentSchema = Joi.object({
  appointmentId:  Joi.string().trim().required(),
  scheduledDay:   Joi.date().required(),
  appointmentDay: Joi.date().min(Joi.ref('scheduledDay')).required(),
  status:         Joi.string()
    .valid('scheduled', 'completed', 'missed', 'cancelled', 'rescheduled')
    .default('scheduled'),
  noShow:         Joi.boolean().optional(),
  smsReceived:    Joi.boolean().default(false),
  reason:         Joi.string().trim().max(500).optional(),
  notes:          Joi.string().trim().max(500).optional(),
  location:       Joi.string().trim().max(200).optional(),
});


export const validateCreateAppointment = (req, res, next) => {
    const { error, value } = createAppointmentSchema.validate(req.body);
    if(error) { return res.status(400).json({ message: error.details[0].message }); }
    console.log(error);
    next();
}


const updateAppointmentSchema = Joi.object({
  appointmentDay: Joi.date().optional(),
  status:  Joi.string()
    .valid('scheduled', 'completed', 'missed', 'cancelled', 'rescheduled')
    .optional(),
  noShow:      Joi.boolean().optional(),
  smsReceived: Joi.boolean().optional(),
  reason:      Joi.string().trim().max(500).optional(),
  notes:       Joi.string().trim().max(500).optional(),
  location:    Joi.string().trim().max(200).optional(),
});


export const validateUpdateAppointment = (req, res, next) => {
    const { error, value } = updateAppointmentSchema.validate(req.body);
    if(error) { return res.status(400).json({ message: error.details[0].message }); }
    console.log(error);
    next();
}
