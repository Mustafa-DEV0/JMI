import mongoose from "mongoose";

const MedicalStoreSchema = new mongoose.Schema(
  {
    email: {
      type: String,

      unique: true,
      trim: true,
    },
    password: {
      type: String,
    },
    name: {
      type: String,

      trim: true,
    },
    owner: {
      type: String,

      trim: true,
    },
    isverified: {
      type: Boolean,
      default: false,
    },
<<<<<<< HEAD
=======
   
>>>>>>> ca7b55506f82be12f794d9259573f9030809902b
    licenseNumber: {
      type: String,

      unique: true,
      trim: true,
    },
    contactDetails: {
      phone: {
        type: String,

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
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      pinCode: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    workingHours: {
      openTime: {
        type: String,
      },
      closeTime: {
        type: String,
      },
      daysOpen: {
        type: [String], //["Monday", "Tuesday", "Wednesday"]
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
  },
  { timestamps: true }
);

export default mongoose.model("MedicalStore", MedicalStoreSchema);
