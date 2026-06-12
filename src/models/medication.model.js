import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Medication name is required'],
      trim: true,
    },

    genericName: {
      type: String,
      trim: true,
    },

    dosageForm: {
      type: String,
      required: [true, 'Dosage form is required'],
      enum: ['tablet', 'capsule', 'syrup', 'injection', 'inhaler', 'other'],
    },

    strength: {
      value: {
         type: Number,
         required: [true, 'Strength value is required'],
         min: [0, 'Strength value must be positive']
        },
      unit: {
        type: String,
        required: [true, 'Strength unit is required'],
        enum: ['mg', 'mcg', 'g', 'ml', 'IU', '%'],
      },
    },

    // Default frequency — can be overridden per prescription
    defaultFrequency: {
      type: String,
      enum: ['once daily', 'twice daily', 'three times daily', 'four times daily', 'every 8 hours', 'every 12 hours', 'as needed', 'weekly', 'monthly'],
    },

    // Conditions this medication is commonly used for
    usedFor: {
      type: [String],
      enum: ['hypertension', 'diabetes', 'alcoholism', 'handicap', 'other'],
    },

    sideEffects: {
      type: [String],
      enum: [
        'headache', 'nausea', 'dizziness', 'fatigue', 'runny nose', 'sore throat', 'flushing', 
        'drowsiness', 'diarrhea', 'insomnia', 'other'
      ],
    },

    contraindications: {
      type: [String],
      default: [],
    },

    requiresPrescription: {
      type: Boolean,
      default: true,
    },

    manufacturer: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
   { timestamps: true },
);


// --- Indexes ---
medicationSchema.index({ name: 1 });
medicationSchema.index({ usedFor: 1 });   // query meds by condition e.g. usedFor: 'diabetes'
medicationSchema.index({ isActive: 1 });

const Medication = mongoose.model('Medication', medicationSchema);

export default Medication;