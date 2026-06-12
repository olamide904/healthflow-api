import Guardian from "../models/guardian.model.js";


// GET /guardians/:id/patients — get all patients under a guardian
export const getGuardianPatients = async (req, res, next) => {
  try {
    if (req.user.id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized to view these patients.' });
    }
    const guardian = await Guardian.findById(req.params.id).populate('patients', 'firstName lastName age gender condition');
    if (!guardian) {
      return res.status(404).json({ message: 'Guardian not found.' });
    }
    res.status(200).json({ message: `${guardian.patients.length} patients found`, patients: guardian.patients });
  } catch (error) {
    next(error);
  }
};

// PATCH /guardians/:id — update guardian profile
export const updateGuardian = async (req, res, next) => {
  try {
    if (req.user.id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized to update this profile.' });
    }
    const guardian = await Guardian.findByIdAndUpdate(
      req.user.id,
      req.body,
      { returnDocument: "after", runValidators: true }
    );
    if (!guardian) {
      return res.status(404).json({ message: 'Guardian not found.' });
    }
    res.status(200).json({ message: 'Profile updated successfully.', guardian });
  } catch (error) {
    next(error);
  }
};

// DELETE /guardians/:id — soft delete
export const deactivateGuardian = async (req, res, next) => {
  try {
    if (req.user.id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized to deactivate this account.' });
    }
    const guardian = await Guardian.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!guardian) {
      return res.status(404).json({ message: 'Guardian not found.' });
    }
    res.status(200).json({ message: 'Account deactivated successfully.' });
  } catch (error) {
    next(error);
  }
};

