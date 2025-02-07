import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialization: { type: String, required: true }, // Example: Cardiologist, Surgeon
  certificate: { type: String, required: true }, // File URL of the uploaded certificate
  isVerified: { type: Boolean, default: false }, // Admin verification status
  rating: { type: Number, default: 0, min: 0, max: 5 }, // Doctor rating (0 to 5)
  reviews: [
    {
      patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
      rating: { type: Number, min: 0, max: 5 },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Doctor", DoctorSchema);
