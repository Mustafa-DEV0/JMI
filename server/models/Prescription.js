import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    issuedAt: { type: Date, default: Date.now }, // Date and time when prescription was issued
    medications: [
      {
        medicine: { type: String, required: true },
        dosage: { type: String, required: true },
        duration: { type: String, required: true },
      },
    ],
    remarks: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", prescriptionSchema);
