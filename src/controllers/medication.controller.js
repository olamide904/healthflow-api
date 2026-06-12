import Medication from "../models/medication.model.js";

// GET /medications — get all active medications
export const getAllMedications = async (req, res, next) => {
  try {
    const { page = 1, limit = 4 } = req.query;
    const skip = (page - 1) * limit;
    const { usedFor, dosageForm } = req.query;
    const filter = { isActive: true };

    // Optional filters
    if (usedFor)    filter.usedFor    = usedFor;
    if (dosageForm) filter.dosageForm = dosageForm;

    const medications = await Medication.find(filter).limit(limit * 1).skip(skip);
    console.log(`${medications.length} medications retrieved with filters:`, filter, medications);
    const totalmedications = await Medication.countDocuments(filter);
    res.status(200).json({ 
      message: `${medications.length} medications found.`,
      page,
      totalPages: Math.ceil(totalmedications / limit),
       medications });
  } catch (error) {
    next(error);
  }
};

// GET /medications/:id — get single medication
export const getMedication = async (req, res, next) => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication || !medication.isActive) {
      return res.status(404).json({ message: 'Medication not found.' });
    }
    console.log('Medication retrieved:', medication);
    res.status(200).json({ medication });
  } catch (error) {
    next(error);
  }
};

// POST /medications — create medication
export const createMedication = async (req, res, next) => {
  try {
    const medication = new Medication(req.body);
    await medication.save();
    console.log('Medication created:', medication);
    res.status(201).json({ message: 'Medication created successfully.', medication });
  } catch (error) {
    next(error);
  }
};

// PATCH /medications/:id — update medication
export const updateMedication = async (req, res, next) => {
  try {
    const medication = await Medication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found.' });
    }
    console.log('Medication updated:', medication);
    res.status(200).json({ message: 'Medication updated successfully.', medication });
  } catch (error) {
    next(error);
  }
};

// DELETE /medications/:id — soft delete
export const deleteMedication = async (req, res, next) => {
  try {
    const medication = await Medication.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { returnDocument: 'after' }
    );
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found.' });
    }
    res.status(200).json({ message: 'Medication deactivated successfully.' });
  } catch (error) {
    next(error);
  }
};

