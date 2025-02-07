import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },

    personalDetails: {
      name: { type: String },
      age: { type: Number },
      phone: { type: String },
    },

    professionalDetails: {
      specialization: { type: String },
      qualification: { type: String },
      experience: { type: Number }, // in years
      mobileNumber: { type: String },
      consultingFees: { type: Number }, // in currency unit
      medicalLicenseId: { type: String },
    },

    availability: {
      days: { type: [String] }, // e.g., ['Monday', 'Wednesday']
      time: { type: String }, // e.g., '10:00 AM - 5:00 PM'
    },

    clinicOrHospital: {
      address: { type: String },
      officeNumber: { type: String },
    },
  },
  { timestamps: true }
);
export default mongoose.model("Doctor", doctorSchema);
