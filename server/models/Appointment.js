import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
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
   
    concerns: { type: String },
    requestedAt: { type: Date, default: Date.now }, // When the appointment was requested
    mode: { type: String },
    scheduledAt: { type: Date }, // When the appointment is actually scheduled
    status: {
      type: String,
      enum: ["pending", "scheduled", "completed", "cancelled"],
      default: "pending",
    },
    isPaid: { type: Boolean, default: false },
    prescription: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
