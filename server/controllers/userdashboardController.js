import Patient from "../models/Patient.js";
import MedicalOrder from "../models/MedicalOrder.js";
import Appointment from "../models/Appointment.js";


// ✅ Function to Get Patient Details
const getPatientDetails = async (userId) => {
  try {
    const a= await Patient.findOne({ userId }) || null;
    console.log(a)
  } catch (error) {
    console.error("❌ Error fetching patient:", error);
    return null; // Prevent failure
  }
};

// ✅ Function to Get Medical Orders
const getMedicalOrders = async (userId) => {
  try {
    const b= await MedicalOrder.find({ userId }) || [];
    console.log(b)
  } catch (error) {
    console.error("❌ Error fetching medical orders:", error);
    return []; // Return empty array if error occurs
  }
};

// ✅ Function to Get Scheduled Appointments Only
const getAppointments = async (userId) => {
  try {
    const c= await Appointment.find({ userId, status: "scheduled" }) || [];
    console.log(c)
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    return []; // Return empty array if error occurs
  }
};


// ✅ Wrapper Function to Get All User Data
export const getUserDashboard = async (req, res) => {
  try {
    const { id: userId } = req.params;

    // Fetch data with `Promise.allSettled()`
    const results = await Promise.allSettled([
      getPatientDetails(userId),
      getMedicalOrders(userId),
      getAppointments(userId),
    ]);

    console.log(results)

    // ✅ Extract values, handling errors gracefully
    const patient = results[0].status === "fulfilled" ? results[0].value : null;
    const orders = results[1].status === "fulfilled" ? results[1].value : [];
    const appointments = results[2].status === "fulfilled" ? results[2].value : [];

    res.json({ patient, orders, appointments });

  } catch (error) {
    console.error("❌ Error fetching user dashboard data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
