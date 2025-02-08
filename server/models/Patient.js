import mongoose from "mongoose";
const PatientSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },

    personalDetails: {
      name: { type: String },
      phone: { type: String },
      dob: { type: Date },
      age: { type: Number },
      profileImg: { type: String },
      gender: { type: String, enum: ["Male", "Female", "Other"] },
      address: {
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
      },
      emergencyContact: {
        name: { type: String },
        phone: { type: String },
        relation: { type: String },
      },
    },

    medicalDetails: {
      bloodGroup: { type: String },
      height: { type: Number }, // in cm
      weight: { type: Number }, // in kg
      allergies: { type: [String] },
      diseases: { type: [String] },
      currentMedication: [
        {
          tabletName: { type: String },
          dosage: { type: String },
          duration: { type: String },
        },
      ],
    },

    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }],
  },
  { timestamps: true }
);

export default mongoose.model("Patient", PatientSchema);
