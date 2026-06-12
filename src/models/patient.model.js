import mongoose from "mongoose";


const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: [true, 'Patient ID is required'],
      unique: true,
      trim: true,
    },

    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [15, 'First name cannot exceed 15 characters'],
    },

    lastName: {
      type: String,
      required: [true, 'Last name is required'],  
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [15, 'Last name cannot exceed 15 characters'],
    },


    gender: {
      type: String,
      enum: ['M', 'F'],
      required: [true, 'Gender is required'],
    },

    age: {
      type: Number,
      min: [0, 'Age cannot be negative'],
      max: [130, 'Age value is not valid'],
    },

    neighbourhood: {
      type: String,
      trim: true,
      required: [true, 'Neighbourhood is required'],
    },

    scholarship: {
      type: Boolean,
      default: false,
    },

    conditions: {
        hypertension: { type: Boolean, default: false },
        diabetes: { type: Boolean, default: false },
        alcoholism: { type: Boolean, default: false },
        handicap: { type: Boolean, default: false },
    },

    guardianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Guardian',
    },

    isActive: {
      type: Boolean,
      default: true,
    }
  });

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;