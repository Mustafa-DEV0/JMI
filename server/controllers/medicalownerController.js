import MedicalStore from "../models/MedicalStore.js";
import MedicalOrder from "../models/MedicalOrder.js";

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
       
      },
    } = req.body;

    console.log(req.body);

    const { phone, website } = contactDetails;
    const { street, city, state, pinCode, country } = address;
    const { openTime, closeTime, daysOpen } = workingHours;
    const { homeDelivery, onlineOrders } = deliveryOptions;
    const { acceptsCash, acceptsCard, acceptsUPI } = paymentMethods;
    

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


// Get medical store details
export const getMedicalStoreDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const medicalStore = await MedicalStore.findById(id);
    
    if (!medicalStore) {
      return res.status(404).json({ message: "Medical store not found" });
    }

    res.status(200).json({ medicalStore });
  } catch (error) {
    console.error("Error fetching medical store:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get medical store orders
export const getMedicalStoreOrders = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received Medical Store ID:", id, "Type:", typeof id); 

    const orders = await MedicalOrder.find({ medical: id })  // No need for `id.toString()`
      .populate("patient", "name")  
      .sort({ orderedAt: -1 });

    console.log("Fetched Orders from DB:", orders);

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["Pending", "Confirmed", "Rejected", "Delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    // Handle bill image (if uploaded for 'Delivered' status)
    const billImagePath = req.file ? req.file.path : null;
    const updateFields = { status };
    if (billImagePath && status === "Delivered") {
      updateFields.billImage = billImagePath;
    }

    // Update order
    const updatedOrder = await MedicalOrder.findByIdAndUpdate(
      orderId,
      { $set: updateFields },
      { new: true } // Return updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
