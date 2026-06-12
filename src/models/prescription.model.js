import mongoose from 'mongoose';


const prescriptionSchema = new mongoose.Schema(
  {
    // Core relations
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient ID is required'],
    },
    
    medicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medication',
      required: [true, 'Medication ID is required'],
    },

    prescribedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Guardian',
      required: [true, 'Prescribing doctor ID is required'],
    },

    // Dosage instructions
    dosage: {
      amount: {
        type: Number,
        required: [true, 'Dosage amount is required'],
      },
      unit: {
        type: String,
        required: [true, 'Dosage unit is required'],
        enum: ['tablet(s)', 'capsule(s)', 'ml', 'mg', 'drop(s)', 'puff(s)'],
      },
    },

    frequency: {
      type: String,
      required: [true, 'Frequency is required'],
      enum: [
        'once daily', 'twice daily', 'three times daily', 'four times daily',
      'every 8 hours', 'every 12 hours', 'as needed', 'weekly', 'monthly']
    },

    // Times of day the patient should take the medication, e.g. ['08:00', '14:00', '20:00'] for thrice daily
    scheduledTimes: {
      type: [String],
      default: ['08:00', '14:00', '20:00'],
    },

    instructions: {
      type: String,
      enum: ['before meal', 'after meal', 'with water', 'with food', 'on empty stomach', 'at bedtime'],
      default: 'none',
    },

    //  Duration
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },

    endDate: {
      type: Date,
    },

    durationDays: {
      type: Number,
      min: [1, 'Duration must be at least 1 day'],
    },

    // Status
    status: {
      type: String,
      enum: ['active', 'completed', 'paused', 'cancelled'],
      default: 'active',
    },

    refillsAllowed: {
      type: Number,
      default: 0,
      min: 0,
    },


    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },

    // System
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


// --- Indexes ---
prescriptionSchema.index({ patientId: 1 });
prescriptionSchema.index({ patientId: 1, status: 1 });   // fetch all active prescriptions for a patient
prescriptionSchema.index({ medicationId: 1 });
prescriptionSchema.index({ prescribedBy: 1 });

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;