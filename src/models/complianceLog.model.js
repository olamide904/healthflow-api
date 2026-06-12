import mongoose from 'mongoose';

const complianceLogSchema = new mongoose.Schema(
  {
    // Core relations 
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient is required'],
    },

    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
      required: [true, 'Prescription is required'],
    },

    medicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medication',
      required: [true, 'Medication is required'],
    },

    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,   // not every log is tied to an appointment
    },

    // Dose event details
    scheduledTime: {
      type: Date,
      required: [true, 'Scheduled time is required'],  // when the dose was supposed to be taken
    },

    takenTime: {
      type: Date,
      default: null,   // when the patient actually took it (null if missed)
    },

    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['taken', 'missed', 'skipped', 'late'],
    },

    // How the log was recorded
    source: {
      type: String,
      required: [true, 'Source is required'],
      enum: ['manual', 'device'],   // manual = patient tapped app, device = smartwatch confirmed
    },

    // Device that confirmed the dose (if source is 'device')
    deviceType: {
      type: String,
      enum: ['smartwatch', 'fitnessTracker', 'other'],
      default: null,
    },
       
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeviceSession',
      default: null,
    },

    // SMS reminder context (from dataset) 
    smsReceived: {
      type: Boolean,
      default: false,   // was an SMS reminder sent before this dose event
    },
    
    // Notes
    notes: {
      type: String,
      trim: true,
      maxlength: [300, 'Notes cannot exceed 300 characters'],
    },
  },
  { timestamps: true }
);


// Indexes
complianceLogSchema.index({ patientId: 1 });
complianceLogSchema.index({ patientId: 1, status: 1 });       // compliance history per patient
complianceLogSchema.index({ patientId: 1, scheduledTime: -1 }); // latest logs first per patient
complianceLogSchema.index({ prescriptionId: 1 });
complianceLogSchema.index({ source: 1 });  // filter manual vs device logs

const ComplianceLog = mongoose.model('ComplianceLog', complianceLogSchema);

export default ComplianceLog;