import ComplianceLog from "../models/complianceLog.model.js";



// GET /patients/:patientId/compliance — get all compliance logs for a patient
export const getPatientComplianceLogs = async (req, res, next) => {
  try {
    const { status, source, startDate, endDate } = req.query;
    const filter = { patientId: req.params.patientId };

    if (status) filter.status = status;
    if (source) filter.source = source;

    // Date range filter
    if (startDate || endDate) {
      filter.scheduledTime = {};
      if (startDate) filter.scheduledTime.$gte = new Date(startDate);
      if (endDate)   filter.scheduledTime.$lte = new Date(endDate);
    }

    const logs = await ComplianceLog.find(filter)
      .populate('medicationId', 'name strength dosageForm')
      .populate('prescriptionId', 'frequency dosage')
      .sort({ scheduledTime: -1 });

    // Compliance score — percentage of doses taken
    const total  = logs.length;
    const taken  = logs.filter((log) => log.status === 'taken').length;
    const score  = total > 0 ? Math.round((taken / total) * 100) : 0;

    res.status(200).json({ message: `${total} logs found`, complianceScore: `${score}%`, logs });
  } catch (error) {
    next(error); 
  }
};

// GET /patients/:patientId/compliance/:id — get single log
export const getComplianceLog = async (req, res, next) => {
  try {
    const log = await ComplianceLog.findOne({
      _id: req.params.id,
      patientId: req.params.patientId,
    })
      .populate('medicationId', 'name strength')
      .populate('deviceId', 'deviceName deviceType');

    if (!log) {
      return res.status(404).json({ message: 'Compliance log not found.' });
    }
    res.status(200).json({ log });
  } catch (error) {
    next(error);
  }
};

// POST /patients/:patientId/compliance — log a dose event
export const createComplianceLog = async (req, res, next) => {
  try {
    const log = new ComplianceLog({
      ...req.body,
      patientId: req.params.patientId,
    });
    await log.save();
    res.status(201).json({ message: 'Compliance log recorded.', log });
  } catch (error) {
    next(error);
  }
};

// PATCH /patients/:patientId/compliance/:id — update log
export const updateComplianceLog = async (req, res, next) => {
  try {
    const log = await ComplianceLog.findOneAndUpdate(
      { _id: req.params.id, patientId: req.params.patientId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!log) {
      return res.status(404).json({ message: 'Compliance log not found.' });
    }
    res.status(200).json({ message: 'Compliance log updated.', log });
  } catch (error) {
    next(error);
  }
};

// GET /patients/:patientId/compliance/summary — compliance summary stats
export const getComplianceSummary = async (req, res, next) => {
  try {
    const logs = await ComplianceLog.find({ patientId: req.params.patientId });

    const total   = logs.length;
    const taken   = logs.filter((l) => l.status === 'taken').length;
    const missed  = logs.filter((l) => l.status === 'missed').length;
    const skipped = logs.filter((l) => l.status === 'skipped').length;
    const late    = logs.filter((l) => l.status === 'late').length;
    const manual  = logs.filter((l) => l.source === 'manual').length;
    const device  = logs.filter((l) => l.source === 'device').length;
    const score   = total > 0 ? Math.round((taken / total) * 100) : 0;

    res.status(200).json({
      summary: {
        total,
        taken,
        missed,
        skipped,
        late,
        complianceScore: `${score}%`,
        bySource: { manual, device },
      },
    });
  } catch (error) {
    next(error);
  }
};

