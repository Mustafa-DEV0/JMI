import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Patient", PatientSchema);
