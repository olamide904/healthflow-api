import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    // From dataset
    appointmentId: {
      type: String,
      required: [true, 'Appointment ID is required'],
      unique: true,
      trim: true,
    },

    // Core relations 
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient is required'],
    },

    guardianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Guardian',
      default: null,
    },

    // Date 
    scheduledDay: {
      type: Date,
      required: [true, 'Scheduled day is required'], // when the appointment was scheduled
    },

    appointmentDay: {
      type: Date,
      required: [true, 'Appointment day is required'], // actual date of appointment
    },

    // Status
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'missed', 'cancelled', 'rescheduled'],
      default: 'scheduled',
    },

    // Directly from dataset — No-show column
    noShow: {
      type: Boolean,
      default: false,
    },

    // Reminder context (from dataset)
    smsReceived: {
      type: Boolean,
      default: false,  // was an SMS reminder sent before this appointment
    },

    // Appointment details
    reason: {
      type: String,
      trim: true,
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },

    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },


    // --- System ---
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);



// --- Indexes ---
appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ patientId: 1, status: 1 });         // all missed appointments per patient
appointmentSchema.index({ patientId: 1, appointmentDay: -1 }); // latest appointments first
appointmentSchema.index({ guardianId: 1 });                    // all appointments under a doctor
appointmentSchema.index({ noShow: 1 });                        // data analyst queries
appointmentSchema.index({ appointmentDay: 1 });                // upcoming appointments

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;