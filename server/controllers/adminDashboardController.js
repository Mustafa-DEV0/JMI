import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import MedicalStore from "../models/MedicalStore.js";

// Get dashboard data
export const getAdminDashboard = async (req, res) => {
  try {
    const [patients, doctors, medicalStores] = await Promise.all([
      Patient.find(),
      Doctor.find(),
      MedicalStore.find(),
    ]);

    const stats = {
      totalPatients: patients.length,
      verifiedDoctors: doctors.filter((doctor) => doctor.isVerified).length,
      medicalStores: medicalStores.length,
      pendingVerifications:
        doctors.filter((doctor) => !doctor.isVerified).length +
        medicalStores.filter((store) => !store.isverified).length,
    };

    res.status(200).json({
      stats,
      patients,
      verifiedDoctors: doctors.filter((doctor) => doctor.isVerified),
      pendingDoctors: doctors.filter((doctor) => !doctor.isVerified),
      medicalStores: medicalStores.filter((store) => store.isverified),
      pendingStores: medicalStores.filter((store) => !store.isverified),
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

// Delete patient
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    await Patient.findByIdAndDelete(id);
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ error: "Failed to delete patient" });
  }
};

// Delete doctor
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    await Doctor.findByIdAndDelete(id);
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ error: "Failed to delete doctor" });
  }
};

// Delete medical store
export const deleteMedicalStore = async (req, res) => {
  try {
    const { id } = req.params;
    await MedicalStore.findByIdAndDelete(id);
    res.status(200).json({ message: "Medical store deleted successfully" });
  } catch (error) {
    console.error("Error deleting medical store:", error);
    res.status(500).json({ error: "Failed to delete medical store" });
  }
};

// Verify doctor
export const verifyDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );
    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error verifying doctor:", error);
    res.status(500).json({ error: "Failed to verify doctor" });
  }
};

// Verify medical store
export const verifyMedicalStore = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await MedicalStore.findByIdAndUpdate(
      id,
      { isverified: true },
      { new: true }
    );
    res.status(200).json(store);
  } catch (error) {
    console.error("Error verifying medical store:", error);
    res.status(500).json({ error: "Failed to verify medical store" });
  }
};
