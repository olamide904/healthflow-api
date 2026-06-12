import Joi from 'joi';
import { isAbsolute } from 'path';

const createReminderSchema = Joi.object({
  prescriptionId: Joi.string().hex().length(24).optional(),
  appointmentId:  Joi.string().hex().length(24).optional(),
  type:           Joi.string().valid('medication', 'appointment').required(),
  scheduledTime:  Joi.date().required(),
  isRecurring:    Joi.boolean().optional(),
  recurrence: Joi.object({
    frequency: Joi.string().valid('daily', 'weekly', 'monthly').optional(),
    daysOfWeek: Joi.array()
      .items(Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'))
      .optional(),
    time:    Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
    endDate: Joi.date().optional(),
  }).optional(),
  channels: Joi.object({
    sms:   Joi.boolean().optional(),
    push:  Joi.boolean().optional(),
    email: Joi.boolean().optional(),
  }).optional(),
  status: Joi.string().valid('pending', 'sent', 'failed', 'cancelled').default('pending'),
  sentAt: Joi.date().optional(),
  acknowledge: Joi.boolean().default(false),
  acknowledgedAt: Joi.date().optional(),
  message: Joi.string().trim().max(300).optional(),
});



export const validateCreateReminder = (req, res, next) => {
    const { error, value } = createReminderSchema.validate(req.body);
    if(error) { return res.status(400).json({ message: error.details[0].message }); }
    console.log(error);
    next();
}


const updateReminderSchema = Joi.object({
  scheduledTime: Joi.date().optional(),
  isRecurring:   Joi.boolean().optional(),
  recurrence: Joi.object({
    frequency: Joi.string().valid('daily', 'weekly', 'monthly').optional(),
    daysOfWeek: Joi.array()
      .items(Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'))
      .optional(),
    time:    Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
    endDate: Joi.date().optional(),
  }).optional(),
  channels: Joi.object({
    sms:   Joi.boolean().optional(),
    push:  Joi.boolean().optional(),
    email: Joi.boolean().optional(),
  }).optional(),
  status:  Joi.string().valid('pending', 'sent', 'failed', 'cancelled').optional(),
  sentAt: Joi.date().optional(),
  acknowledge: Joi.boolean().optional(),
  acknowledgedAt: Joi.date().optional(),
  message: Joi.string().trim().max(300).optional(),
  isActive: Joi.boolean().optional(),
});




export const validateUpdateReminder = (req, res, next) => {
    const { error, value } = updateReminderSchema.validate(req.body);
    if(error) { return res.status(400).json({ message: error.details[0].message }); }
    console.log(error);
    next();
}

