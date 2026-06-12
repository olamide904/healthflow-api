import Patient from "../models/patient.model.js";
import Guardian from "../models/guardian.model.js";


// POST /patients — create patient
export const createPatient = async (req, res, next) => {
  try {
    const patient = new Patient({
      ...req.body,
      guardianId: req.user.id,  // automatically assigned to logged in guardian
    });
    await patient.save();

    await Guardian.findByIdAndUpdate(req.user.id, { $push: { patients: patient._id } });

    console.log('Patient created:', patient);

    res.status(201).json({ message: 'Patient created successfully.', patient });
  } catch (error) {
    next(error);
  }
};

// GET /patients — get all patients (for logged in guardian)
export const getAllPatients = async (req, res, next) => {
  try {
    const { page = 1, limit = 2 } = req.query;
    const skip = (page - 1) * limit;
    
    const totalPatients = await Patient.countDocuments({ guardianId: req.user.id, isActive: true });
    
    const patients = await Patient.find({ guardianId: req.user.id, isActive: true }).skip(skip).limit(limit);
    console.log(`Retrieved ${patients.length} patients for guardian ${req.user.id} (page ${page})`, patients);

    res.status(200).json({ 
        totalPatients, 
        page, 
        pages: Math.ceil(totalPatients / limit),
        message: `${patients.length} patients found.`,
        patients 
    });
  } catch (error) {
    next(error);
  }
};

// GET /patients/:id — get single patient
export const getPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('guardianId', 'firstName lastName email role');
    if (!patient || !patient.isActive) {
      return res.status(404).json({ message: 'Patient not found.' });
    }
    console.log(`Retrieved patient ${patient._id} for guardian ${req.user.id}`);
    res.status(200).json({ message: 'Patient found.', patient });
  } catch (error) {
    next(error);
  }
};

// PATCH /patients/:id — update patient
export const updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }
    console.log(`Updated patient ${patient._id} for guardian ${req.user.id}`);
    res.status(200).json({ message: 'Patient updated successfully.',
  patient: {
    _id:           patient._id,
    patientId:     patient.patientId,
    firstName:     patient.firstName,
    lastName:      patient.lastName,      
    gender:        patient.gender,
    age:           patient.age,
    neighbourhood: patient.neighbourhood,
    scholarship:   patient.scholarship,
    conditions:    patient.conditions,
    guardianId:    patient.guardianId,
    isActive:      patient.isActive,
 }
  });
  } catch (error) {
    next(error);
  }
};

// DELETE /patients/:id — soft delete
export const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { returnDocument: 'after' }
    );
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }
    console.log(`Deactivated patient ${patient._id} for guardian ${req.user.id}`);
    await Guardian.findByIdAndUpdate(req.user.id, { $pull: { patients: patient._id } });
    
    res.status(200).json({ message: 'Patient deactivated successfully.' });
  } catch (error) {
    next(error);
  }
};
