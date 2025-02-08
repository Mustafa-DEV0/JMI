import MedicalStore from "../models/MedicalStore.js";

export const saveMedicalStoreDetails = async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID
    const {
      formData: {
        name,
        owner,
        medicalImage,
        licenseNumber,
        contactDetails = {},
        address = {},
        workingHours = {},
        deliveryOptions = {},
        paymentMethods = {},
        emergencyServices = {},
      },
    } = req.body;

    console.log(req.body);

    const { phone, website } = contactDetails;
    const { street, city, state, pinCode, country } = address;
    const { openTime, closeTime, daysOpen } = workingHours;
    const { homeDelivery, onlineOrders } = deliveryOptions;
    const { acceptsCash, acceptsCard, acceptsUPI } = paymentMethods;
    const { open24Hours } = emergencyServices;

    // Find the existing medical store
    const medicalStore = await MedicalStore.findById(id);
    if (!medicalStore) {
      return res.status(404).json({ message: "Medical store not found" });
    }

    // Update fields only if provided
    medicalStore.name = name || medicalStore.name || "";
    medicalStore.owner = owner || medicalStore.owner || "";
    medicalStore.medicalImage = medicalImage || medicalStore.medicalImage || "";
    medicalStore.licenseNumber = licenseNumber || medicalStore.licenseNumber || "";

    medicalStore.contactDetails = {
      phone: phone || medicalStore.contactDetails.phone || "",
      website: website || medicalStore.contactDetails.website || "",
    };
    medicalStore.address = {
      street: street || medicalStore.address.street || "",
      city: city || medicalStore.address.city || "",
      state: state || medicalStore.address.state || "",
      pinCode: pinCode || medicalStore.address.pinCode || "",
      country: country || medicalStore.address.country || "",
    };
    medicalStore.workingHours = {
      openTime: openTime || medicalStore.workingHours.openTime || "",
      closeTime: closeTime || medicalStore.workingHours.closeTime || "",
      daysOpen: daysOpen || medicalStore.workingHours.daysOpen || [],
    };
    medicalStore.deliveryOptions = {
      homeDelivery: homeDelivery !== undefined ? homeDelivery : medicalStore.deliveryOptions.homeDelivery,
      onlineOrders: onlineOrders !== undefined ? onlineOrders : medicalStore.deliveryOptions.onlineOrders,
    };
    medicalStore.paymentMethods = {
      acceptsCash: acceptsCash !== undefined ? acceptsCash : medicalStore.paymentMethods.acceptsCash,
      acceptsCard: acceptsCard !== undefined ? acceptsCard : medicalStore.paymentMethods.acceptsCard,
      acceptsUPI: acceptsUPI !== undefined ? acceptsUPI : medicalStore.paymentMethods.acceptsUPI,
    };
    medicalStore.emergencyServices = {
      open24Hours: open24Hours !== undefined ? open24Hours : medicalStore.emergencyServices.open24Hours,
    };

    await medicalStore.save();

    res.status(200).json({
      message: "Medical store details updated successfully",
      medicalStore,
    });
    console.log(medicalStore);
    
  } catch (error) {
    console.error("Error saving medical store:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
