import mongoose from "mongoose";

const MedicalStoreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: String,
      required: true,
      trim: true,
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    medicalImage: {
      type: String, // URL of the uploaded medical image
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    contactDetails: {
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
      },
      website: {
        type: String,
        trim: true,
      },
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pinCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    workingHours: {
      openTime: {
        type: String,
        required: true,
      },
      closeTime: {
        type: String,
        required: true,
      },
      daysOpen: {
        type: [String], //["Monday", "Tuesday", "Wednesday"]
        required: true,
      },
    },

    deliveryOptions: {
      homeDelivery: {
        type: Boolean,
        default: false,
      },
      onlineOrders: {
        type: Boolean,
        default: false,
      },
    },
    paymentMethods: {
      acceptsCash: {
        type: Boolean,
        default: true,
      },
      acceptsCard: {
        type: Boolean,
        default: true,
      },
      acceptsUPI: {
        type: Boolean,
        default: false,
      },
    },

    emergencyServices: {
      open24Hours: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("MedicalStore", MedicalStoreSchema);
