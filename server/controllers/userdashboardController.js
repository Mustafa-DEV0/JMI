import Patient from "../models/Patient.js";
import MedicalOrder from "../models/MedicalOrder.js";
import Appointment from "../models/Appointment.js";

const getPatientDetails = async (_id) => {
  try {
    return await Patient.findOne({ _id });
  } catch (error) {
    console.error("❌ Error fetching patient:", error);
    return null;
  }
};

// ✅ Function to Get Medical Orders
const getMedicalOrders = async (_id) => {
  try {
    return await MedicalOrder.find({ _id });
  } catch (error) {
    console.error("❌ Error fetching medical orders:", error);
    return []; // Return empty array if error occurs
  }
};

// ✅ Function to Get Scheduled Appointments Only
const getAppointments = async (_id) => {
  try {
    return await Appointment.find({ _id, status: "scheduled" });
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    return []; // Return empty array if error occurs
  }
};

// ✅ Wrapper Function to Get All User Data
export const getUserDashboard = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch data with `Promise.allSettled()`
    const results = await Promise.allSettled([
      getPatientDetails(id),
      getMedicalOrders(id),
      getAppointments(id),
    ]);

    // ✅ Extract values, handling errors gracefully
    const patient = results[0].status === "fulfilled" ? results[0].value : null;
    const orders = results[1].status === "fulfilled" ? results[1].value : [];
    const appointments =
      results[2].status === "fulfilled" ? results[2].value : [];

    res.json({ patient, orders, appointments });
  } catch (error) {
    console.error("❌ Error fetching user dashboard data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
