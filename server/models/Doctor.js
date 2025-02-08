import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    profileImg: { type: String },

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
      days: { type: [String] },
      time: { type: String },
    },

    clinicOrHospital: {
      address: { type: String },
      officeNumber: { type: String },
    },
  },
  { timestamps: true }
);
export default mongoose.model("Doctor", DoctorSchema);
