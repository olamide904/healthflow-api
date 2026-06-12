import Appointment from '../models/appointment.model.js';

// GET /appointments — get all appointments for guardian's patients
export const getAllAppointments = async (req, res, next) => {
  try {
    const { status, noShow } = req.query;
    const filter = { guardianId: req.user.id };
    if (status)  filter.status = status;
    if (noShow !== undefined) filter.noShow = noShow === 'true';

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'firstName lastName age gender')
      .sort({ appointmentDay: 1 });

    res.status(200).json({ message: `${appointments.length} appointments found.`, appointments });
  } catch (error) {
    next(error);
  }
};

// GET /appointments/:id — get single appointment
export const getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'firstName lastName age gender conditions')
      .populate('guardianId', 'firstName lastName role specialisation');

    if (!appointment || !appointment.isActive) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    console.log('Found Appointment:', appointment); 
    res.status(200).json({ message: 'Appointment found.', appointment });
  } catch (error) {
    next(error);
  }
};

// GET /patients/:patientId/appointments — get all appointments for a patient
export const getPatientAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.params.patientId,
      isActive: true,
    }).sort({ appointmentDay: -1 });

    console.log(`Found ${appointments.length} appointments for patient ${req.params.patientId}`);
    res.status(200).json({ message: `${appointments.length} appointments found.`, appointments });
  } catch (error) {
    next(error);
  }
};

// POST /appointments — create appointment
export const createAppointment = async (req, res, next) => {
  try {
    const appointment = new Appointment({
      ...req.body,
      patientId: req.params.patientId,
      guardianId: req.user.id,
    });
    await appointment.save();
    console.log('Created Appointment:', appointment);
    res.status(201).json({ message: 'Appointment created successfully.', appointment });
  } catch (error) {
    next(error);
  }
};

// PATCH /appointments/:id — update appointment
export const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    res.status(200).json({ message: 'Appointment updated successfully.', appointment });
  } catch (error) {
    next(error);
  }
};

// DELETE /appointments/:id — soft delete
export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { isActive: false, status: 'cancelled' },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    res.status(200).json({ message: 'Appointment cancelled successfully.' });
  } catch (error) {
    next(error);
  }
};

