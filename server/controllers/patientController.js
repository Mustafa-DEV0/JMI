import Patient from "../models/Patient.js";

export const savePatientDetails = async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from authenticated request
    const {
      personalDetails: {
        name,
        phone,
        dob,
        age,
        gender,
        address: { city, state, pincode } = {},
        emergencyContact: { name: contactName, phone: contactPhone, relation } = {},
      } = {},
      medicalDetails: {
        bloodGroup,
        height,
        weight,
        allergies = [],
        diseases = [],
        currentMedication = [],
      } = {},
    } = req.body;

    // Find the patient by userId
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Assign new details
    patient.personalDetails = {
      name: name || "",
      phone: phone || "",
      dob: dob || null,
      age: age || null,
      gender: gender || "Other",
      address: {
        city: city || "",
        state: state || "",
        pincode: pincode || "",
      },
      emergencyContact: {
        name: contactName || "",
        phone: contactPhone || "",
        relation: relation || "",
      },
    };

    patient.medicalDetails = {
      bloodGroup: bloodGroup || "",
      height: height || null,
      weight: weight || null,
      allergies,
      diseases,
      currentMedication: currentMedication.map((med) => ({
        tabletName: med.tabletName || "",
        dosage: med.dosage || "",
        duration: med.duration || "",
      })),
    };

    // Save the updated patient details
    await patient.save();
    res.status(200).json({ message: "Patient details saved successfully", patient });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
