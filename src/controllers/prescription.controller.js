import Prescription from "../models/prescription.model.js";


// GET /patients/:patientId/prescriptions — get all prescriptions for a patient
export const getPatientPrescriptions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { patientId: req.params.patientId };
    if (status) filter.status = status;

    const prescriptions = await Prescription.find(filter)
      .populate('medicationId', 'name genericName strength dosageForm')
      .populate('prescribedBy', 'firstName lastName role');

    res.status(200).json({ message: `${prescriptions.length} prescriptions found`, prescriptions });
  } catch (error) {
    next(error);
  }
};

// GET /patients/:patientId/prescriptions/:id — get single prescription
export const getPrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findOne({
      _id: req.params.id,
      patientId: req.params.patientId,
    })
      .populate('medicationId', 'name genericName strength dosageForm sideEffects')
      .populate('prescribedBy', 'firstName lastName role specialisation');

    if (!prescription || !prescription.isActive) {
      return res.status(404).json({ message: 'Prescription not found.' });
    }
    res.status(200).json({ message: 'Prescription found.', prescription });
  } catch (error) {
    next(error);
  }
};

// POST /patients/:patientId/prescriptions — create prescription
export const createPrescription = async (req, res, next) => {
  try {
  console.log('req.user:', req.user);
    console.log('req.params:', req.params);

    const prescription = new Prescription({
      ...req.body,
      patientId:    req.params.patientId,  // from URL
      prescribedBy: req.user.id,           // from JWT
    });
    await prescription.save();
    console.log('Created Prescription:', prescription);
    res.status(201).json({ message: 'Prescription created successfully.', prescription });
  } catch (error) {
    next(error);
  }
};

// PATCH /patients/:patientId/prescriptions/:id — update prescription
export const updatePrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findOneAndUpdate(
      { _id: req.params.id, patientId: req.params.patientId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found.' });
    }
    res.status(200).json({ message: 'Prescription updated successfully.', prescription });
  } catch (error) {
    next(error);
  }
};

// DELETE /patients/:patientId/prescriptions/:id — soft delete
export const deletePrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findOneAndUpdate(
      { _id: req.params.id, patientId: req.params.patientId },
      { isActive: false, status: 'cancelled' },
      { new: true }
    );
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found.' });
    }
    res.status(200).json({ message: 'Prescription cancelled successfully.' });
  } catch (error) {
    next(error);
  }
};

