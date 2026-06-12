import mongoose from 'mongoose';

const deviceSessionSchema = new mongoose.Schema(
  {
    // Core relations
     patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient is required'],
    },

    // Device identity
    deviceId: {
      type: String,
      required: [true, 'Device ID is required'],
      unique: true,
      trim: true,   // hardware serial number or UUID from the smartwatch
    },

    deviceType: {
      type: String,
      required: [true, 'Device type is required'],
      enum: ['smartwatch', 'phone', 'tablet', 'other'],
      default: 'smartwatch',
    },

    deviceName: {
      type: String,
      trim: true,   // e.g. "Apple Watch Series 9", "Samsung Galaxy Watch"
    },

    deviceToken: {
      type: String,
      required: [true, 'Device token is required'],
      unique: true,
      select: false,   // never returned in queries — treated like a password
    },

    platform: {
      type: String,
      enum: ['watchOS', 'wearOS', 'tizen', 'fitbitOS', 'other'],
    },

    firmwareVersion: {
      type: String,
      required: [ true, 'Firmware version is required']
    },

    // Connection status
    isConnected: {
      type: Boolean,
      default: false,
    },

    lastSyncedAt: {
      type: Date,
      default: null,   // last time the device successfully sent data
    },

    lastHeartbeatAt: {
      type: Date,
      default: null,   // last time the device pinged the API to confirm it is online
    },


    // Dose confirmation from smartwatch 
    // When the watch detects a dose was taken (e.g. patient tapped confirm on watch face)
    lastDoseConfirmation: {
      prescriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription',
        default: null,
      },
      confirmedAt: {
        type: Date,
        default: null,
      },
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
deviceSessionSchema.index({ patientId: 1 });
deviceSessionSchema.index({ isConnected: 1 });     // find all connected devices
deviceSessionSchema.index({ lastHeartbeatAt: -1 }); // find recently active devices

const DeviceSession = mongoose.model('DeviceSession', deviceSessionSchema);

export default DeviceSession;