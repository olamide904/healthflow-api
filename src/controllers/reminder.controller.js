import Reminder from '../models/reminder.model.js';


// GET /patients/:patientId/reminders — get all reminders for a patient
export const getPatientReminders = async (req, res, next) => {
  try {
    const { status, type } = req.query;
    const filter = { patientId: req.params.patientId, isActive: true };
    if (status) filter.status = status;
    if (type)   filter.type   = type;

    const reminders = await Reminder.find(filter)
      .populate('prescriptionId', 'frequency duration')
      .populate('appointmentId', 'appointmentDay')
      .sort({ appointmentDay: 1 });

    res.status(200).json({ message: `Found ${reminders.length} reminders.`, reminders });
  } catch (error) {
    next(error);
  }
};

// GET  /patients/:patientId/reminders/:id — get single reminder
export const getReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      patientId: req.params.patientId,
    });
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found.' });
    }
    res.status(200).json({ reminder });
  } catch (error) {
    next(error);
  }
};

// POST /patients/:patientId/reminders — create reminder
export const createReminder = async (req, res, next) => {
  try {
    const reminder = new Reminder({
      ...req.body,
      patientId: req.params.patientId,
    });
    await reminder.save();
    res.status(201).json({ message: 'Reminder created successfully.', reminder });
  } catch (error) {
    next(error);
  }
};

// PATCH /patients/:patientId/reminders/:id — update reminder
export const updateReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, patientId: req.params.patientId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found.' });
    }
    res.status(200).json({ message: 'Reminder updated successfully.', reminder });
  } catch (error) {
    next(error);
  }
};

// DELETE /patients/:patientId/reminders/:id — soft delete
export const deleteReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, patientId: req.params.patientId },
      { isActive: false, status: 'cancelled' },
      { new: true }
    );
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found.' });
    }
    res.status(200).json({ message: 'Reminder cancelled successfully.' });
  } catch (error) {
    next(error);
  }
};

// PATCH /patients/:patientId/reminders/:id/acknowledge — patient acknowledges reminder
export const acknowledgeReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, patientId: req.params.patientId },
      { acknowledged: true, acknowledgedAt: new Date() },
      { new: true }
    );
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found.' });
    }
    res.status(200).json({ message: 'Reminder acknowledged.', reminder });
  } catch (error) {
    next(error);
  }
};

