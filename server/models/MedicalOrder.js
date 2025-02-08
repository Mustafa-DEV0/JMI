const mongoose = require("mongoose");

const MedicalOrderSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    medical: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medical", // Reference to the Medical model
      required: true,
    },
    medicines: [
      {
        name: { type: String, required: true }, // Medicine name
        quantity: { type: Number, required: true, min: 1 }, // Quantity
      },
    ],
    prescriptionImage: {
      type: String, // URL of the uploaded prescription image
      required: true, // Ensure prescription is uploaded
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Rejected", "Delivered"],
      default: "Pending",
    },
    totalPrice: {
      type: Number,
      default: 0, // To be updated by the medical store
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    },
    orderedAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalOrder", MedicalOrderSchema);
