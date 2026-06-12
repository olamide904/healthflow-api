import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema(
  {
    // Core relations 
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient is required'],
    },

    // A reminder is tied to either a prescription or an appointment — not always both
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
      default: null,
    },

    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },

    // Reminder type 
    type: {
      type: String,
      required: [true, 'Reminder type is required'],
      enum: ['medication', 'appointment'],
    },

    // Schedule 
    scheduledTime: {
      type: Date,
      required: [true, 'Scheduled time is required'],
    },

    // For recurring medication reminders e.g. every day at 08:00
    isRecurring: {
      type: Boolean,
      default: false,
    },

    recurrence: {
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: null,
      },
      // Days of week for weekly recurrence e.g. ['Monday', 'Wednesday', 'Friday']
      daysOfWeek: {
        type: [String],
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        default: [],
      },
      // Time in HH:MM 24-hour format e.g. '08:00'
      time: {
        type: String,
        match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be in HH:MM 24-hour format'],
        default: null,
      },
      // When the recurrence ends
      endDate: {
        type: Date,
        default: null,
      },
    },

    // Delivery channels
    channels: {
      sms: {
        type: Boolean,
        default: false,
      },

      push: {
        type: Boolean,
        default: false,
      },
      
      email: {
        type: Boolean,
        default: false,
      },
    },

    // Status
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'cancelled'],
      default: 'pending',
    },

    sentAt: {
      type: Date,
      default: null,   // timestamp of when the reminder was actually dispatched
    },

    // --- Patient response ---
    acknowledged: {
      type: Boolean,
      default: false,   // did the patient tap/confirm the reminder
    },

    acknowledgedAt: {
      type: Date,
      default: null,
    },

    message: {
      type: String,
      trim: true,
      maxlength: [300, 'Message cannot exceed 300 characters'],
    },

    // System
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);



// Indexes 
reminderSchema.index({ patientId: 1 });
reminderSchema.index({ status: 1, scheduledTime: 1 });  // reminder service: find all pending due reminders
reminderSchema.index({ patientId: 1, status: 1 });      // patient's pending reminders
reminderSchema.index({ prescriptionId: 1 });
reminderSchema.index({ appointmentId: 1 });
reminderSchema.index({ scheduledTime: 1 });             // cron job scans by scheduled time

const Reminder = mongoose.model('Reminder', reminderSchema);

export default Reminder;