import mongoose from 'mongoose';


const guardianSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,   // never returned in queries by default
    },

    role: {
      type: String,
      enum: ['doctor', 'guardian', 'nurse'],
      default: 'guardian',
    },

    // Doctor-specific fields
    specialisation: {
      type: String,
      trim: true,
    },


    // Patients assigned to this guardian/doctor
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


// Indexes 
guardianSchema.index({ role: 1 });

const Guardian = mongoose.model('Guardian', guardianSchema);

export default Guardian;